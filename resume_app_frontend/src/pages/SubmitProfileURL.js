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
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    try {
      const task = await api.submitProfileURL(url, role);
      const taskId = task?.task_id || task?.id || 'task';
      navigate(`/status/${encodeURIComponent(taskId)}`);
    } catch (err) {
      alert(err?.message || 'Submission failed');
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
          <div className="form-row">
            <label htmlFor="role">Target role (optional)</label>
            <input id="role" name="role" type="text" placeholder="e.g., Data Scientist" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Start Analysis'}</button>
        </form>
      </Card>
    </div>
  );
}

export default SubmitProfileURL;
