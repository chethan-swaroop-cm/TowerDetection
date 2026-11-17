import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
        <ul className="side-nav">
            <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`} onClick={() => navigate('/')}>OVERVIEW</li>
            <li className={`nav-item ${location.pathname !== '/' ? 'active' : ''}`} onClick={() => navigate('/upload')}>INSPECTION</li>
            <li className="nav-item">RESULTS</li>
            <li className="nav-item">MODEL STATUS</li>
        </ul>
        
        <div className="model-status-card">
            <h3>MODEL STATUS</h3>
            <div className="status-indicator online"><span className="dot"></span> ONLINE</div>
            <div className="model-detail"><span>MODEL:</span> YOLO</div>
            <div className="model-detail"><span>TASK:</span> Object Detection</div>
            <div className="model-detail"><span>CLASSES:</span> 2</div>
            <div className="model-classes">
                <div>CLASS 01: monopole_tower</div>
                <div>CLASS 02: supporting_tower</div>
            </div>
        </div>
    </aside>
  );
};

export default Sidebar;
