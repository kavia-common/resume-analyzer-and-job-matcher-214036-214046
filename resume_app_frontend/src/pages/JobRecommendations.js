import React, { useEffect, useState } from 'react';
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
  const { taskId } = useParams();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    let mounted = true;
    api.getJobRecommendations(taskId).then((res) => {
      if (!mounted) return;
      setJobs(res?.jobs || []);
    }).catch(() => {});
    return () => { mounted = false; };
  }, [taskId]);

  return (
    <div>
      <Stepper steps={['Upload/URL', 'Analyze', 'Results', 'Suggestions', 'Jobs']} current={4} />
      <Card title="Job Recommendations" subtitle="Tailored opportunities based on your profile and target role">
        <div className="grid">
          {jobs.length === 0 && <p className="subtitle">No jobs yet. Try adjusting your role or profile details.</p>}
          {jobs.map((j) => <JobCard key={`${j.title}-${j.company}-${j.link}`} job={j} />)}
        </div>
      </Card>
    </div>
  );
}

export default JobRecommendations;
