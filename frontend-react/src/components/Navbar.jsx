import React from 'react';
import { NavLink } from 'react-router-dom';
import { ScanSearch, Activity, LayoutDashboard, History } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <ScanSearch className="icon" size={24} />
        <span>TowerVision AI</span>
      </div>
      <div className="nav-links">
        <NavLink to="/" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          Home
        </NavLink>
        <NavLink to="/inspect" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          Inspect
        </NavLink>
        <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          Dashboard
        </NavLink>
        <NavLink to="/history" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          History
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
