import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Stepper from '../components/Stepper';

/**
 * PUBLIC_INTERFACE
 * Home: Landing page with primary actions and flow overview.
 */
function Home() {
  return (
    <div className="grid">
      <Card
        title="Resume Analyzer & Job Matcher"
        subtitle="Upload your resume or provide your profile URL to get ATS compliance analysis, improvement suggestions, and tailored job recommendations."
      >
        <div className="grid cols-2">
          <div className="card">
            <h3>Get Started</h3>
            <p className="subtitle">Choose how you want to begin your analysis.</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link className="btn" to="/upload">Upload Resume</Link>
              <Link className="btn secondary" to="/submit-url">Use Profile URL</Link>
            </div>
          </div>
          <div className="card">
            <h3>Flow</h3>
            <Stepper steps={['Upload/URL', 'Analyze', 'Results', 'Suggestions', 'Jobs']} current={0} />
            <p className="subtitle">A clear, guided process to optimize your profile and find matching jobs.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Home;
