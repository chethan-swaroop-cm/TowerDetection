import React, { useState } from 'react';
import { Maximize2, ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff } from 'lucide-react';

const DetectionViewer = ({ imageUrl, detections = [], isProcessing = false }) => {
  const [showBoxes, setShowBoxes] = useState(true);

  return (
    <div className="viewer-container">
      <img 
        src={imageUrl} 
        alt="Detection view" 
        style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: isProcessing ? 0.5 : 1 }}
      />
      
      {showBoxes && !isProcessing && detections.map((det, idx) => {
        // mock rendering relative boxes based on 0-1 percentage coordinates if backend provides absolute
        // for now we just render a mock box for layout demonstration
        return (
          <div 
            key={idx}
            style={{
              position: 'absolute',
              border: '2px solid var(--primary)',
              backgroundColor: 'rgba(11, 87, 208, 0.1)',
              left: '20%', top: '20%', width: '60%', height: '60%', // placeholder coords
              pointerEvents: 'none'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-24px', left: '-2px',
              background: 'var(--primary)',
              color: '#fff',
              fontSize: '0.75rem',
              padding: '2px 6px',
              fontWeight: 500,
              borderRadius: '4px 4px 0 0',
              whiteSpace: 'nowrap'
            }}>
              {det.className} {Math.round(det.confidence * 100)}%
            </div>
          </div>
        );
      })}

      <div className="viewer-controls">
        <button title="Zoom Out"><ZoomOut size={18} /></button>
        <button title="Reset"><RotateCcw size={18} /></button>
        <button title="Zoom In"><ZoomIn size={18} /></button>
        <div style={{ width: '1px', background: 'var(--border)', margin: '0 4px' }} />
        <button onClick={() => setShowBoxes(!showBoxes)} title={showBoxes ? "Hide Boxes" : "Show Boxes"}>
          {showBoxes ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        <button title="Fullscreen"><Maximize2 size={18} /></button>
      </div>
    </div>
  );
};

export default DetectionViewer;
