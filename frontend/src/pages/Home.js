import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import kneeAnatomy from '../assets/knee-anatomy.svg';
import poseDetection from '../assets/pose-detection.svg';
import aiAnalysis from '../assets/ai-analysis.svg';
import heroIllustration from '../assets/hero-illustration.svg';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">ACL Tear Detection System</h1>
            <p className="hero-subtitle">
              Advanced AI-powered detection using MediaPipe Pose Estimation
            </p>
            <div className="hero-buttons">
              <Link to="/camera-detection" className="btn btn-primary">
                Start Live Detection
              </Link>
              <Link to="/upload-image" className="btn btn-secondary">
                Upload Image
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src={heroIllustration} alt="ACL Detection Illustration" />
          </div>
        </div>
      </section>

      {/* About ACL Section */}
      <section className="about-section">
        <div className="container">
          <h2 className="section-title">Understanding ACL Tears</h2>
          <div className="about-grid">
            <div className="about-card">
              <div className="card-image">
                <img src={kneeAnatomy} alt="Knee Anatomy" />
              </div>
              <h3>What is an ACL Tear?</h3>
              <p>
                The Anterior Cruciate Ligament (ACL) is one of the key ligaments that helps stabilize the knee joint. 
                An ACL tear is a common sports injury that occurs when the ligament is stretched beyond its normal range, 
                often during sudden stops, jumps, or changes in direction.
              </p>
            </div>

            <div className="about-card">
              <div className="card-icon warning-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3>Common Causes</h3>
              <ul className="causes-list">
                <li>Sudden stops or changes in direction</li>
                <li>Landing awkwardly from a jump</li>
                <li>Direct collision or impact to the knee</li>
                <li>Hyperextension of the knee joint</li>
                <li>Pivoting with foot planted firmly</li>
              </ul>
            </div>

            <div className="about-card">
              <div className="card-icon success-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Risk Indicators</h3>
              <p>
                Our system analyzes knee angles to identify potential ACL injury risk factors, including:
                hyperextension, extreme flexion, limited range of motion, and asymmetric movement patterns 
                between left and right knees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Solve Section */}
      <section className="solution-section">
        <div className="container">
          <h2 className="section-title">Our Solution</h2>
          <div className="solution-content">
            <div className="solution-text">
              <h3>AI-Powered Detection Technology</h3>
              <p>
                Our system leverages MediaPipe Pose Estimation, a state-of-the-art machine learning framework 
                developed by Google, to analyze body posture and knee angles in real-time.
              </p>
              
              <div className="features">
                <div className="feature-item">
                  <div className="feature-icon">+</div>
                  <div>
                    <h4>Real-Time Analysis</h4>
                    <p>Instant detection using your camera with live pose tracking</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">+</div>
                  <div>
                    <h4>Image Upload Support</h4>
                    <p>Analyze static images for comprehensive assessment</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">+</div>
                  <div>
                    <h4>Advanced Angle Detection</h4>
                    <p>Precise knee angle measurements and asymmetry detection</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">+</div>
                  <div>
                    <h4>Risk Assessment</h4>
                    <p>Color-coded risk levels with detailed probability scores</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="solution-image">
              <div className="solution-visuals">
                <img src={poseDetection} alt="Pose Detection" className="solution-img" />
                <img src={aiAnalysis} alt="AI Analysis" className="solution-img" />
              </div>
              <div className="tech-stack">
                <div className="tech-item">
                  <h4>Technology Stack</h4>
                  <ul>
                    <li><strong>Frontend:</strong> React.js</li>
                    <li><strong>Backend:</strong> Python FastAPI</li>
                    <li><strong>AI Model:</strong> MediaPipe Pose</li>
                    <li><strong>Processing:</strong> OpenCV & NumPy</li>
                  </ul>
                </div>
                <div className="tech-item">
                  <h4>Detection Method</h4>
                  <ul>
                    <li>33-point body landmark detection</li>
                    <li>Geometric angle calculation</li>
                    <li>Bilateral symmetry analysis</li>
                    <li>Real-time probability scoring</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Choose your preferred method to analyze knee posture and detect potential ACL injury risks</p>
          <div className="cta-buttons">
            <Link to="/camera-detection" className="btn btn-large btn-primary">
              Start Live Detection
            </Link>
            <Link to="/upload-image" className="btn btn-large btn-secondary">
              Upload an Image
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="disclaimer-section">
        <div className="container">
          <div className="disclaimer-box">
            <h4>Medical Disclaimer</h4>
            <p>
              This is a demonstration tool for educational and research purposes. It is not a substitute 
              for professional medical advice, diagnosis, or treatment. Always consult with a qualified 
              healthcare provider for accurate medical diagnosis and treatment recommendations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
