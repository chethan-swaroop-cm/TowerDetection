import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { AnalysisContext } from '../context/AnalysisContext';

const DetectionViewer = ({ src, detections }) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [dimensions, setDimensions] = useState(null);

  const updateDimensions = () => {
    if (!containerRef.current || !imgRef.current) return;
    const container = containerRef.current;
    const img = imgRef.current;

    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;

    if (!nw || !nh) return;

    const imageRatio = nw / nh;
    const containerRatio = cw / ch;

    let renderedWidth, renderedHeight;
    if (imageRatio > containerRatio) {
      renderedWidth = cw;
      renderedHeight = cw / imageRatio;
    } else {
      renderedHeight = ch;
      renderedWidth = ch * imageRatio;
    }

    const offsetX = (cw - renderedWidth) / 2;
    const offsetY = (ch - renderedHeight) / 2;

    setDimensions({ nw, nh, renderedWidth, renderedHeight, offsetX, offsetY });
  };

  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="result-image-wrapper" ref={containerRef} style={{ position: 'relative' }}>
      <img src={src} alt="Processed Image" ref={imgRef} onLoad={updateDimensions} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      {dimensions && detections && detections.map((det, idx) => {
        const [x1, y1, x2, y2] = det.bbox;
        const boxLeft = dimensions.offsetX + (x1 / dimensions.nw) * dimensions.renderedWidth;
        const boxTop = dimensions.offsetY + (y1 / dimensions.nh) * dimensions.renderedHeight;
        const boxWidth = ((x2 - x1) / dimensions.nw) * dimensions.renderedWidth;
        const boxHeight = ((y2 - y1) / dimensions.nh) * dimensions.renderedHeight;

        const color = det.class === 'monopole_tower' ? '#0ea5e9' : '#10b981';

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: boxLeft,
              top: boxTop,
              width: boxWidth,
              height: boxHeight,
              border: `2px solid ${color}`,
              boxSizing: 'border-box'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-20px',
              left: '-2px',
              backgroundColor: color,
              color: '#fff',
              fontSize: '10px',
              padding: '2px 4px',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-mono)'
            }}>
              {det.class} {(det.confidence * 100).toFixed(1)}%
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ObjectDetectionPage = () => {
  const navigate = useNavigate();
  const { selectedImage, previewUrl, analysisResponse } = useContext(AnalysisContext);

  useEffect(() => {
    if (analysisResponse) {
      const t = setTimeout(() => {
        navigate('/complete');
      }, 2500); // 2.5 second readable moment
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
            <DetectionViewer src={previewUrl} detections={detections} />
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
    </div>
  );

  return <WorkspaceLayout leftPanel={leftPanel} rightPanel={rightPanel} />;
};

export default ObjectDetectionPage;
