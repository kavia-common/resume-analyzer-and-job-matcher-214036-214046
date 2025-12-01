import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Stepper from '../components/Stepper';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
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
  const [isCancelling, setCancelling] = useState(false);

  const poll = useCallback(async (isMounted) => {
    try {
      const s = await api.getAnalysisStatus(analysisId);
      if (!isMounted()) return;

      setStatus(s);

      if (s?.status === 'complete' || s?.status === 'completed') {
        toast.success('Analysis complete!');
        navigate(`/results/${encodeURIComponent(analysisId)}`);
      } else if (s?.status === 'failed') {
        setError(s?.result?.message || 'Analysis failed. Please try again.');
      }
    } catch (err) {
      if (!isMounted()) return;
      setError('Could not retrieve analysis status. Please check your connection.');
    }
  }, [analysisId, navigate]);

  useEffect(() => {
    let mounted = true;
    const isMounted = () => mounted;
    
    poll(isMounted); // Initial call
    const intervalId = setInterval(() => poll(isMounted), 3000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [poll]);
  
  const handleCancel = async () => {
    setCancelling(true);
    try {
      await api.cancelAnalysis(analysisId);
      toast.success('Analysis has been cancelled.');
      navigate('/history');
    } catch(err) {
      toast.error('Failed to cancel analysis.');
      setCancelling(false);
    }
  }

  const progress = status?.progress ?? 0;
  const pct = Math.max(0, Math.min(100, progress));
  const currentStatus = status?.status || 'queued';
  const isLoading = !status && !error;

  const renderContent = () => {
    if (isLoading) {
      return <Spinner label="Loading analysis status..." />;
    }
    if (error) {
      return (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--error)' }}><strong>Error: {error}</strong></p>
          <p className="subtitle">Something went wrong. You can retry or go back to the homepage.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button onClick={() => poll(() => true)}>Retry</Button>
            <Link to="/" className="btn secondary">Home</Link>
          </div>
        </div>
      );
    }
    return (
      <>
        <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100" aria-label={`Analysis progress: ${pct}%`}>
          <div className="progress-bar" style={{ width: `${pct}%` }} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8}}>
          <p className="subtitle" style={{ margin: 0 }}>
            Status: <strong>{currentStatus}</strong> • {pct}%
          </p>
          <Button variant="secondary" onClick={handleCancel} loading={isCancelling} aria-label="Cancel analysis">
            Cancel
          </Button>
        </div>
      </>
    );
  };

  return (
    <div>
      <Stepper steps={['Upload/URL', 'Analyze', 'Results', 'Suggestions', 'Jobs']} current={1} />
      <Card title="Analyzing your profile..." subtitle={`Analysis ID: ${analysisId}`}>
        {renderContent()}
      </Card>
    </div>
  );
}

export default AnalysisStatus;
