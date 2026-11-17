import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <nav className="top-nav">
        <div className="nav-left" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
            <div className="logo">TOWERVISION AI</div>
            <div className="nav-title">AI-Based Tower Component Detection</div>
        </div>
        <div className="nav-right">
            <div className="status-indicator online">
                <span className="dot"></span> SYSTEM ONLINE
            </div>
            <div className="model-info">
                <span>Model: YOLO Detection</span> | <span>Classes: 2</span>
            </div>
        </div>
    </nav>
  );
};

export default Header;
