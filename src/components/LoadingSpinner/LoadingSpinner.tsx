import React from 'react';
import { LoadingSpinnerProps } from './LoadingSpinner.types';
import './LoadingSpinner.css';

/**
 * Loading spinner component for indicating processing states
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#007bff',
  text,
  overlay = false,
  className = '',
}) => {
  const sizeClass = `loading-spinner--${size}`;
  const overlayClass = overlay ? 'loading-spinner--overlay' : '';

  const classes = ['loading-spinner', sizeClass, overlayClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <div className="loading-spinner__container">
        <div
          className="loading-spinner__circle"
          style={{ borderTopColor: color }}
        />
        {text && <div className="loading-spinner__text">{text}</div>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
