import React, { useContext, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { AnalysisContext } from '../context/AnalysisContext';

const UploadProgressPage = () => {
  const navigate = useNavigate();
  const { selectedImage, previewUrl, uploadProgress, error } = useContext(AnalysisContext);

  useEffect(() => {
    if (uploadProgress >= 100 && !error) {
      const t = setTimeout(() => {
        navigate('/execute');
      }, 800);
      return () => clearTimeout(t);
    }
  }, [uploadProgress, error, navigate]);

  if (!selectedImage) return <Navigate to="/upload" replace />;

  const isComplete = uploadProgress >= 100;

  const leftPanel = (
    <div className="panel upload-panel">
        <h2>UPLOAD PROGRESS</h2>
        
        <div className="file-info" style={{marginBottom: '1rem'}}>
            <div className="file-details">
                <span className="file-icon">📄</span>
                <div className="file-meta">
                    <div className="filename">{selectedImage.name}</div>
                    <div className="filesize">{(selectedImage.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
            </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius)', border: `1px solid ${error ? 'var(--danger)' : 'var(--border-color)'}`, marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem', color: error ? 'var(--danger)' : (isComplete ? 'var(--success)' : 'var(--text-secondary)'), fontFamily: 'var(--font-mono)' }}>
                <span>{error ? 'UPLOAD FAILED' : (isComplete ? 'UPLOAD COMPLETE ✓' : 'UPLOADING IMAGE...')}</span>
                <span>{uploadProgress}%</span>
            </div>
            <div className="conf-bar-bg" style={{ height: '6px' }}>
                <div className="conf-bar-fill" style={{ width: `${uploadProgress}%`, backgroundColor: error ? 'var(--danger)' : (isComplete ? 'var(--success)' : 'var(--accent-primary)'), transition: 'width 0.2s linear' }}></div>
            </div>
        </div>
        
        {error && (
            <div className="quality-reason" style={{marginBottom: '1rem'}}>
                <strong>Error:</strong> {error}
                <button className="btn-outline" onClick={() => navigate('/upload')} style={{marginTop: '1rem', width: '100%'}}>TRY AGAIN</button>
            </div>
        )}
        
        <div className="preview-container">
            <img src={previewUrl} alt="Preview" style={{ opacity: isComplete ? 1 : 0.5 }} />
        </div>
    </div>
  );

  const rightPanel = (
    <div className="panel empty-state">
      <div className="empty-icon">⚲</div>
      <h2>READY FOR INSPECTION</h2>
      <p>Upload a tower image to begin AI analysis.</p>
    </div>
  );

  return <WorkspaceLayout leftPanel={leftPanel} rightPanel={rightPanel} />;
};

export default UploadProgressPage;
