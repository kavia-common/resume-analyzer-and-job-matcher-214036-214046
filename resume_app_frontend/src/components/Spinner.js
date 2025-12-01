import React from 'react';

/**
 * PUBLIC_INTERFACE
 * A simple CSS-based loading spinner.
 *
 * @param {object} props - The component props.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - The size of the spinner.
 * @param {string} [props.label='Loading...'] - The accessible label for the spinner.
 * @returns {React.ReactElement} The rendered spinner component.
 */
function Spinner({ size = 'md', label = 'Loading...' }) {
  return (
    <div className="spinner-container" role="status" aria-label={label}>
      <div className={`spinner ${size}`} />
    </div>
  );
}

export default Spinner;
