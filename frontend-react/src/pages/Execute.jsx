import React, { useContext, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { AnalysisContext } from '../context/AnalysisContext';

const Execute = () => {
  const navigate = useNavigate();
  const { selectedImage, previewUrl, analysisCompleted, error, resetAnalysis } = useContext(AnalysisContext);

  useEffect(() => {
    if (analysisCompleted && !error) {
      const t = setTimeout(() => {
        navigate('/quality-check');
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [analysisCompleted, error, navigate]);

  if (!selectedImage) return <Navigate to="/upload" replace />;

  const leftPanel = (
    <div className="panel upload-panel">
        <h2>EXECUTE ANALYSIS</h2>
        
        <div className="file-info" style={{marginBottom: '1rem'}}>
            <div className="file-details">
                <span className="file-icon">📄</span>
                <div className="file-meta">
                    <div className="filename">{selectedImage.name}</div>
                    <div className="filesize">{(selectedImage.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
            </div>
        </div>

        <div className="preview-container">
            <img src={previewUrl} alt="Preview" style={{ opacity: error ? 1 : (analysisCompleted ? 1 : 0.7) }} />
        </div>
        
        {error ? (
            <div className="quality-reason" style={{marginTop: '1.5rem'}}>
                <strong>Error:</strong> {error}
                <button className="btn-outline" onClick={() => { resetAnalysis(); navigate('/upload'); }} style={{marginTop: '1rem', width: '100%'}}>
                    ANALYZE ANOTHER IMAGE
                </button>
            </div>
        ) : (
            <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--accent-primary)', fontWeight: '600', letterSpacing: '1px' }}>
                {analysisCompleted ? 'ANALYSIS COMPLETE' : 'ANALYZING IMAGE...'}
            </div>
        )}
    </div>
  );

  const rightPanel = error ? (
    <div className="panel error-state">
      <div className="error-icon">⚠</div>
      <h2>ANALYSIS FAILED</h2>
      <p>{error}</p>
    </div>
  ) : (
    <div className="panel empty-state">
      <div className="empty-icon">⚲</div>
      <h2>AI INSPECTION IN PROGRESS</h2>
      <p>Running object detection and quality assessment...</p>
    </div>
  );

  return <WorkspaceLayout leftPanel={leftPanel} rightPanel={rightPanel} />;
};

export default Execute;
