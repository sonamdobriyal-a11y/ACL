import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">ACL</span>
          <span className="logo-text">Detection System</span>
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/camera-detection" 
              className={location.pathname === '/camera-detection' ? 'nav-link active' : 'nav-link'}
            >
              Live Detection
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/upload-image" 
              className={location.pathname === '/upload-image' ? 'nav-link active' : 'nav-link'}
            >
              Upload Image
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
