/**
 * Common type definitions
 */
import React from 'react';

export type Size = 'small' | 'medium' | 'large';

export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface BaseComponentProps {
  className?: string;
  id?: string;
  'data-testid'?: string;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    light: string;
    dark: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}
