import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Card: Semantic container for surface content with padding and elevation.
 */
function Card({ title, subtitle, children, footer, style }) {
  return (
    <section className="card" style={style}>
      {title && <h2 className="title">{title}</h2>}
      {subtitle && <p className="subtitle">{subtitle}</p>}
      <div>{children}</div>
      {footer && <div style={{ marginTop: 12 }}>{footer}</div>}
    </section>
  );
}

export default Card;
