import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-left">
            <Link to="/" className="navbar-brand">
              <div className="navbar-logo">
                <div className="logo-icon">
                  <span>V</span>
                </div>
                <span className="brand-text">VolSum AI</span>
              </div>
            </Link>
            <div className="navbar-links">
              <Link 
                to="/" 
                className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                <span className="link-icon">📊</span>
                Dashboard
              </Link>
              <Link 
                to="/analysis" 
                className={`navbar-link ${location.pathname === '/analysis' ? 'active' : ''}`}
              >
                <span className="link-icon">🔍</span>
                Analysis
              </Link>
            </div>
          </div>
          <div className="navbar-right">
            {isAuthenticated ? (
              <button onClick={logout} className="logout-button">
                <span className="button-icon">🚪</span>
                Sign Out
              </button>
            ) : (
              <Link to="/login" className="login-button">
                <span className="button-icon">🔑</span>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 