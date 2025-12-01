import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/Card';
import Stepper from '../components/Stepper';
import TagList from '../components/TagList';
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

  useEffect(() => {
    let mounted = true;
    setLoading(true);
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

  const handleToggleAck = (id) => {
    setAcknowledged(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  
  const handleSaveChanges = async () => {
    try {
      await api.acknowledgeSuggestions(analysisId, Array.from(acknowledged));
      // TODO: Show a success message
    } catch(err) {
      setError(err.message || 'Failed to save changes.');
    }
  }

  if (loading) {
    return <div>Loading suggestions...</div>;
  }
  if (error) {
    return <p style={{ color: 'var(--error)' }}>Error: {error}</p>;
  }
  if (!results) {
    return <p>No suggestions found for this analysis.</p>;
  }
  
  const { suggestions = [], required_skills: requiredSkills = [] } = results.result || {};

  return (
    <div>
      <Stepper steps={['Upload/URL', 'Analyze', 'Results', 'Suggestions', 'Jobs']} current={3} />
      <Card title="Improvement Suggestions" subtitle="Actionable items to boost your ATS score and readability">
        {error && <p style={{ color: 'var(--error)' }}>{error}</p>}
        {suggestions.length === 0 ? (
          <p className="subtitle">No specific suggestions at this time.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {suggestions.map((s) => (
              <li key={s.id} style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
                <input 
                  type="checkbox"
                  id={`sug-${s.id}`}
                  checked={acknowledged.has(s.id)}
                  onChange={() => handleToggleAck(s.id)} 
                  style={{ marginRight: 10, width: 'auto' }}
                />
                <label htmlFor={`sug-${s.id}`} style={{ fontWeight: 'normal', margin: 0 }}>{s.suggestion}</label>
              </li>
            ))}
          </ul>
        )}
         {suggestions.length > 0 && (
          <button className="btn secondary" onClick={handleSaveChanges} style={{marginTop: 12}}>
            Save Changes
          </button>
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
