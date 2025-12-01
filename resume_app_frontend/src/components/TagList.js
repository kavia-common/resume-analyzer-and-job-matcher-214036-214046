import React from 'react';

/**
 * PUBLIC_INTERFACE
 * TagList: Displays a list of tags with optional click handler.
 */
function TagList({ tags = [], onClick }) {
  if (!tags.length) return null;
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {tags.map((t) => (
        <button
          key={t}
          type="button"
          className="badge"
          style={{ background: 'rgba(59,130,246,0.08)', cursor: onClick ? 'pointer' : 'default' }}
          onClick={onClick ? () => onClick(t) : undefined}
          aria-label={`Tag ${t}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export default TagList;
