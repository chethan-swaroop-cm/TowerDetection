import React, { useContext, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { AnalysisContext } from '../context/AnalysisContext';

const CompletePage = () => {
  const navigate = useNavigate();
  const { selectedImage, previewUrl, analysisResponse } = useContext(AnalysisContext);

  useEffect(() => {
    if (analysisResponse) {
      const t = setTimeout(() => {
        navigate('/output');
      }, 2000); // 2 second readable moment
      return () => clearTimeout(t);
    }
  }, [analysisResponse, navigate]);

  if (!selectedImage || !analysisResponse) return <Navigate to="/upload" replace />;

  const quality = analysisResponse.image_quality || {};
  const detections = analysisResponse.detections || [];
  const summary = analysisResponse.summary || {};

  let monopoleCount = 0;
  let supportingCount = 0;
  detections.forEach(d => {
    if (d.class === 'monopole_tower') monopoleCount++;
    if (d.class === 'supporting_tower') supportingCount++;
  });

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
              <div className="status-badge accepted">ACCEPTED</div>
          </div>
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
      </div>
    </>
  );

  const rightPanel = (
    <div className="results-container">
        <div className="success-notification" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>✓ ANALYSIS COMPLETE - Tower inspection completed successfully.</span>
        </div>

        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-title">TOTAL OBJECTS</div>
                <div className="stat-value">{summary.total_objects ?? '--'}</div>
            </div>
            <div className="stat-card">
                <div className="stat-title">MONOPOLE TOWER</div>
                <div className="stat-value">{monopoleCount}</div>
            </div>
            <div className="stat-card">
                <div className="stat-title">SUPPORTING TOWER</div>
                <div className="stat-value">{supportingCount}</div>
            </div>
        </div>

        <div className="panel main-detection-view">
            <div className="panel-header">
                <h2>AI DETECTION RESULT</h2>
                <div className="status-indicator complete">
                    <span className="dot"></span> DETECTION COMPLETE
                </div>
            </div>
            <div className="result-image-wrapper">
                <img src={previewUrl} alt="Processed Image" />
            </div>
        </div>
    </div>
  );

  return <WorkspaceLayout leftPanel={leftPanel} rightPanel={rightPanel} />;
};

export default CompletePage;
