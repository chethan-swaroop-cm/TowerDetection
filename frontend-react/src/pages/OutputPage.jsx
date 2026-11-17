import React, { useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { AnalysisContext } from '../context/AnalysisContext';

const OutputPage = () => {
  const navigate = useNavigate();
  const { selectedImage, previewUrl, analysisResponse, resetAnalysis } = useContext(AnalysisContext);

  if (!selectedImage || !analysisResponse) return <Navigate to="/upload" replace />;

  const quality = analysisResponse.image_quality || {};
  const detections = analysisResponse.detections || [];
  const summary = analysisResponse.summary || {};
  const averageConfidence = summary.average_confidence || {};
  
  // Use the annotated image from the backend if available, otherwise fallback to preview
  const outputImageSrc = analysisResponse.processed_image_url || previewUrl;

  let monopoleCount = 0;
  let supportingCount = 0;
  detections.forEach(d => {
    if (d.class === 'monopole_tower') monopoleCount++;
    if (d.class === 'supporting_tower') supportingCount++;
  });

  const handleAnotherImage = () => {
      resetAnalysis();
      navigate('/upload');
  };

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
                    <span className="dot"></span> OUTPUT GENERATED
                </div>
            </div>
            <div className="result-image-wrapper">
                <img src={outputImageSrc} alt="Processed Image" />
            </div>
        </div>

        <div className="panel confidence-panel">
            <h2>CLASS AVERAGE CONFIDENCE</h2>
            <div className="confidence-bars">
                {Object.keys(averageConfidence).length === 0 ? (
                    <div className="confidence-item" style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>No detections to average.</div>
                ) : (
                    Object.entries(averageConfidence).map(([className, classData]) => {
                        if (!classData || classData.count === 0) return null;
                        const confValue = classData.average_confidence || 0;
                        const percent = (confValue * 100).toFixed(1);
                        return (
                            <div className="confidence-item" key={className}>
                                <div className="conf-header">
                                    <span>{className}</span>
                                    <span>{percent}%</span>
                                </div>
                                <div className="conf-bar-bg">
                                    <div className="conf-bar-fill" style={{ width: `${percent}%` }}></div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>

        <div className="panel detection-table-panel">
            <h2>DETECTED COMPONENTS</h2>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>CLASS</th>
                            <th>CONFIDENCE</th>
                            <th>BOUNDING BOX</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detections.length === 0 ? (
                            <tr><td colSpan="3" style={{textAlign: 'center'}}>No detections found.</td></tr>
                        ) : (
                            detections.map((det, i) => (
                                <tr key={i}>
                                    <td>{det.class}</td>
                                    <td>{(det.confidence * 100).toFixed(1)}%</td>
                                    <td>[{det.bbox.map(n => Math.round(n)).join(', ')}]</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        <button className="btn-outline" onClick={handleAnotherImage} style={{ width: '100%', marginTop: '1rem', borderColor: 'rgba(16, 185, 129, 0.5)', color: 'var(--success)' }}>
            ANALYZE ANOTHER IMAGE
        </button>
    </div>
  );

  return <WorkspaceLayout leftPanel={leftPanel} rightPanel={rightPanel} />;
};

export default OutputPage;
