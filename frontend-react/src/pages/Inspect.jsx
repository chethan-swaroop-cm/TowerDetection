import React, { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle2, ChevronRight, Zap, Target } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import InspectionResult from '../components/InspectionResult';
import { analyzeImage } from '../services/api';

const Inspect = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageDimensions, setImageDimensions] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inspectionResult, setInspectionResult] = useState(null);
  const [pipelineState, setPipelineState] = useState('UPLOAD'); // UPLOAD, QUALITY_CHECK, DETECTION, RESULT

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  const validateAndProcessFile = (file) => {
    handleClear();
    
    if (!file) return;

    // 1. Validate Extension/MIME
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
    
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(fileExtension)) {
      setValidationError("Unsupported file type");
      setSelectedFile(file);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setValidationError("Image is too large. Maximum size is 10 MB.");
      setSelectedFile(file);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
      setSelectedFile(file);
      setPreviewUrl(objectUrl);
      setPipelineState('UPLOAD');
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setValidationError("Unable to read this image. Please select another image.");
      setSelectedFile(file);
    };
    img.src = objectUrl;
  };

  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageDimensions(null);
    setValidationError(null);
    setIsAnalyzing(false);
    setInspectionResult(null);
    setPipelineState('UPLOAD');
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    setPipelineState('QUALITY_CHECK');
    
    try {
      const result = await analyzeImage(selectedFile);
      setInspectionResult(result);
      setPipelineState('RESULT');
    } catch (error) {
      setInspectionResult({ error: error.message });
      setPipelineState('RESULT');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusText = () => {
    if (inspectionResult) return 'INSPECTION COMPLETE';
    if (isAnalyzing) return 'PROCESSING...';
    if (selectedFile) return 'READY FOR ANALYSIS';
    return 'SYSTEM READY';
  };

  return (
    <div className="page-container">
      <div className="inspect-layout">
        <div className="workspace-header">
          <h1 className="workspace-title">IMAGE INSPECTION</h1>
          <div className="text-mono text-tertiary">
            {getStatusText()}
          </div>
        </div>

        <div className="inspection-workspace-container">
          {!inspectionResult ? (
            <ImageUploader 
              selectedFile={selectedFile}
              previewUrl={previewUrl}
              imageDimensions={imageDimensions}
              validationError={validationError}
              onFileSelect={validateAndProcessFile}
              onClear={handleClear}
              isAnalyzing={isAnalyzing}
              onAnalyze={handleAnalyze}
            />
          ) : (
            <InspectionResult 
              result={inspectionResult}
              onReset={handleClear}
            />
          )}
        </div>

        {/* Pipeline Indicator */}
        <div className="pipeline-indicator">
          <div className="pipeline-node" style={{color: selectedFile || pipelineState !== 'UPLOAD' ? 'var(--text-primary)' : 'var(--accent-blue)'}}>
            <UploadCloud size={18} /> UPLOADED
          </div>
          <ChevronRight size={16} className="text-tertiary" />
          <div className="pipeline-node" style={{color: pipelineState === 'QUALITY_CHECK' ? 'var(--accent-blue)' : (pipelineState === 'RESULT' ? 'var(--text-primary)' : 'var(--text-tertiary)')}}>
            <CheckCircle2 size={18} /> QUALITY CHECK
          </div>
          <ChevronRight size={16} className="text-tertiary" />
          <div className="pipeline-node" style={{color: pipelineState === 'DETECTION' ? 'var(--accent-blue)' : (pipelineState === 'RESULT' && inspectionResult?.status === 'success' ? 'var(--text-primary)' : 'var(--text-tertiary)')}}>
            <Zap size={18} /> AI DETECTION
          </div>
          <ChevronRight size={16} className="text-tertiary" />
          <div className="pipeline-node" style={{color: pipelineState === 'RESULT' ? 'var(--accent-blue)' : 'var(--text-tertiary)'}}>
            <Target size={18} /> RESULT
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inspect;
