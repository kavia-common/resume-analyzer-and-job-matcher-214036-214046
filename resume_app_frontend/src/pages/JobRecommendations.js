import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Stepper from '../components/Stepper';
import Card from '../components/Card';
import JobCard from '../components/JobCard';
import { api } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * JobRecommendations: Shows recommended jobs and match percentage.
 */
function JobRecommendations() {
  const { analysisId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchJobs = useCallback((p, append = false) => {
    setLoading(true);
    setError('');
    api.getJobRecommendations(analysisId, p)
      .then((res) => {
        const newJobs = res?.recommendations || [];
        setJobs(prev => append ? [...prev, ...newJobs] : newJobs);
        setHasMore(newJobs.length > 0 && ((res?.offset || 0) + (res?.limit || 0) < (res?.total || 0)));
      })
      .catch((err) => {
        setError(err.message || 'Failed to load job recommendations.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [analysisId]);

  useEffect(() => {
    fetchJobs(1, false);
  }, [fetchJobs]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchJobs(nextPage, true);
  };

  return (
    <div>
      <Stepper steps={['Upload/URL', 'Analyze', 'Results', 'Suggestions', 'Jobs']} current={4} />
      <Card title="Job Recommendations" subtitle="Tailored opportunities based on your profile and target role">
        {error && <p style={{ color: 'var(--error)' }}>Error: {error}</p>}
        
        <div className="grid">
          {jobs.map((j) => <JobCard key={j.id} job={j} />)}
        </div>
        
        {loading && page === 1 && <p>Loading jobs...</p>}

        {!loading && jobs.length === 0 && !error && (
            <p className="subtitle">No jobs found. Try adjusting your role or profile details.</p>
        )}

        {hasMore && !loading && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <button className="btn secondary" onClick={loadMore} disabled={loading}>
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default JobRecommendations;
