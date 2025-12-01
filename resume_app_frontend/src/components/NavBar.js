import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * NavBar renders the top navigation bar with branding, navigation, and a theme toggle.
 */
function NavBar({ theme, onToggleTheme }) {
  const { pathname } = useLocation();
  const isActive = (p) => pathname === p;

  return (
    <header className="navbar" role="navigation" aria-label="Main">
      <div className="navbar-inner">
        <Link to="/" className="brand" aria-label="Resume Analyzer Home">
          <span className="brand-badge" aria-hidden="true">RA</span>
          <span>Resume Analyzer</span>
        </Link>

        <div className="nav-links">
          <Link className="nav-link" to="/" aria-current={isActive('/') ? 'page' : undefined} aria-label="Home page">Home</Link>
          <Link className="nav-link" to="/upload" aria-current={isActive('/upload') ? 'page' : undefined} aria-label="Upload resume page">Upload</Link>
          <Link className="nav-link" to="/submit-url" aria-current={isActive('/submit-url') ? 'page' : undefined} aria-label="Submit profile URL page">Profile URL</Link>
          <Link className="nav-link" to="/history" aria-current={isActive('/history') ? 'page' : undefined} aria-label="Analysis history page">History</Link>
          <button 
            className="theme-toggle-btn" 
            onClick={onToggleTheme} 
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
            <span className="sr-only">{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
