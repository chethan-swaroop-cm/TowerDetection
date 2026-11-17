import React from 'react';
import { useLocation } from 'react-router-dom';

const steps = [
  { path: '/upload', id: 'track-upload', label: '1. IMAGE UPLOAD' },
  { path: '/upload-progress', id: 'track-progress', label: '2. UPLOAD PROGRESS' },
  { path: '/execute', id: 'track-execute', label: '3. EXECUTE' },
  { path: '/quality-check', id: 'track-quality', label: '4. QUALITY CHECK' },
  { path: '/object-detection', id: 'track-detection', label: '5. OBJECT DETECTION' },
  { path: '/complete', id: 'track-completion', label: '6. COMPLETION' },
  { path: '/output', id: 'track-output', label: '7. OUTPUT' }
];

export const WorkspaceLayout = ({ leftPanel, rightPanel, hidePipeline = false }) => {
  const location = useLocation();
  const currentIndex = steps.findIndex(s => s.path === location.pathname);

  return (
    <>
      <header className="hero-header">
          <div className="hero-titles">
              <h1>AI Tower Inspection</h1>
              <p>Automated detection and localization of tower components using computer vision.</p>
          </div>
          <div className="hero-status">
              <div className="status-indicator ready" id="global-status-ind">
                  <span className="dot"></span> 
                  <span id="global-status-text">
                      {location.pathname === '/output' ? 'INSPECTION COMPLETE' : 'READY FOR INSPECTION'}
                  </span>
              </div>
          </div>
      </header>

      <div className="workspace-grid">
          <div className="left-col">
              {!hidePipeline && (
                <div className="pipeline-container workflow-tracker">
                    {steps.map((step, index) => {
                      const isActive = index === currentIndex;
                      const isComplete = index < currentIndex;
                      const className = `pipeline-step ${isActive ? 'active' : ''} ${isComplete ? 'success' : ''}`;
                      return (
                        <React.Fragment key={step.path}>
                          <div className={className} id={step.id}>
                            {step.label} <span className="step-icon">{isComplete ? '✓' : '○'}</span>
                          </div>
                          {index < steps.length - 1 && <div className="pipeline-separator">→</div>}
                        </React.Fragment>
                      );
                    })}
                </div>
              )}
              {leftPanel}
          </div>
          <div className="right-col">
              {rightPanel}
          </div>
      </div>
    </>
  );
};
