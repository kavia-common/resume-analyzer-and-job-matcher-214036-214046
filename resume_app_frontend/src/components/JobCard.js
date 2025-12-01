import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import Button from './Button';
import TagList from './TagList';

/**
 * PUBLIC_INTERFACE
 * JobCard: Displays a single job recommendation with key info and actions.
 */
function JobCard({ job }) {
  const { id, title, company, location, match_score, job_url, required_skills = [], status: initialStatus } = job || {};
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(null); // 'save' | 'hide' | null

  const handleUpdateStatus = async (newStatus) => {
    setLoading(newStatus);
    try {
      await api.updateRecommendationStatus(id, newStatus);
      setStatus(newStatus);
      toast.success(`Job has been ${newStatus}.`);
    } catch (err) {
      toast.error(err.message || `Failed to update status to ${newStatus}`);
    } finally {
      setLoading(null);
    }
  };

  const match = Math.round(match_score || 0);

  if (status === 'hidden') {
    return null;
  }

  return (
    <article className="card" aria-labelledby={`job-title-${id}`}>
      <h3 id={`job-title-${id}`} style={{ margin: '4px 0' }}>{title}</h3>
      <p className="subtitle" style={{ margin: 0 }}>{company} • {location}</p>
      
      <div className="progress" style={{ marginTop: 12 }} role="progressbar" aria-valuenow={match} aria-valuemin="0" aria-valuemax="100" aria-label={`Match score: ${match}%`}>
        <div className="progress-bar" style={{ width: `${Math.min(match, 100)}%` }} />
      </div>
      <p className="subtitle" style={{ marginTop: 8 }}>Match Score: <strong>{match}%</strong></p>
      
      <div style={{ marginTop: 12 }}>
        <TagList tags={(required_skills || []).slice(0, 8)} />
      </div>
      
      <div style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
        <a className="btn" href={job_url} target="_blank" rel="noopener noreferrer">View & Apply</a>
        {status === 'saved' ? (
          <span className="badge" style={{ borderColor: 'var(--success)', color: 'var(--success)' }}>Saved</span>
        ) : (
          <Button
            variant="secondary"
            onClick={() => handleUpdateStatus('saved')}
            loading={loading === 'saved'}
            disabled={!!loading}
            ariaLabel="Save job"
          >
            Save
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={() => handleUpdateStatus('hidden')}
          loading={loading === 'hidden'}
          disabled={!!loading}
          style={{ marginLeft: 'auto' }}
          ariaLabel="Hide job"
        >
          Hide
        </Button>
      </div>
    </article>
  );
}

export default JobCard;
