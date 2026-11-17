import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceLayout } from '../components/WorkspaceLayout';

const Dashboard = () => {
  const navigate = useNavigate();

  const leftPanel = (
    <div className="panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <h2>START NEW INSPECTION</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Begin an automated AI analysis of tower infrastructure.
      </p>
      <button className="btn-primary" onClick={() => navigate('/upload')}>
        BEGIN WORKFLOW
      </button>
    </div>
  );

  const rightPanel = (
    <div className="panel empty-state">
      <div className="empty-icon">⚲</div>
      <h2>READY FOR INSPECTION</h2>
      <p>Upload a tower image to begin AI analysis.</p>
    </div>
  );

  return <WorkspaceLayout leftPanel={leftPanel} rightPanel={rightPanel} hidePipeline={true} />;
};

export default Dashboard;
