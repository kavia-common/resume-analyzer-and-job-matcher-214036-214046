import React from 'react';

/**
 * PUBLIC_INTERFACE
 * JobCard: Displays a single job recommendation with key info and CTA.
 */
function JobCard({ job }) {
  const { title, company, location, match, link, skills = [] } = job || {};
  return (
    <article className="card">
      <h3 style={{ margin: '4px 0' }}>{title}</h3>
      <p className="subtitle" style={{ margin: 0 }}>{company} • {location}</p>
      <div className="progress" style={{ marginTop: 12 }}>
        <div className="progress-bar" style={{ width: `${Math.min(match || 0, 100)}%` }} />
      </div>
      <p className="subtitle" style={{ marginTop: 8 }}>Match: {Math.round(match || 0)}%</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
        {skills.slice(0, 8).map((s) => (
          <span key={s} className="badge">{s}</span>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <a className="btn" href={link} target="_blank" rel="noreferrer">View & Apply</a>
      </div>
    </article>
  );
}

export default JobCard;
