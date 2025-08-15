import React from 'react';
import { BaseComponentProps } from '../../types/common';
import { AILanguageDetection } from '../../types/chrome-ai';

export interface AILanguageDetectorProps extends BaseComponentProps {
  /**
   * Text to analyze for language detection
   */
  text: string;
  /**
   * Expected languages (helps improve accuracy)
   */
  expectedLanguages?: string[];
  /**
   * Minimum confidence threshold (0-1)
   */
  confidenceThreshold?: number;
  /**
   * Auto-detect when text changes
   */
  autoDetect?: boolean;
  /**
   * Show detection controls
   */
  showControls?: boolean;
  /**
   * Maximum text length for analysis
   */
  maxLength?: number;
  /**
   * Callback when language is detected
   */
  onDetect?: (detections: AILanguageDetection[]) => void;
  /**
   * Callback for detection errors
   */
  onError?: (error: string) => void;
  /**
   * Callback for download progress
   */
  onProgress?: (loaded: number, total: number) => void;
  /**
   * Placeholder text for input
   */
  placeholder?: string;
  /**
   * Show confidence scores
   */
  showConfidence?: boolean;
  /**
   * Maximum number of language suggestions to show
   */
  maxSuggestions?: number;
}
