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
  const { analysisId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setError(err.message || 'Failed to load results.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [analysisId]);

  if (loading) {
    return <div>Loading analysis results...</div>;
  }
  if (error) {
    return <p style={{ color: 'var(--error)' }}>Error: {error}</p>;
  }
  if (!results) {
    return <p>No results found for this analysis.</p>;
  }

  const { score_overall: score = 0, strengths = [], gaps = [], keywords_extracted: keywords = [] } = results.result || {};

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
          <Link className="btn" to={`/suggestions/${encodeURIComponent(analysisId)}`}>See Suggestions</Link>
          <Link className="btn secondary" to={`/jobs/${encodeURIComponent(analysisId)}`}>View Jobs</Link>
        </div>
      </Card>
    </div>
  );
}

export default Results;
