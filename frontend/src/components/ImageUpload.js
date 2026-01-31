import React, { useState, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './ImageUpload.css';

const ImageUpload = ({ onDetectionResult }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post(`${API_URL}/detect`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onDetectionResult(response.data);
      } else {
        setError('Detection failed. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError('Backend server is not responding. Please check if it\'s running on port 8000.');
      } else if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        setError('Cannot connect to backend server. Please start it first:\ncd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000');
      } else {
        setError(err.response?.data?.detail || 'Error uploading image. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload">
      <div className="upload-area">
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
            <button onClick={handleReset} className="btn-reset">
              Change Image
            </button>
          </div>
        ) : (
          <div
            className="drop-zone"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('drag-over');
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('drag-over');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('drag-over');
              const file = e.dataTransfer.files[0];
              if (file && file.type.startsWith('image/')) {
                setSelectedFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                  setPreview(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
          >
            <div className="drop-zone-content">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p>Click or drag an image here</p>
              <p className="drop-zone-subtitle">Supports JPG, PNG, GIF</p>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="upload-controls">
        {selectedFile && (
          <>
            <button
              onClick={handleUpload}
              disabled={loading}
              className="btn btn-upload"
            >
              {loading ? 'Processing...' : 'Detect ACL'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
