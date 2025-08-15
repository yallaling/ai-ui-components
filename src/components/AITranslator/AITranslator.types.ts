import React from 'react';
import { BaseComponentProps } from '../../types/common';

export interface AITranslatorProps extends BaseComponentProps {
  /**
   * Source language code (e.g., 'en', 'es', 'fr')
   */
  sourceLanguage?: string;
  /**
   * Target language code (e.g., 'en', 'es', 'fr')
   */
  targetLanguage?: string;
  /**
   * Text to translate (can be provided externally)
   */
  text?: string;
  /**
   * External data to translate (accepts any type - will be converted to string)
   */
  data?: any;
  /**
   * Show input text area (optional UI)
   */
  showInput?: boolean;
  /**
   * Show translation output area
   */
  showOutput?: boolean;
  /**
   * Callback when translation is complete
   */
  onTranslate?: (translatedText: string) => void;
  /**
   * Callback for translation errors
   */
  onError?: (error: string) => void;
  /**
   * Callback for download progress
   */
  onProgress?: (loaded: number, total: number) => void;
  /**
   * Auto-translate when text or languages change
   */
  autoTranslate?: boolean;
  /**
   * Show translation controls
   */
  showControls?: boolean;
  /**
   * Placeholder text for input
   */
  placeholder?: string;
  /**
   * Maximum text length
   */
  maxLength?: number;
  /**
   * Enable streaming translation
   */
  streaming?: boolean;
  /**
   * Function to trigger translation externally
   */
  onTranslatorReady?: (
    translateFunction: (data?: any) => Promise<void>
  ) => void;
  /**
   * Controls-only mode - hides input UI and uses external data
   */
  controlsOnly?: boolean;
  /**
   * External text data for controls-only mode
   */
  externalText?: string;
  /**
   * Make component resizable
   */
  resizable?: boolean;
  /**
   * Allow copy functionality
   */
  allowCopy?: boolean;
  /**
   * Allow download functionality
   */
  allowDownload?: boolean;
  /**
   * Download filename
   */
  downloadFileName?: string;
}
