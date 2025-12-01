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
    <nav className="navbar" role="navigation" aria-label="Main">
      <div className="navbar-inner">
        <Link to="/" className="brand" aria-label="Resume Analyzer Home">
          <span className="brand-badge" aria-hidden>RA</span>
          <span>Resume Analyzer</span>
        </Link>

        <div className="nav-links">
          <Link className="nav-link" aria-current={isActive('/') ? 'page' : undefined} to="/">Home</Link>
          <Link className="nav-link" aria-current={isActive('/upload') ? 'page' : undefined} to="/upload">Upload</Link>
          <Link className="nav-link" aria-current={isActive('/submit-url') ? 'page' : undefined} to="/submit-url">Profile URL</Link>
          <Link className="nav-link" aria-current={isActive('/history') ? 'page' : undefined} to="/history">History</Link>
          <button className="theme-toggle-btn" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
