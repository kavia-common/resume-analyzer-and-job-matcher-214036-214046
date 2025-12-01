import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import Router from './routes/Router';
import NavBar from './components/NavBar';

// PUBLIC_INTERFACE
function App() {
  /**
   * Root component providing application layout, theme handling, and route rendering.
   * Renders the NavBar and the Router that defines app pages.
   */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle between light and dark themes for accessibility and preference */
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="app-root" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <NavBar theme={theme} onToggleTheme={toggleTheme} />
      <main className="container">
        <Router />
      </main>
      <footer className="footer">
        <p className="footer-text">© {new Date().getFullYear()} Resume Analyzer & Job Matcher</p>
      </footer>
    </div>
  );
}

export default App;
