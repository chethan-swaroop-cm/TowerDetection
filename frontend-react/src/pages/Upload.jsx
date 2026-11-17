import React, { useRef, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { AnalysisContext } from '../context/AnalysisContext';

const Upload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { startAnalysis, analysisStarted, selectedImage, previewUrl } = useContext(AnalysisContext);
  
  const [selectedFile, setSelectedFile] = useState(selectedImage || null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState(previewUrl || null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
        setError('Unsupported file type');
        return;
      }
      setSelectedFile(file);
      setLocalPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setLocalPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const [isStarting, setIsStarting] = useState(false);

  const handleStartAnalysis = () => {
    // If we're resuming a previous analysis without picking a new image, just go forward
    if (analysisStarted && selectedFile === selectedImage) {
      navigate('/upload-progress');
      return;
    }
    
    if (isStarting) return;
    setIsStarting(true);
    startAnalysis(selectedFile, localPreviewUrl);
    navigate('/upload-progress');
  };

  const leftPanel = (
    <div className="panel upload-panel">
        <h2>UPLOAD INSPECTION IMAGE</h2>
        
        {!selectedFile ? (
            <div className="drop-zone" onClick={() => fileInputRef.current?.click()} style={{cursor: 'pointer', borderColor: error ? 'var(--danger)' : ''}}>
                <div className="upload-icon">📁</div>
                <div className="drop-text">Drag & Drop your tower image here</div>
                <div className="drop-or">or</div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".jpg, .jpeg, .png, .webp" hidden />
                <button className="btn-outline">SELECT IMAGE</button>
                <div className="supported-text">Supported: JPG • JPEG • PNG • WEBP</div>
                {error && <div style={{color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.5rem'}}>{error}</div>}
            </div>
        ) : (
            <>
                <div className="file-info">
                    <div className="file-details">
                        <span className="file-icon">📄</span>
                        <div className="file-meta">
                            <div className="filename">{selectedFile.name}</div>
                            <div className="filesize">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                    </div>
                    <button className="btn-text" onClick={handleRemove}>✕ REMOVE</button>
                </div>
                <div className="preview-container">
                    <img src={localPreviewUrl} alt="Preview" />
                </div>
                <button 
                  className="btn-primary" 
                  style={{marginTop: '1.5rem'}}
                  onClick={handleStartAnalysis}
                >
                  {analysisStarted && selectedFile === selectedImage ? 'RESUME ANALYSIS' : 'START ANALYSIS'}
                </button>
            </>
        )}
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

export default Upload;
