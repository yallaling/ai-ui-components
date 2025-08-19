import React, { useEffect, useRef, useCallback, forwardRef } from 'react';
import '@yallaling/web-ai-components/ai-translator';
import { BaseComponentProps } from '../types';

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
  data?: string | object | number | boolean;
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
    translateFunction: (data?: string | object | number | boolean) => Promise<void>
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

// Declare the custom element type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ai-translator-element': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'source-language'?: string;
          'target-language'?: string;
          'auto-translate'?: boolean;
          'show-input'?: boolean;
          'show-output'?: boolean;
          'show-controls'?: boolean;
          'controls-only'?: boolean;
          'streaming'?: boolean;
          'resizable'?: boolean;
          'allow-copy'?: boolean;
          'allow-download'?: boolean;
          'placeholder'?: string;
          'max-length'?: number;
          'download-filename'?: string;
          'text'?: string;
          'external-text'?: string;
        },
        HTMLElement
      >;
    }
  }
}

/**
 * React wrapper for the universal AI Translator Web Component
 * Maintains backward compatibility with existing React API
 */
export const AITranslator = forwardRef<HTMLElement, AITranslatorProps>(
  (
    {
      sourceLanguage,
      targetLanguage,
      text,
      data,
      onTranslate,
      onError,
      onProgress,
      autoTranslate = false,
      showInput = true,
      showControls = true,
      showOutput = true,
      placeholder = 'Enter text to translate...',
      maxLength = 5000,
      streaming = false,
      onTranslatorReady,
      controlsOnly = false,
      externalText,
      className = '',
      style,
      resizable = true,
      allowCopy = true,
      allowDownload = true,
      downloadFileName = 'translation.md',
      ...props
    },
    ref
  ) => {
    const elementRef = useRef<HTMLElement | null>(null);
    const translatorReadyCallbackRef = useRef(onTranslatorReady);

    // Update callback ref when prop changes
    useEffect(() => {
      translatorReadyCallbackRef.current = onTranslatorReady;
    }, [onTranslatorReady]);

    // Set up event listeners and provide external API
    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      // Translation complete event
      const handleTranslationComplete = (event: CustomEvent) => {
        if (onTranslate) {
          onTranslate(event.detail.translatedText);
        }
      };

      // Translation error event
      const handleTranslationError = (event: CustomEvent) => {
        if (onError) {
          onError(event.detail.error);
        }
      };

      // Translation progress event
      const handleTranslationProgress = (event: CustomEvent) => {
        if (onProgress) {
          onProgress(event.detail.loaded, event.detail.total);
        }
      };

      // Set up event listeners
      element.addEventListener('translation-complete', handleTranslationComplete as EventListener);
      element.addEventListener('translation-error', handleTranslationError as EventListener);
      element.addEventListener('translation-progress', handleTranslationProgress as EventListener);

      // Provide external translate function
      if (translatorReadyCallbackRef.current) {
        const translateFunction = async (data?: string | object | number | boolean) => {
          const textToTranslate = data !== undefined ? String(data) : undefined;
          if (textToTranslate !== undefined) {
            element.setAttribute('external-text', textToTranslate);
          }
          // Trigger translation by dispatching a custom event
          element.dispatchEvent(new CustomEvent('trigger-translation'));
        };
        translatorReadyCallbackRef.current(translateFunction);
      }

      return () => {
        element.removeEventListener('translation-complete', handleTranslationComplete as EventListener);
        element.removeEventListener('translation-error', handleTranslationError as EventListener);
        element.removeEventListener('translation-progress', handleTranslationProgress as EventListener);
      };
    }, [onTranslate, onError, onProgress]);

    // Update text when data prop changes
    useEffect(() => {
      if (data !== undefined && elementRef.current) {
        const textToTranslate = String(data);
        elementRef.current.setAttribute('external-text', textToTranslate);
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

    return (
      <ai-translator-element
        ref={combinedRef}
        source-language={sourceLanguage}
        target-language={targetLanguage}
        auto-translate={autoTranslate}
        show-input={showInput}
        show-output={showOutput}
        show-controls={showControls}
        controls-only={controlsOnly}
        streaming={streaming}
        resizable={resizable}
        allow-copy={allowCopy}
        allow-download={allowDownload}
        placeholder={placeholder}
        max-length={maxLength}
        download-filename={downloadFileName}
        text={effectiveText}
        external-text={effectiveText}
        className={className}
        style={style}
        {...props}
      />
    );
  }
);

AITranslator.displayName = 'AITranslator';

export default AITranslator;
