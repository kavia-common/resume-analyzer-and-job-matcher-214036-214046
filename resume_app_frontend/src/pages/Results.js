import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/Card';
import Stepper from '../components/Stepper';
import ScoreGauge from '../components/ScoreGauge';
import TagList from '../components/TagList';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
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

  const fetchResults = useCallback(() => {
    let mounted = true;
    setLoading(true);
    setError('');
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

  useEffect(fetchResults, [fetchResults]);

  if (loading) {
    return <Spinner label="Loading analysis results..." />;
  }
  if (error) {
    return (
      <EmptyState
        title="Error Loading Results"
        message={error}
        actions={<Button onClick={fetchResults}>Retry</Button>}
      />
    );
  }
  if (!results || !results.result) {
    return (
      <EmptyState
        title="No Results Found"
        message="We couldn't find any results for this analysis. It may have been cancelled or failed."
        actions={<Link to="/history" className="btn">Go to History</Link>}
      />
    );
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
