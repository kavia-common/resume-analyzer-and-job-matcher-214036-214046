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
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState({ state: 'queued', progress: 0 });

  useEffect(() => {
    let mounted = true;
    const poll = async () => {
      try {
        const s = await api.getStatus(taskId);
        if (!mounted) return;
        setStatus(s || {});
        if (s?.state === 'completed') {
          navigate(`/results/${encodeURIComponent(taskId)}`);
        } else if (s?.state === 'failed') {
          alert('Analysis failed');
        }
      } catch {
        // ignore transient errors
      }
    };
    poll();
    const id = setInterval(poll, 2000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [taskId, navigate]);

  const pct = Math.max(0, Math.min(100, status?.progress ?? 0));

  return (
    <div>
      <Stepper steps={['Upload/URL', 'Analyze', 'Results', 'Suggestions', 'Jobs']} current={1} />
      <Card title="Analyzing your profile..." subtitle={`Task: ${taskId}`}>
        <div className="progress">
          <div className="progress-bar" style={{ width: `${pct}%` }} />
        </div>
        <p className="subtitle" style={{ marginTop: 8 }}>
          Status: {status?.state || 'unknown'} • {pct}%
        </p>
      </Card>
    </div>
  );
}

export default AnalysisStatus;
