import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PoseLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';
import axios from 'axios';
import { API_URL } from '../config';
import './VideoCapture.css';

const VideoCapture = ({ onDetectionResult }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [camera, setCamera] = useState(null);
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [backendConnected, setBackendConnected] = useState(true);
  const [backendError, setBackendError] = useState(null);
  const lastRequestTime = useRef(0);
  const pendingRequest = useRef(null);
  const errorCount = useRef(0);
  const animationFrameRef = useRef(null);
  const isStreamingRef = useRef(false);
  const REQUEST_INTERVAL = 3000; // 3 seconds between requests
  const MODEL_URL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";
  
  // Pose connections for drawing skeleton (MediaPipe Pose landmark indices)
  const POSE_CONNECTIONS = [
    [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19], [12, 14],
    [14, 16], [16, 18], [16, 20], [16, 22], [18, 20], [11, 23], [12, 24], [23, 24],
    [23, 25], [24, 26], [25, 27], [26, 28], [27, 29], [28, 30], [29, 31], [30, 32],
    [27, 31], [28, 32]
  ];

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

  const calculateAndDetectACL = useCallback(async (landmarks) => {
    if (!landmarks || landmarks.length === 0 || !videoRef.current) return;

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
        // Server's annotated image is not used in live camera mode
        // We only use the risk calculation results
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
    const initializePoseLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
        );
        
        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MODEL_URL,
            delegate: "GPU"
          },
          outputSegmentationMasks: false,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
          numPoses: 1,
          runningMode: "VIDEO"
        });

        setPoseLandmarker(landmarker);
      } catch (error) {
        console.error('Error initializing Pose Landmarker:', error);
        setBackendError('Failed to initialize pose detection. Please refresh the page.');
      }
    };

    initializePoseLandmarker();

    // Check backend connection on mount
    checkBackendConnection();

    return () => {
      // Cleanup on unmount only
      if (pendingRequest.current) {
        pendingRequest.current.cancel?.();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [checkBackendConnection]);

  const startCamera = async () => {
    if (!videoRef.current || !poseLandmarker) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      
      videoRef.current.srcObject = stream;
      
      const drawingUtils = new DrawingUtils(canvasRef.current.getContext('2d'));

      const processFrame = () => {
        if (!videoRef.current || !canvasRef.current || !poseLandmarker || !isStreamingRef.current) {
          return;
        }

        const videoWidth = videoRef.current.videoWidth || 640;
        const videoHeight = videoRef.current.videoHeight || 480;

        // Resize canvas if needed
        if (canvasRef.current.width !== videoWidth || canvasRef.current.height !== videoHeight) {
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;
        }

        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw the live video frame
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

        // Detect pose landmarks
        const startTimeMs = performance.now();
        const results = poseLandmarker.detectForVideo(videoRef.current, startTimeMs);

        // Draw skeleton overlay if landmarks detected
        if (results.landmarks && results.landmarks.length > 0) {
          const landmarks = results.landmarks[0];
          
          // Draw pose connections and landmarks using DrawingUtils
          drawingUtils.drawLandmarks(landmarks, {
            radius: 6,
            color: '#FF0000'
          });
          drawingUtils.drawConnectors(landmarks, POSE_CONNECTIONS, {
            color: '#00FF00',
            lineWidth: 4
          });

          // Throttled detection - only send to server if enough time has passed
          const now = Date.now();
          if (now - lastRequestTime.current >= REQUEST_INTERVAL) {
            lastRequestTime.current = now;
            calculateAndDetectACL(landmarks);
          }
        }

        // Continue processing frames
        if (isStreamingRef.current) {
          animationFrameRef.current = requestAnimationFrame(processFrame);
        }
      };

      videoRef.current.addEventListener('loadeddata', () => {
        videoRef.current.play();
        setIsStreaming(true);
        isStreamingRef.current = true;
        lastRequestTime.current = 0;
        // Start processing frames
        animationFrameRef.current = requestAnimationFrame(processFrame);
      });

      setCamera(stream);
    } catch (error) {
      console.error('Error starting camera:', error);
      alert('Error accessing camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    isStreamingRef.current = false;
    if (camera) {
      camera.getTracks().forEach(track => track.stop());
      setCamera(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (pendingRequest.current) {
      pendingRequest.current.cancel?.();
      pendingRequest.current = null;
    }
    setIsStreaming(false);
    lastRequestTime.current = 0;
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
