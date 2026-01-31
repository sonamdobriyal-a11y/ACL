import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CameraDetection from './pages/CameraDetection';
import ImageUploadPage from './pages/ImageUploadPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/camera-detection" element={<CameraDetection />} />
          <Route path="/upload-image" element={<ImageUploadPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
