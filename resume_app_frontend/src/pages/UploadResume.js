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
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      const task = await api.uploadResume(file, role);
      const taskId = task?.task_id || task?.id || 'task';
      navigate(`/status/${encodeURIComponent(taskId)}`);
    } catch (err) {
      alert(err?.message || 'Upload failed');
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
          <div className="form-row">
            <label htmlFor="role">Target role (optional)</label>
            <input id="role" name="role" type="text" placeholder="e.g., Frontend Engineer" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Start Analysis'}</button>
        </form>
      </Card>
    </div>
  );
}

export default UploadResume;
