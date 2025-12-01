import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../components/Card';
import Stepper from '../components/Stepper';
import { api } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * AnalysisStatus: Polls task status and forwards to next step when complete.
 */
function AnalysisStatus() {
  const { analysisId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const poll = async () => {
      if (!mounted) return;
      try {
        const s = await api.getAnalysisStatus(analysisId);
        if (!mounted) return;

        setStatus(s);

        if (s?.status === 'complete' || s?.status === 'completed') {
          navigate(`/results/${encodeURIComponent(analysisId)}`);
        } else if (s?.status === 'failed') {
          setError(s?.result?.message || 'Analysis failed. Please try again.');
          clearInterval(intervalId);
        }
      } catch (err) {
        if (!mounted) return;
        // Stop polling on critical errors
        setError('Could not retrieve analysis status.');
        clearInterval(intervalId);
      }
    };

    poll(); // Initial call
    const intervalId = setInterval(poll, 3000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [analysisId, navigate]);
  
  const handleCancel = async () => {
    try {
      await api.cancelAnalysis(analysisId);
      navigate('/history');
    } catch(err) {
      setError('Failed to cancel analysis.');
    }
  }

  const progress = status?.progress ?? 0;
  const pct = Math.max(0, Math.min(100, progress));
  const currentStatus = status?.status || 'queued';

  return (
    <div>
      <Stepper steps={['Upload/URL', 'Analyze', 'Results', 'Suggestions', 'Jobs']} current={1} />
      <Card title="Analyzing your profile..." subtitle={`Analysis ID: ${analysisId}`}>
        {error ? (
          <p style={{ color: 'var(--error)' }}>Error: {error}</p>
        ) : (
          <>
            <div className="progress">
              <div className="progress-bar" style={{ width: `${pct}%` }} />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8}}>
              <p className="subtitle" style={{ margin: 0 }}>
                Status: {currentStatus} • {pct}%
              </p>
              <button className="btn secondary" onClick={handleCancel}>Cancel</button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default AnalysisStatus;
