import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Stepper from '../components/Stepper';
import { api } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * SubmitProfileURL: Submits a profile URL to be analyzed (LinkedIn, etc.)
 */
function SubmitProfileURL() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.submitProfileURL(url);
      const analysisId = response?.analysis_id;
      if (!analysisId) throw new Error('Did not receive analysis ID.');
      navigate(`/status/${encodeURIComponent(analysisId)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Stepper steps={['Upload/URL', 'Analyze', 'Results', 'Suggestions', 'Jobs']} current={0} />
      <Card title="Submit Profile URL" subtitle="We’ll fetch your profile details and start the analysis.">
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <label htmlFor="url">Profile URL</label>
            <input id="url" name="url" type="url" placeholder="https://www.linkedin.com/in/..." required value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          {error && <p style={{ color: 'var(--error)', margin: '0 0 12px' }}>Error: {error}</p>}
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Start Analysis'}</button>
        </form>
      </Card>
    </div>
  );
}

export default SubmitProfileURL;
