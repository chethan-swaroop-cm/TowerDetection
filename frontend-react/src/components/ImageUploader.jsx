import React, { useRef, useState, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

const ImageUploader = ({ selectedFile, previewUrl, imageDimensions, validationError, onFileSelect, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
  }, []);
  const handleDragOver = useCallback((e) => {
    e.preventDefault(); e.stopPropagation(); if (!isDragging) setIsDragging(true);
  }, [isDragging]);
  const handleDrop = useCallback((e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (selectedFile && previewUrl) {
    return (
      <div className="preview-container">
        {validationError && (
          <div className="validation-error" style={{color: 'var(--error)'}}>
            <AlertCircle size={20} />
            <span>{validationError}</span>
          </div>
        )}
        <div style={{ position: 'relative', background: '#000', borderRadius: 'var(--radius)', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
          <img src={previewUrl} alt="Inspection preview" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
        </div>
        <div className="file-info">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <ImageIcon className="text-tertiary" />
            <div>
              <div style={{ fontWeight: 500 }}>{selectedFile.name}</div>
              <div className="caption">
                {formatFileSize(selectedFile.size)} • {imageDimensions ? `${imageDimensions.width} × ${imageDimensions.height}` : 'Calculating...'}
              </div>
            </div>
          </div>
          <button className="btn-secondary" onClick={onClear} style={{ padding: '0.4rem 0.8rem' }}>
            <X size={16} /> Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
      style={{ borderColor: validationError ? 'var(--error)' : '' }}
      onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
      onClick={handleBrowseClick} role="button" tabIndex={0}
    >
      <input
        type="file" ref={fileInputRef} onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        style={{ display: 'none' }} aria-hidden="true"
      />
      <UploadCloud size={48} style={{ color: isDragging ? 'var(--primary)' : 'var(--lightText)', marginBottom: '1rem' }} />
      <h3 className="card-heading" style={{ color: isDragging ? 'var(--primary)' : 'inherit' }}>Drop tower image here</h3>
      <p className="body-text">or <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }}>Browse Files</span></p>
      <div className="caption" style={{ marginTop: '1rem' }}>Supported: JPG, JPEG, PNG, WEBP</div>
      
      {validationError && (
        <div style={{ marginTop: '1rem', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} /> <span>{validationError}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
