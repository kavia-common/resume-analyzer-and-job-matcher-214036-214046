import React, { useState } from 'react';
import { api } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * JobCard: Displays a single job recommendation with key info and actions.
 */
function JobCard({ job }) {
  const { id, title, company, location, match_score, job_url, required_skills = [], status: initialStatus } = job || {};
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdateStatus = async (newStatus) => {
    setLoading(true);
    setError('');
    try {
      await api.updateRecommendationStatus(id, newStatus);
      setStatus(newStatus);
    } catch (err) {
      setError(err.message || `Failed to update status to ${newStatus}`);
    } finally {
      setLoading(false);
    }
  };

  const match = Math.round(match_score || 0);

  if (status === 'hidden') {
    return null; // Or a placeholder indicating it's hidden
  }

  return (
    <article className="card">
      <h3 style={{ margin: '4px 0' }}>{title}</h3>
      <p className="subtitle" style={{ margin: 0 }}>{company} • {location}</p>
      
      <div className="progress" style={{ marginTop: 12 }}>
        <div className="progress-bar" style={{ width: `${Math.min(match, 100)}%` }} />
      </div>
      <p className="subtitle" style={{ marginTop: 8 }}>Match Score: {match}%</p>
      
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
        {(required_skills || []).slice(0, 8).map((s) => (
          <span key={s} className="badge">{s}</span>
        ))}
      </div>
      
      {error && <p style={{ color: 'var(--error)', fontSize: 12, marginTop: 8 }}>{error}</p>}
      
      <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
        <a className="btn" href={job_url} target="_blank" rel="noreferrer">View & Apply</a>
        {status === 'saved' ? (
          <span className="badge" style={{borderColor: 'var(--success)', color: 'var(--success)'}}>Saved</span>
        ) : (
          <button className="btn secondary" onClick={() => handleUpdateStatus('saved')} disabled={loading}>
            Save
          </button>
        )}
        <button className="btn secondary" onClick={() => handleUpdateStatus('hidden')} disabled={loading} style={{ marginLeft: 'auto' }}>
          Hide
        </button>
      </div>
    </article>
  );
}

export default JobCard;
