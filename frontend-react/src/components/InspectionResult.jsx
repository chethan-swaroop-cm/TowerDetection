import React from 'react';
import { RefreshCw, CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

const InspectionResult = ({ result, onReset }) => {
  if (!result) return null;

  // Handle Backend Error/Exception (not HTTP 400 rejection)
  if (result.error) {
    return (
      <div className="result-container error-state">
        <div className="result-header">
          <AlertTriangle size={32} className="text-status-error" />
          <h2>BACKEND UNAVAILABLE</h2>
        </div>
        <p className="result-message">{result.error}</p>
        <button className="btn-primary mt-4" onClick={onReset}>
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    );
  }

  // Handle Quality Rejection (HTTP 400 from Flask)
  if (result.status === 'rejected') {
    const reasons = result.image_quality?.reasons || ['Unknown quality issue.'];
    return (
      <div className="result-container rejected-state">
        <div className="result-header">
          <XCircle size={32} className="text-status-error" />
          <h2>IMAGE QUALITY REJECTED</h2>
        </div>
        <div className="quality-reasons">
          <p><strong>Reason:</strong></p>
          <ul>
            {reasons.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
          <p className="mt-2 text-secondary">Object detection was not executed.</p>
        </div>
        <button className="btn-primary mt-4" onClick={onReset}>
          <RefreshCw size={16} /> Try Another Image
        </button>
      </div>
    );
  }

  // Handle Success (passed quality check)
  const detections = result.detections ?? [];
  const summary = result.summary ?? {};
  const imageQuality = result.image_quality ?? {};
  const processedUrl = result.processed_image_url;

  return (
    <div className="result-container success-state">
      <div className="result-layout">
        
        {/* Left Side: Annotated Image */}
        <div className="result-image-section">
          {processedUrl ? (
            <img src={processedUrl} alt="Annotated detection" className="annotated-image" />
          ) : (
            <div className="image-placeholder">
              <Info size={24} />
              <span>Detection completed, but the processed image is unavailable.</span>
            </div>
          )}
        </div>

        {/* Right Side: Analysis Data */}
        <div className="result-data-section">
          <div className="data-header">
            <h3>INSPECTION COMPLETE</h3>
            <button className="btn-secondary small" onClick={onReset}>
              <RefreshCw size={14} /> Analyze Another
            </button>
          </div>

          {/* Quality Info */}
          <div className="data-card">
            <h4>IMAGE QUALITY</h4>
            <ul className="quality-list">
              <li><CheckCircle2 size={16} className="text-status-success"/> Blur check</li>
              <li><CheckCircle2 size={16} className="text-status-success"/> Exposure check</li>
              <li><CheckCircle2 size={16} className="text-status-success"/> Image accepted</li>
            </ul>
          </div>

          {/* Detection Info */}
          <div className="data-card">
            <h4>DETECTION RESULTS</h4>
            {detections.length === 0 ? (
              <div className="no-detections">
                <strong>NO OBJECTS DETECTED</strong>
                <p>The image passed quality checks, but the detector did not identify any supported tower object.</p>
              </div>
            ) : (
              <>
                <div className="detection-count">
                  <strong>{summary.total_objects} OBJECT{summary.total_objects > 1 ? 'S' : ''} DETECTED</strong>
                </div>
                
                {/* Average Confidence by Class */}
                {summary.average_confidence && Object.entries(summary.average_confidence).map(([cls, data]) => (
                  <div key={cls} className="class-summary">
                    <div className="class-name">{cls.replace('_', ' ').toUpperCase()}</div>
                    <div className="class-stats">
                      <span>Objects: {data.count}</span>
                      <span>Average confidence: {(data.average_confidence * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                ))}

                {/* Individual Detections (optional detail list) */}
                <div className="individual-detections mt-3">
                  <h5>Individual Detections:</h5>
                  <ul className="detection-list">
                    {detections.map((det, idx) => (
                      <li key={idx}>
                        <span className="det-class">{det.class}</span>
                        <span className="det-conf">{(det.confidence * 100).toFixed(2)}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionResult;
