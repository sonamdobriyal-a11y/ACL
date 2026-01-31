import React from 'react';
import './ResultsDisplay.css';

const ResultsDisplay = ({ results, mode }) => {
  if (!results) return null;

  const getRiskLevel = (probability) => {
    if (probability >= 50) return { level: 'High', color: '#f44336' };
    if (probability >= 30) return { level: 'Medium', color: '#ff9800' };
    return { level: 'Low', color: '#4CAF50' };
  };

  const leftRisk = getRiskLevel(results.left_acl_probability);
  const rightRisk = getRiskLevel(results.right_acl_probability);
  const avgRisk = getRiskLevel(results.average_acl_probability);

  return (
    <div className={`results-display ${mode === 'camera' ? 'camera-mode' : 'upload-mode'}`}>
      <h2>
        {mode === 'camera' ? 'Live Detection Results' : 'Detection Results'}
      </h2>
      
      {results.landmarks_detected ? (
        <>
          {/* Only show annotated image in upload mode, not in camera mode */}
          {mode === 'upload' && (
            <div className="annotated-image-container">
              <img
                src={results.annotated_image}
                alt="Annotated pose detection"
                className="annotated-image"
              />
            </div>
          )}

          {mode === 'camera' && (
            <div className="live-indicator">
              <span className="live-dot"></span>
              <span>Live Analysis</span>
            </div>
          )}

          <div className="results-grid">
            <div className="result-card">
              <h3>Left Knee</h3>
              <div className="angle-display">
                {results.left_knee_angle !== null ? (
                  <>
                    <span className="angle-value">{results.left_knee_angle.toFixed(1)}°</span>
                    <span className="angle-label">Knee Angle</span>
                  </>
                ) : (
                  <span className="no-data">No data</span>
                )}
              </div>
              <div className="probability-display">
                <div className="probability-label">ACL Tear Probability</div>
                <div
                  className="probability-bar"
                  style={{
                    width: `${results.left_acl_probability}%`,
                    backgroundColor: leftRisk.color,
                  }}
                >
                  <span className="probability-value">
                    {results.left_acl_probability.toFixed(1)}%
                  </span>
                </div>
                <div
                  className="risk-level"
                  style={{ color: leftRisk.color }}
                >
                  {leftRisk.level} Risk
                </div>
              </div>
            </div>

            <div className="result-card">
              <h3>Right Knee</h3>
              <div className="angle-display">
                {results.right_knee_angle !== null ? (
                  <>
                    <span className="angle-value">{results.right_knee_angle.toFixed(1)}°</span>
                    <span className="angle-label">Knee Angle</span>
                  </>
                ) : (
                  <span className="no-data">No data</span>
                )}
              </div>
              <div className="probability-display">
                <div className="probability-label">ACL Tear Probability</div>
                <div
                  className="probability-bar"
                  style={{
                    width: `${results.right_acl_probability}%`,
                    backgroundColor: rightRisk.color,
                  }}
                >
                  <span className="probability-value">
                    {results.right_acl_probability.toFixed(1)}%
                  </span>
                </div>
                <div
                  className="risk-level"
                  style={{ color: rightRisk.color }}
                >
                  {rightRisk.level} Risk
                </div>
              </div>
            </div>

            <div className="result-card average">
              <h3>Average</h3>
              <div className="angle-display">
                {results.average_knee_angle !== null ? (
                  <>
                    <span className="angle-value">{results.average_knee_angle.toFixed(1)}°</span>
                    <span className="angle-label">Average Knee Angle</span>
                  </>
                ) : (
                  <span className="no-data">No data</span>
                )}
              </div>
              <div className="probability-display">
                <div className="probability-label">Average ACL Tear Probability</div>
                <div
                  className="probability-bar"
                  style={{
                    width: `${results.average_acl_probability}%`,
                    backgroundColor: avgRisk.color,
                  }}
                >
                  <span className="probability-value">
                    {results.average_acl_probability.toFixed(1)}%
                  </span>
                </div>
                <div
                  className="risk-level"
                  style={{ color: avgRisk.color }}
                >
                  {avgRisk.level} Risk
                </div>
              </div>
            </div>
          </div>

          <div className="info-box">
            <h4>Interpretation Guide</h4>
            <ul>
              <li><span className="risk-indicator low"></span> Low Risk (0-30%): Normal knee angles</li>
              <li><span className="risk-indicator medium"></span> Medium Risk (30-50%): Slight abnormalities detected</li>
              <li><span className="risk-indicator high"></span> High Risk (50%+): Significant angle abnormalities</li>
            </ul>
            <p className="disclaimer">
              <strong>Note:</strong> This is a demonstration tool. For medical diagnosis, please consult a healthcare professional.
            </p>
          </div>
        </>
      ) : (
        <div className="no-landmarks">
          <p>No pose landmarks detected. Please ensure:</p>
          <ul>
            <li>The person is fully visible in the frame</li>
            <li>There is adequate lighting</li>
            <li>The person is facing the camera</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
