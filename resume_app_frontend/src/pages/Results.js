import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/Card';
import Stepper from '../components/Stepper';
import ScoreGauge from '../components/ScoreGauge';
import TagList from '../components/TagList';
import { api } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * Results: Displays ATS score, key findings, and next actions.
 */
function Results() {
  const { taskId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    api.getResults(taskId).then((res) => {
      if (mounted) setData(res || {});
    }).catch(() => {});
    return () => { mounted = false; };
  }, [taskId]);

  const score = data?.score ?? 0;
  const strengths = data?.strengths || [];
  const gaps = data?.gaps || [];
  const keywords = data?.keywords || [];

  return (
    <div>
      <Stepper steps={['Upload/URL', 'Analyze', 'Results', 'Suggestions', 'Jobs']} current={2} />
      <div className="grid cols-2">
        <ScoreGauge score={score} label="ATS Match" />
        <Card title="Highlights" subtitle="Key strengths and areas to improve">
          <h4>Strengths</h4>
          <TagList tags={strengths} />
          <hr className="div" />
          <h4>Gaps</h4>
          <TagList tags={gaps} />
        </Card>
      </div>
      <Card title="Important Keywords" subtitle="In-demand skills detected">
        <TagList tags={keywords} />
        <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link className="btn" to={`/suggestions/${encodeURIComponent(taskId)}`}>See Suggestions</Link>
          <Link className="btn secondary" to={`/jobs/${encodeURIComponent(taskId)}`}>View Jobs</Link>
        </div>
      </Card>
    </div>
  );
}

export default Results;
