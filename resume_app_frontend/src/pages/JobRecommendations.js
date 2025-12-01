import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Stepper from '../components/Stepper';
import Card from '../components/Card';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
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
    if (!append) setError('');
    
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
  
  const renderContent = () => {
    if (loading && page === 1) {
      return <Spinner label="Loading job recommendations..." />;
    }
    
    if (error && jobs.length === 0) {
      return (
        <EmptyState
          title="Error Loading Jobs"
          message={error}
          actions={<Button onClick={() => fetchJobs(1, false)}>Retry</Button>}
        />
      );
    }
    
    if (jobs.length === 0) {
      return (
        <EmptyState
          title="No Jobs Found"
          message="We couldn't find any job recommendations for this analysis. Try analyzing with a different target role."
          actions={<Link to="/history" className="btn secondary">Back to History</Link>}
        />
      );
    }

    return (
      <>
        <div className="grid">
          {jobs.map((j) => <JobCard key={j.id} job={j} />)}
        </div>
        {hasMore && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Button variant="secondary" onClick={loadMore} loading={loading}>
              Load More
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      <Stepper steps={['Upload/URL', 'Analyze', 'Results', 'Suggestions', 'Jobs']} current={4} />
      <Card title="Job Recommendations" subtitle="Tailored opportunities based on your profile and target role">
        {renderContent()}
      </Card>
    </div>
  );
}

export default JobRecommendations;
