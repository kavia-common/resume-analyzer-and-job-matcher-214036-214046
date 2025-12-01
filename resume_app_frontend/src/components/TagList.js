import React from 'react';

/**
 * PUBLIC_INTERFACE
 * TagList: Displays a list of tags with optional click handler.
 */
function TagList({ tags = [], onClick }) {
  if (!tags || tags.length === 0) return null;
  
  const TagComponent = onClick ? 'button' : 'span';

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {tags.map((t) => (
        <TagComponent
          key={t}
          type={onClick ? 'button' : undefined}
          className="badge"
          style={{ 
            background: 'rgba(59,130,246,0.08)', 
            cursor: onClick ? 'pointer' : 'default',
            border: onClick ? '1px solid transparent' : '1px solid var(--border)',
          }}
          onClick={onClick ? () => onClick(t) : undefined}
          aria-label={onClick ? `Filter by tag: ${t}` : `Tag: ${t}`}
        >
          {t}
        </TagComponent>
      ))}
    </div>
  );
}

export default TagList;
