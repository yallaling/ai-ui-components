/**
 * Component-specific type definitions
 */

import { BaseComponentProps, Size, Variant } from './common';

export interface AIComponentProps extends BaseComponentProps {
  onContentGenerated?: (content: string) => void;
  onError?: (error: string) => void;
  onProgressUpdate?: (progress: number) => void;
  placeholder?: string;
  disabled?: boolean;
  resizable?: boolean;
  allowCopy?: boolean;
  allowDownload?: boolean;
  downloadFileName?: string;
}

export interface ButtonComponentProps extends BaseComponentProps {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
}

export interface InputComponentProps extends BaseComponentProps {
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

export interface ModalComponentProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: Size;
}

export interface TooltipComponentProps extends BaseComponentProps {
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
}
