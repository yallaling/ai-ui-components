import { CSSProperties } from 'react';

export interface BaseComponentProps {
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Inline styles
   */
  style?: CSSProperties;
  /**
   * Component width
   */
  width?: string | number;
  /**
   * Component height
   */
  height?: string | number;
}
