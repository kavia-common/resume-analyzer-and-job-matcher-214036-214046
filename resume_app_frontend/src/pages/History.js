import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { api } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * History: Lists prior analysis tasks for quick access.
 */
function History() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = useCallback(() => {
    let mounted = true;
    setLoading(true);
    setError('');
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

  useEffect(fetchHistory, [fetchHistory]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };
  
  const renderContent = () => {
    if (loading) {
      return <Spinner label="Loading history..." />;
    }
    
    if (error) {
      return (
        <EmptyState 
          title="Error Loading History"
          message={error}
          actions={<Button onClick={fetchHistory}>Retry</Button>}
        />
      );
    }

    if (analyses.length === 0) {
      return (
        <EmptyState 
          title="No History Found"
          message="You haven't analyzed any resumes or profiles yet."
          actions={<Link to="/upload" className="btn">Get Started</Link>}
        />
      );
    }
    
    return (
      <div className="grid" role="list">
        {analyses.map((analysis) => (
          <div className="card" key={analysis.id} role="listitem">
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
                 <Link className="btn" to={`/results/${encodeURIComponent(analysis.id)}`} aria-label={`View results for analysis of ${analysis.created_at}`}>View Results</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <Card title="History" subtitle="Your recent analyses">
      {renderContent()}
    </Card>
  );
}

export default History;
