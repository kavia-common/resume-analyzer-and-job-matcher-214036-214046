import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/Card';
import Stepper from '../components/Stepper';
import TagList from '../components/TagList';
import { api } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * Suggestions: Provides improvement tips and required skills.
 */
function Suggestions() {
  const { taskId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    api.getSuggestions(taskId).then((res) => {
      if (mounted) setData(res || {});
    }).catch(() => {});
    return () => { mounted = false; };
  }, [taskId]);

  const suggestions = data?.suggestions || [];
  const requiredSkills = data?.required_skills || [];

  return (
    <div>
      <Stepper steps={['Upload/URL', 'Analyze', 'Results', 'Suggestions', 'Jobs']} current={3} />
      <Card title="Improvement Suggestions" subtitle="Actionable items to boost your ATS score and readability">
        <ul>
          {suggestions.map((s, i) => (
            <li key={i} style={{ marginBottom: 8 }}>{s}</li>
          ))}
        </ul>
      </Card>
      <Card title="Required Skills" subtitle="Skills to add or emphasize">
        <TagList tags={requiredSkills} />
        <div style={{ marginTop: 12 }}>
          <Link className="btn" to={`/jobs/${encodeURIComponent(taskId)}`}>See Job Recommendations</Link>
        </div>
      </Card>
    </div>
  );
}

export default Suggestions;
