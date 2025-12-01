import React from 'react';

/**
 * PUBLIC_INTERFACE
 * A versatile button component with built-in loading and variant states.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content of the button.
 * @param {() => void} props.onClick - The click handler.
 * @param {'primary' | 'secondary'} [props.variant='primary'] - The button style variant.
 * @param {boolean} [props.loading=false] - Whether the button is in a loading state.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {'submit' | 'button'} [props.type='button'] - The button type.
 * @param {string} [props.ariaLabel] - The ARIA label for accessibility.
 * @returns {React.ReactElement} The rendered button component.
 */
function Button({
  children,
  onClick,
  variant = 'primary',
  loading = false,
  disabled = false,
  type = 'button',
  ariaLabel,
  ...rest
}) {
  const isDisabled = loading || disabled;
  const isPrimary = variant === 'primary';

  return (
    <button
      type={type}
      className={`btn ${variant}`}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        <span className={isPrimary ? "spinner-light" : "spinner"} role="status" aria-label="Loading" />
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
