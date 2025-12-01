import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ScoreGauge: Circular score indicator using conic-gradient.
 */
function ScoreGauge({ score = 0, label = 'ATS Score' }) {
  const clamped = Math.max(0, Math.min(100, score));
  const gradient = `conic-gradient(var(--primary) ${clamped * 3.6}deg, var(--border) 0deg)`;
  
  return (
    <div 
      className="card" 
      style={{ textAlign: 'center' }} 
      role="region" 
      aria-label={`${label}: ${clamped} out of 100`}
    >
      <div style={{
        width: 140, height: 140, borderRadius: '50%',
        background: gradient, margin: '0 auto', display: 'grid', placeItems: 'center'
      }}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%', background: 'var(--surface)',
          display: 'grid', placeItems: 'center', border: '1px solid var(--border)'
        }}>
          <strong style={{ fontSize: 24 }} aria-hidden="true">{clamped}</strong>
        </div>
      </div>
      <p className="subtitle" style={{ marginTop: 10 }} aria-hidden="true">{label}</p>
    </div>
  );
}

export default ScoreGauge;
