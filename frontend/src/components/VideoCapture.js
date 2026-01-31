import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import axios from 'axios';
import { API_URL } from '../config';
import './VideoCapture.css';

const VideoCapture = ({ onDetectionResult }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [camera, setCamera] = useState(null);
  const [pose, setPose] = useState(null);
  const [backendConnected, setBackendConnected] = useState(true);
  const [backendError, setBackendError] = useState(null);
  const lastRequestTime = useRef(0);
  const pendingRequest = useRef(null);
  const errorCount = useRef(0);
  const lastAnnotatedImage = useRef(null); // Store last server skeleton overlay
  const REQUEST_INTERVAL = 3000; // 3 seconds between requests

  const checkBackendConnection = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/health`, {
        timeout: 3000
      });
      if (response.data) {
        setBackendConnected(true);
        setBackendError(null);
        errorCount.current = 0;
      }
    } catch (error) {
      setBackendConnected(false);
      setBackendError('Backend server is not running. Please start it first.');
      errorCount.current = 0;
    }
  }, []);

  const calculateAndDetectACL = useCallback(async (results) => {
    if (!results.poseLandmarks || !videoRef.current) return;

    // Don't send requests if backend is not connected
    if (!backendConnected) {
      return;
    }

    // Cancel any pending request
    if (pendingRequest.current) {
      pendingRequest.current.cancel?.();
    }

    try {
      // Create cancel token for this request
      const cancelTokenSource = axios.CancelToken.source();
      pendingRequest.current = { cancel: () => cancelTokenSource.cancel() };

      // Convert video frame to base64 with lower quality to reduce size
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.6);
      
      // Send to backend for ACL detection
      const response = await axios.post(
        `${API_URL}/detect-base64`,
        { image: imageData },
        { 
          cancelToken: cancelTokenSource.token,
          timeout: 10000 // 10 second timeout
        }
      );

      if (response.data.success) {
        onDetectionResult(response.data);
        // Store the server's annotated image for continuous display
        if (response.data.annotated_image) {
          lastAnnotatedImage.current = response.data.annotated_image;
        }
        setBackendConnected(true);
        setBackendError(null);
        errorCount.current = 0;
      }
      
      pendingRequest.current = null;
    } catch (error) {
      if (axios.isCancel(error)) {
        // Request was cancelled, don't log
        return;
      }
      
      errorCount.current += 1;
      
      // Only log first few errors to avoid spam
      if (errorCount.current <= 3) {
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          setBackendError('Backend server is not responding. Please check if it\'s running.');
          setBackendConnected(false);
        } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          setBackendError('Cannot connect to backend server. Please start it on port 8000.');
          setBackendConnected(false);
        } else {
          console.error('Error detecting ACL:', error);
        }
      }
      
      // Try to reconnect after 5 errors
      if (errorCount.current === 5) {
        setTimeout(() => {
          checkBackendConnection();
        }, 5000);
      }
      
      pendingRequest.current = null;
    }
  }, [backendConnected, onDetectionResult, checkBackendConnection]);

  useEffect(() => {
    const initializePose = async () => {
      const poseInstance = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        },
      });

      poseInstance.setOptions({
        modelComplexity: 2,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      poseInstance.onResults((results) => {
        if (videoRef.current && canvasRef.current) {
          // Always draw the current video frame to canvas for smooth display
          const videoWidth = videoRef.current.videoWidth || 640;
          const videoHeight = videoRef.current.videoHeight || 480;
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;
          
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          
          // If we have a server-annotated image with skeleton, use that
          // Otherwise, just draw the raw video
          if (lastAnnotatedImage.current) {
            const img = new Image();
            img.onload = () => {
              ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
            };
            img.src = lastAnnotatedImage.current;
          } else {
            // No skeleton yet, just draw raw video
            ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
          }
          
          // Throttled detection - only send to server if enough time has passed
          if (results.poseLandmarks) {
            const now = Date.now();
            if (now - lastRequestTime.current >= REQUEST_INTERVAL) {
              lastRequestTime.current = now;
              calculateAndDetectACL(results);
            }
          }
        }
      });

      setPose(poseInstance);
    };

    initializePose();

    // Check backend connection on mount
    checkBackendConnection();

    return () => {
      if (camera) {
        camera.stop();
      }
      if (pendingRequest.current) {
        // Cancel pending request if component unmounts
        pendingRequest.current.cancel?.();
      }
    };
  }, [checkBackendConnection, camera, calculateAndDetectACL]);

  const startCamera = async () => {
    if (!videoRef.current || !pose) return;

    try {
      const cameraInstance = new Camera(videoRef.current, {
        onFrame: async () => {
          await pose.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });

      cameraInstance.start();
      setCamera(cameraInstance);
      setIsStreaming(true);
      lastRequestTime.current = 0; // Reset timer
    } catch (error) {
      console.error('Error starting camera:', error);
      alert('Error accessing camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (camera) {
      camera.stop();
      setCamera(null);
    }
    if (pendingRequest.current) {
      pendingRequest.current.cancel?.();
      pendingRequest.current = null;
    }
    setIsStreaming(false);
    lastRequestTime.current = 0;
    lastAnnotatedImage.current = null; // Clear cached skeleton
  };

  return (
    <div className="video-capture">
      {backendError && (
        <div className="backend-error" style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '15px',
          border: '1px solid #ef5350'
        }}>
          <strong>Backend Connection Error:</strong>
          <p style={{ margin: '5px 0 0 0' }}>{backendError}</p>
          <p style={{ margin: '10px 0 0 0', fontSize: '0.9em' }}>
            To start the backend, run in terminal:
            <br />
            <code style={{ 
              background: '#fff', 
              padding: '5px 10px', 
              borderRadius: '3px',
              display: 'inline-block',
              marginTop: '5px'
            }}>
              cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000
            </code>
          </p>
          <button 
            onClick={checkBackendConnection}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry Connection
          </button>
        </div>
      )}
      <div className="video-container">
        <div className="video-wrapper">
          <video
            ref={videoRef}
            className="video-element"
            autoPlay
            playsInline
            style={{ display: 'none' }}
          />
          <canvas
            ref={canvasRef}
            className="canvas-element"
            width={640}
            height={480}
            style={{ display: isStreaming ? 'block' : 'none', position: 'relative' }}
          />
          {!isStreaming && (
            <div className="video-placeholder">
              <p>Camera feed will appear here</p>
              <p className="placeholder-subtitle">Click "Start Camera" to begin</p>
            </div>
          )}
        </div>
      </div>
      <div className="controls">
        {!isStreaming ? (
          <button onClick={startCamera} className="btn btn-start">
            Start Camera
          </button>
        ) : (
          <button onClick={stopCamera} className="btn btn-stop">
            Stop Camera
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCapture;
