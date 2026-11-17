import React, { useContext, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { AnalysisContext } from '../context/AnalysisContext';

const QualityCheckPage = () => {
  const navigate = useNavigate();
  const { selectedImage, previewUrl, analysisResponse, resetAnalysis } = useContext(AnalysisContext);

  const quality = analysisResponse?.image_quality || {};
  const isAccepted = quality.status === 'good';
  const isRejected = quality.status === 'rejected' || analysisResponse?.status === 'rejected';

  useEffect(() => {
    if (analysisResponse && isAccepted) {
      const t = setTimeout(() => {
        navigate('/object-detection');
      }, 2000); // 2 second readable moment
      return () => clearTimeout(t);
    }
  }, [analysisResponse, isAccepted, navigate]);

  if (!selectedImage || !analysisResponse) return <Navigate to="/upload" replace />;

  let badgeClass = '';
  let badgeText = 'UNKNOWN';
  if (isAccepted) {
      badgeClass = 'accepted';
      badgeText = 'ACCEPTED';
  } else if (isRejected) {
      badgeClass = 'rejected';
      badgeText = 'REJECTED';
  }

  const leftPanel = (
    <>
      <div className="panel upload-panel">
          <div className="preview-container">
              <img src={previewUrl} alt="Preview" />
          </div>
      </div>

      <div className="panel quality-card">
          <h2>IMAGE QUALITY ANALYSIS</h2>
          <div className="quality-header">
              <div className={`status-badge ${badgeClass}`}>
                  {badgeText}
              </div>
          </div>
          
          {isRejected && quality.reasons && quality.reasons.length > 0 && (
              <div className="quality-reason">
                  <strong>Reason:</strong> <span>{quality.reasons.join(', ')}</span>
              </div>
          )}

          <div className="quality-metrics">
              <div className="metric">
                  <span className="metric-label">Blur Score</span>
                  <span className="metric-value">{quality.blur_score != null ? quality.blur_score.toFixed(1) : '--'}</span>
              </div>
              <div className="metric">
                  <span className="metric-label">Exposure</span>
                  <span className="metric-value">{quality.overexposed_percentage != null ? `${quality.overexposed_percentage.toFixed(1)}%` : '--'}</span>
              </div>
              <div className="metric">
                  <span className="metric-label">Underexposure</span>
                  <span className="metric-value">{quality.underexposed_percentage != null ? `${quality.underexposed_percentage.toFixed(1)}%` : '--'}</span>
              </div>
          </div>
          
          {isRejected && (
              <button 
                  className="btn-primary" 
                  style={{marginTop: '1.5rem'}}
                  onClick={() => { resetAnalysis(); navigate('/upload'); }}
              >
                  UPLOAD DIFFERENT IMAGE
              </button>
          )}
      </div>
    </>
  );

  const rightPanel = isRejected ? (
    <div className="panel error-state">
      <div className="error-icon">⚠</div>
      <h2>QUALITY CHECK FAILED</h2>
      <p>The uploaded image does not meet the required quality standards for AI inspection.</p>
    </div>
  ) : (
    <div className="panel empty-state">
      <div className="empty-icon">⚲</div>
      <h2>READY FOR DETECTION</h2>
      <p>Image quality verified. Proceeding to object detection...</p>
    </div>
  );

  return <WorkspaceLayout leftPanel={leftPanel} rightPanel={rightPanel} />;
};

export default QualityCheckPage;
