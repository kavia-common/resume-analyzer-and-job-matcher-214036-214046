import React from 'react';
import Card from './Card'; // Assuming Card component is in the same folder

/**
 * PUBLIC_INTERFACE
 * A component to display when a list or content area is empty.
 *
 * @param {object} props - The component props.
 * @param {string} props.title - The main message for the empty state.
 * @param {string} props.message - A more detailed message.
 * @param {React.ReactNode} [props.actions] - Action buttons or links to display.
 * @returns {React.ReactElement} The rendered empty state component.
 */
function EmptyState({ title, message, actions }) {
  return (
    <Card style={{ textAlign: 'center', padding: '32px' }}>
      <h3 className="title" style={{ fontSize: '20px' }}>{title}</h3>
      <p className="subtitle">{message}</p>
      {actions && <div style={{ marginTop: '16px' }}>{actions}</div>}
    </Card>
  );
}

export default EmptyState;
