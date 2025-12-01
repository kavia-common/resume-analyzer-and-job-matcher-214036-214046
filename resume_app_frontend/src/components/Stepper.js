import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Stepper: Horizontal step indicator.
 */
function Stepper({ steps = [], current = 0 }) {
  return (
    <div role="list" aria-label="Analysis steps" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
      {steps.map((s, idx) => {
        const done = idx < current;
        const active = idx === current;
        let status = 'upcoming';
        if (done) status = 'completed';
        if (active) status = 'active';

        return (
          <div 
            key={s} 
            role="listitem"
            className="badge" 
            style={{
              background: active ? 'rgba(59,130,246,0.15)' : done ? 'rgba(6,182,212,0.15)' : 'rgba(100,116,139,0.10)',
              borderColor: active ? 'rgba(59,130,246,0.4)' : done ? 'rgba(6,182,212,0.4)' : 'var(--border)',
              fontWeight: active ? '600' : 'normal',
            }}
            aria-current={active ? 'step' : false}
            aria-label={`Step ${idx + 1}: ${s} (${status})`}
          >
            {idx + 1}. {s}
          </div>
        );
      })}
    </div>
  );
}

export default Stepper;
