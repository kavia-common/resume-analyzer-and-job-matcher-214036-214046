import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Stepper from '../components/Stepper';
import { api } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * UploadResume: Allows users to upload a resume file and starts analysis task.
 */
function UploadResume() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.uploadResume(file);
      const analysisId = response?.analysis_id;
      if (!analysisId) throw new Error('Did not receive analysis ID.');
      navigate(`/status/${encodeURIComponent(analysisId)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Stepper steps={['Upload/URL', 'Analyze', 'Results', 'Suggestions', 'Jobs']} current={0} />
      <Card title="Upload Resume" subtitle="Supported formats: PDF, DOCX.">
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <label htmlFor="resume">Resume file</label>
            <input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
          </div>
          {error && <p style={{ color: 'var(--error)', margin: '0 0 12px' }}>Error: {error}</p>}
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Start Analysis'}</button>
        </form>
      </Card>
    </div>
  );
}

export default UploadResume;
