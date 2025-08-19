import React, { forwardRef } from 'react';
import { BaseComponentProps } from '../types';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends BaseComponentProps {
  /**
   * Button contents
   */
  children: React.ReactNode;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Button variant
   */
  variant?: ButtonVariant;
  /**
   * Button size
   */
  size?: ButtonSize;
  /**
   * Is this the disabled state?
   */
  disabled?: boolean;
  /**
   * Button type
   */
  type?: 'button' | 'submit' | 'reset';
}

/**
 * React Button component
 * Primary UI component for user interaction
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'medium',
      disabled = false,
      type = 'button',
      className = '',
      onClick,
      style,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'btn';
    const variantClass = `btn--${variant}`;
    const sizeClass = `btn--${size}`;
    const disabledClass = disabled ? 'btn--disabled' : '';

    const classes = [
      baseClasses,
      variantClass,
      sizeClass,
      disabledClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled}
        onClick={onClick}
        style={style}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
