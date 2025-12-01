import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Stepper from '../components/Stepper';
import TagList from '../components/TagList';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { api } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * Suggestions: Provides improvement tips and required skills.
 */
function Suggestions() {
  const { analysisId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acknowledged, setAcknowledged] = useState(new Set());

  const fetchSuggestions = useCallback(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    api.getAnalysisResults(analysisId)
      .then((res) => {
        if (!mounted) return;
        setResults(res);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Failed to load suggestions.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [analysisId]);

  useEffect(fetchSuggestions, [fetchSuggestions]);

  const handleToggleAck = async (id) => {
    const isAcknowledged = acknowledged.has(id);
    const optimisticState = new Set(acknowledged);
    if (isAcknowledged) {
      optimisticState.delete(id);
    } else {
      optimisticState.add(id);
    }
    setAcknowledged(optimisticState);
    
    try {
      await api.acknowledgeSuggestion(analysisId, id);
      toast.success(isAcknowledged ? 'Suggestion un-checked.' : 'Suggestion acknowledged!');
    } catch(err) {
      setAcknowledged(acknowledged); // Revert on failure
      toast.error(err.message || 'Failed to update suggestion.');
    }
  };

  if (loading) {
    return <Spinner label="Loading suggestions..." />;
  }
  
  if (error) {
    return (
      <EmptyState
        title="Error Loading Suggestions"
        message={error}
        actions={<Button onClick={fetchSuggestions}>Retry</Button>}
      />
    );
  }
  
  if (!results || !results.result) {
    return (
      <EmptyState
        title="No Suggestions Found"
        message="No specific suggestions are available for this analysis."
        actions={<Link className="btn" to={`/jobs/${encodeURIComponent(analysisId)}`}>See Job Recommendations</Link>}
      />
    );
  }
  
  const { suggestions = [], required_skills: requiredSkills = [] } = results.result || {};

  return (
    <div>
      <Stepper steps={['Upload/URL', 'Analyze', 'Results', 'Suggestions', 'Jobs']} current={3} />
      <Card title="Improvement Suggestions" subtitle="Actionable items to boost your ATS score and readability">
        {suggestions.length === 0 ? (
          <p className="subtitle">No specific suggestions at this time. Your profile looks great!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {suggestions.map((s) => (
              <li key={s.id} style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
                <input 
                  type="checkbox"
                  id={`sug-${s.id}`}
                  checked={acknowledged.has(s.id)}
                  onChange={() => handleToggleAck(s.id)} 
                  style={{ marginRight: 10, width: 'auto', height: 'auto', accentColor: 'var(--primary)' }}
                />
                <label htmlFor={`sug-${s.id}`} style={{ fontWeight: 'normal', margin: 0, cursor: 'pointer' }}>{s.suggestion}</label>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card title="Required Skills" subtitle="Skills to add or emphasize based on your target role">
        <TagList tags={requiredSkills} />
        <div style={{ marginTop: 12 }}>
          <Link className="btn" to={`/jobs/${encodeURIComponent(analysisId)}`}>See Job Recommendations</Link>
        </div>
      </Card>
    </div>
  );
}

export default Suggestions;
