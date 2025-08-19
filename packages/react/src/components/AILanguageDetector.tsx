import React, { useEffect, useRef, useCallback, forwardRef } from 'react';
import '@yallaling/web-ai-components/ai-language-detector';
import { BaseComponentProps } from '../types';

export interface AILanguageDetection {
  detectedLanguage: string;
  confidence: number;
}

export interface AILanguageDetectorProps extends BaseComponentProps {
  /**
   * Text to analyze for language detection
   */
  text: string;
  /**
   * External data to analyze (accepts any type - will be converted to string)
   */
  data?: string | object | number | boolean;
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
   * Show confidence scores
   */
  showConfidence?: boolean;
  /**
   * Maximum number of language suggestions to show
   */
  maxSuggestions?: number;
  /**
   * Placeholder text for input
   */
  placeholder?: string;
  /**
   * Show input text area
   */
  showInput?: boolean;
  /**
   * Show output area
   */
  showOutput?: boolean;
  /**
   * Controls only mode
   */
  controlsOnly?: boolean;
  /**
   * External text input (for programmatic use)
   */
  externalText?: string;
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
   * Function to trigger detection externally
   */
  onDetectorReady?: (
    detectFunction: (data?: string | object | number | boolean) => Promise<void>
  ) => void;
}

// Declare the custom element type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ai-language-detector': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'expected-languages'?: string;
          'confidence-threshold'?: number;
          'auto-detect'?: boolean;
          'show-controls'?: boolean;
          'show-input'?: boolean;
          'show-output'?: boolean;
          'show-confidence'?: boolean;
          'controls-only'?: boolean;
          'max-length'?: number;
          'max-suggestions'?: number;
          'placeholder'?: string;
          'text'?: string;
          'external-text'?: string;
        },
        HTMLElement
      >;
    }
  }
}

/**
 * React wrapper for the universal AI Language Detector Web Component
 * Maintains backward compatibility with existing React API
 */
export const AILanguageDetector = forwardRef<HTMLElement, AILanguageDetectorProps>(
  (
    {
      text,
      data,
      expectedLanguages,
      confidenceThreshold = 0.5,
      autoDetect = false,
      showControls = true,
      showInput = true,
      showOutput = true,
      showConfidence = true,
      controlsOnly = false,
      maxLength = 2000,
      maxSuggestions = 3,
      placeholder = 'Enter text to detect language...',
      externalText,
      onDetect,
      onError,
      onProgress,
      onDetectorReady,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const elementRef = useRef<HTMLElement | null>(null);
    const detectorReadyCallbackRef = useRef(onDetectorReady);

    // Update callback ref when prop changes
    useEffect(() => {
      detectorReadyCallbackRef.current = onDetectorReady;
    }, [onDetectorReady]);

    // Set up event listeners and provide external API
    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      // Detection complete event
      const handleDetectionComplete = (event: CustomEvent) => {
        if (onDetect) {
          onDetect(event.detail.detections);
        }
      };

      // Detection error event
      const handleDetectionError = (event: CustomEvent) => {
        if (onError) {
          onError(event.detail.error);
        }
      };

      // Progress event
      const handleProgress = (event: CustomEvent) => {
        if (onProgress) {
          onProgress(event.detail.loaded, event.detail.total);
        }
      };

      // Set up event listeners
      element.addEventListener('detection-complete', handleDetectionComplete as EventListener);
      element.addEventListener('detection-error', handleDetectionError as EventListener);
      element.addEventListener('detection-progress', handleProgress as EventListener);

      // Provide external detect function
      if (detectorReadyCallbackRef.current) {
        const detectFunction = async (data?: string | object | number | boolean) => {
          const textToDetect = data !== undefined ? String(data) : undefined;
          if (textToDetect !== undefined) {
            element.setAttribute('external-text', textToDetect);
          }
          // Trigger detection by dispatching a custom event
          element.dispatchEvent(new CustomEvent('trigger-detection'));
        };
        detectorReadyCallbackRef.current(detectFunction);
      }

      return () => {
        element.removeEventListener('detection-complete', handleDetectionComplete as EventListener);
        element.removeEventListener('detection-error', handleDetectionError as EventListener);
        element.removeEventListener('detection-progress', handleProgress as EventListener);
      };
    }, [onDetect, onError, onProgress]);

    // Update text when data prop changes
    useEffect(() => {
      if (data !== undefined && elementRef.current) {
        const textToDetect = String(data);
        elementRef.current.setAttribute('external-text', textToDetect);
      }
    }, [data]);

    // Combine refs
    const combinedRef = useCallback(
      (node: HTMLElement | null) => {
        if (elementRef.current !== node) {
          elementRef.current = node;
        }
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref && node) {
          ref.current = node;
        }
      },
      [ref]
    );

    // Determine the text to use
    const effectiveText = data !== undefined ? String(data) : text || externalText;

    // Convert array props to comma-separated strings
    const expectedLanguagesString = expectedLanguages?.join(',');

    return (
      <ai-language-detector
        ref={combinedRef}
        expected-languages={expectedLanguagesString}
        confidence-threshold={confidenceThreshold}
        auto-detect={autoDetect}
        show-controls={showControls}
        show-input={showInput}
        show-output={showOutput}
        show-confidence={showConfidence}
        controls-only={controlsOnly}
        max-length={maxLength}
        max-suggestions={maxSuggestions}
        placeholder={placeholder}
        text={effectiveText}
        external-text={effectiveText}
        className={className}
        style={style}
        {...props}
      />
    );
  }
);

AILanguageDetector.displayName = 'AILanguageDetector';

export default AILanguageDetector;
