import React, { useState } from 'react';
import VideoCapture from '../components/VideoCapture';
import ResultsDisplay from '../components/ResultsDisplay';
import './CameraDetection.css';

const CameraDetection = () => {
  const [detectionResults, setDetectionResults] = useState(null);

  const handleDetectionResult = (results) => {
    setDetectionResults(results);
  };

  return (
    <div className="camera-detection-page">
      <div className="page-header">
        <div className="container">
          <h1>Live ACL Detection</h1>
          <p>Real-time knee angle analysis using your camera</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <div className="detection-grid">
            <div className="detection-section">
              <VideoCapture onDetectionResult={handleDetectionResult} />
            </div>

            {detectionResults && (
              <ResultsDisplay results={detectionResults} mode="camera" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraDetection;
