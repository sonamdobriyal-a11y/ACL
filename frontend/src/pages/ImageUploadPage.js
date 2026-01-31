import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import ResultsDisplay from '../components/ResultsDisplay';
import './ImageUploadPage.css';

const ImageUploadPage = () => {
  const [detectionResults, setDetectionResults] = useState(null);

  const handleDetectionResult = (results) => {
    setDetectionResults(results);
  };

  return (
    <div className="image-upload-page">
      <div className="page-header">
        <div className="container">
          <h1>Upload Image for Analysis</h1>
          <p>Analyze knee posture from static images</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <div className="upload-grid">
            <div className="upload-section">
              <ImageUpload onDetectionResult={handleDetectionResult} />
            </div>

            {detectionResults && (
              <ResultsDisplay results={detectionResults} mode="upload" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadPage;
