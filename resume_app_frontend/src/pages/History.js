import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { api } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * History: Lists prior analysis tasks for quick access.
 */
function History() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.getUserAnalyses()
      .then((res) => {
        if (!mounted) return;
        setAnalyses(res || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Failed to load analysis history.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card title="History" subtitle="Your recent analyses">
      {loading && <p>Loading history...</p>}
      {error && <p style={{ color: 'var(--error)' }}>Error: {error}</p>}
      {!loading && !error && (
        <div className="grid">
          {analyses.length === 0 ? (
            <p className="subtitle">No history found.</p>
          ) : (
            analyses.map((analysis) => (
              <div className="card" key={analysis.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div>
                    <strong>{analysis.profile_id ? 'Profile URL' : 'Resume'} Analysis</strong>
                    <p className="subtitle" style={{ margin: 0 }}>
                      Role: {analysis.target_role || 'General'}
                    </p>
                     <p className="subtitle" style={{ margin: 0, fontSize: 12 }}>
                      {formatDate(analysis.created_at)}
                    </p>
                  </div>
                  <div style={{textAlign: 'right'}}>
                     <span className="badge" style={{marginBottom: 8, display: 'inline-block'}}>{analysis.status}</span>
                     <br />
                     <Link className="btn" to={`/results/${encodeURIComponent(analysis.id)}`}>View Results</Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </Card>
  );
}

export default History;
