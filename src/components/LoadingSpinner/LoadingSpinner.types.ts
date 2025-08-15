import React from 'react';

export interface LoadingSpinnerProps {
  /**
   * Size of the spinner
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Color of the spinner
   */
  color?: string;
  /**
   * Loading text to display
   */
  text?: string;
  /**
   * Show the spinner inline or as overlay
   */
  overlay?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}
