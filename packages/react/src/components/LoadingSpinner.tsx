import React, { forwardRef } from 'react';
import { BaseComponentProps } from '../types';

export interface LoadingSpinnerProps extends BaseComponentProps {
  /**
   * Size of the spinner
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Custom size in pixels
   */
  customSize?: number;
  /**
   * Color of the spinner
   */
  color?: string;
  /**
   * Loading message to display
   */
  message?: string;
  /**
   * Show loading message
   */
  showMessage?: boolean;
}

/**
 * React wrapper for the Loading Spinner component
 */
export const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  (
    {
      size = 'medium',
      customSize,
      color,
      message = 'Loading...',
      showMessage = true,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const spinnerStyle: React.CSSProperties = {
      ...style,
      '--spinner-size': customSize ? `${customSize}px` : undefined,
      '--spinner-color': color,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={`loading-spinner loading-spinner--${size} ${className}`}
        style={spinnerStyle}
        {...props}
      >
        <div className="loading-spinner__circle" />
        {showMessage && message && (
          <div className="loading-spinner__message">{message}</div>
        )}
      </div>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
