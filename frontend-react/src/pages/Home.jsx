import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ImagePlus, ShieldCheck, Zap, Activity } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container" style={{ alignItems: 'center' }}>
      <section className="hero-section">
        <h1 className="hero-title">
          <span className="text-gradient">AI-POWERED</span><br />
          TOWER IMAGE INSPECTION
        </h1>
        <p className="hero-subtitle">
          Upload a tower image and let the system assess image quality and detect tower structures automatically.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate('/inspect')}>
            START INSPECTION <ArrowRight size={18} />
          </button>
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
            VIEW DASHBOARD
          </button>
        </div>
      </section>

      <div className="workflow-diagram">
        <div className="workflow-step">
          <div className="workflow-icon"><ImagePlus size={28} /></div>
          <span>UPLOAD</span>
        </div>
        <ArrowRight className="workflow-arrow" size={24} />
        <div className="workflow-step">
          <div className="workflow-icon"><ShieldCheck size={28} /></div>
          <span>QUALITY CHECK</span>
        </div>
        <ArrowRight className="workflow-arrow" size={24} />
        <div className="workflow-step">
          <div className="workflow-icon"><Zap size={28} /></div>
          <span>AI DETECTION</span>
        </div>
        <ArrowRight className="workflow-arrow" size={24} />
        <div className="workflow-step">
          <div className="workflow-icon"><Activity size={28} /></div>
          <span>INSPECTION RESULT</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Images Inspected</div>
          <div className="stat-value">1,248</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Successful Detections</div>
          <div className="stat-value">1,105</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rejected Images</div>
          <div className="stat-value">143</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Confidence</div>
          <div className="stat-value text-gradient">96.4%</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
