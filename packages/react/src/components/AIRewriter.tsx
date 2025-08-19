import React, { useEffect, useRef, useCallback, forwardRef } from 'react';
import '@yallaling/web-ai-components/ai-rewriter';
import { BaseComponentProps } from '../types';

export type RewriterTone = 'as-is' | 'more-formal' | 'more-casual';
export type RewriterFormat = 'plain-text';
export type RewriterLength = 'shorter' | 'as-is' | 'longer';

export interface AIRewriterProps extends BaseComponentProps {
  /**
   * Text to rewrite (can be provided externally)
   */
  text?: string;
  /**
   * External data to rewrite (accepts any type - will be converted to string)
   */
  data?: string | object | number | boolean;
  /**
   * Tone for rewriting
   */
  tone?: RewriterTone;
  /**
   * Output format
   */
  format?: RewriterFormat;
  /**
   * Length adjustment
   */
  length?: RewriterLength;
  /**
   * Shared context for better rewriting
   */
  sharedContext?: string;
  /**
   * Expected input languages
   */
  expectedInputLanguages?: string[];
  /**
   * Expected context languages
   */
  expectedContextLanguages?: string[];
  /**
   * Output language
   */
  outputLanguage?: string;
  /**
   * Auto-rewrite when text changes
   */
  autoRewrite?: boolean;
  /**
   * Show input text area
   */
  showInput?: boolean;
  /**
   * Show rewriting controls
   */
  showControls?: boolean;
  /**
   * Show output area
   */
  showOutput?: boolean;
  /**
   * Show advanced options
   */
  showAdvancedOptions?: boolean;
  /**
   * Enable streaming mode
   */
  allowStreaming?: boolean;
  /**
   * Maximum text length for input
   */
  maxLength?: number;
  /**
   * Placeholder text for input
   */
  placeholder?: string;
  /**
   * Controls only mode (no input/output)
   */
  controlsOnly?: boolean;
  /**
   * External text input (for programmatic use)
   */
  externalText?: string;
  /**
   * Initial text to populate
   */
  initialText?: string;
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
  /**
   * Auto-adjust height
   */
  autoHeight?: boolean;
  /**
   * Maximum height
   */
  maxHeight?: number;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Callback when rewriting is complete
   */
  onContentRewritten?: (content: string) => void;
  /**
   * Callback for rewriting errors
   */
  onError?: (error: string) => void;
  /**
   * Callback for progress updates
   */
  onProgressUpdate?: (progress: number) => void;
  /**
   * Callback for streaming chunks
   */
  onStreamingChunk?: (chunk: string) => void;
  /**
   * Function to trigger rewriting externally
   */
  onRewriterReady?: (
    rewriteFunction: (data?: string | object | number | boolean) => Promise<void>
  ) => void;
}

// Declare the custom element type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ai-rewriter': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'tone'?: RewriterTone;
          'format'?: RewriterFormat;
          'length'?: RewriterLength;
          'shared-context'?: string;
          'expected-input-languages'?: string;
          'expected-context-languages'?: string;
          'output-language'?: string;
          'auto-rewrite'?: boolean;
          'show-input'?: boolean;
          'show-controls'?: boolean;
          'show-output'?: boolean;
          'show-advanced-options'?: boolean;
          'allow-streaming'?: boolean;
          'controls-only'?: boolean;
          'resizable'?: boolean;
          'allow-copy'?: boolean;
          'allow-download'?: boolean;
          'auto-height'?: boolean;
          'disabled'?: boolean;
          'placeholder'?: string;
          'max-length'?: number;
          'max-height'?: number;
          'download-filename'?: string;
          'text'?: string;
          'external-text'?: string;
          'initial-text'?: string;
        },
        HTMLElement
      >;
    }
  }
}

/**
 * React wrapper for the universal AI Rewriter Web Component
 * Maintains backward compatibility with existing React API
 */
export const AIRewriter = forwardRef<HTMLElement, AIRewriterProps>(
  (
    {
      text,
      data,
      tone = 'as-is',
      format = 'plain-text',
      length = 'as-is',
      sharedContext,
      expectedInputLanguages,
      expectedContextLanguages,
      outputLanguage,
      autoRewrite = false,
      showInput = true,
      showControls = true,
      showOutput = true,
      showAdvancedOptions = true,
      allowStreaming = false,
      controlsOnly = false,
      resizable = true,
      allowCopy = true,
      allowDownload = true,
      autoHeight = false,
      disabled = false,
      placeholder = 'Enter text to rewrite...',
      maxLength = 5000,
      maxHeight,
      downloadFileName = 'rewritten.md',
      externalText,
      initialText,
      onContentRewritten,
      onError,
      onProgressUpdate,
      onStreamingChunk,
      onRewriterReady,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const elementRef = useRef<HTMLElement | null>(null);
    const rewriterReadyCallbackRef = useRef(onRewriterReady);

    // Update callback ref when prop changes
    useEffect(() => {
      rewriterReadyCallbackRef.current = onRewriterReady;
    }, [onRewriterReady]);

    // Set up event listeners and provide external API
    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      // Rewriting complete event
      const handleRewritingComplete = (event: CustomEvent) => {
        if (onContentRewritten) {
          onContentRewritten(event.detail.content);
        }
      };

      // Rewriting error event
      const handleRewritingError = (event: CustomEvent) => {
        if (onError) {
          onError(event.detail.error);
        }
      };

      // Progress update event
      const handleProgressUpdate = (event: CustomEvent) => {
        if (onProgressUpdate) {
          onProgressUpdate(event.detail.progress);
        }
      };

      // Streaming chunk event
      const handleStreamingChunk = (event: CustomEvent) => {
        if (onStreamingChunk) {
          onStreamingChunk(event.detail.chunk);
        }
      };

      // Set up event listeners
      element.addEventListener('rewriting-complete', handleRewritingComplete as EventListener);
      element.addEventListener('rewriting-error', handleRewritingError as EventListener);
      element.addEventListener('progress-update', handleProgressUpdate as EventListener);
      element.addEventListener('streaming-chunk', handleStreamingChunk as EventListener);

      // Provide external rewrite function
      if (rewriterReadyCallbackRef.current) {
        const rewriteFunction = async (data?: string | object | number | boolean) => {
          const textToRewrite = data !== undefined ? String(data) : undefined;
          if (textToRewrite !== undefined) {
            element.setAttribute('external-text', textToRewrite);
          }
          // Trigger rewriting by dispatching a custom event
          element.dispatchEvent(new CustomEvent('trigger-rewriting'));
        };
        rewriterReadyCallbackRef.current(rewriteFunction);
      }

      return () => {
        element.removeEventListener('rewriting-complete', handleRewritingComplete as EventListener);
        element.removeEventListener('rewriting-error', handleRewritingError as EventListener);
        element.removeEventListener('progress-update', handleProgressUpdate as EventListener);
        element.removeEventListener('streaming-chunk', handleStreamingChunk as EventListener);
      };
    }, [onContentRewritten, onError, onProgressUpdate, onStreamingChunk]);

    // Update text when data prop changes
    useEffect(() => {
      if (data !== undefined && elementRef.current) {
        const textToRewrite = String(data);
        elementRef.current.setAttribute('external-text', textToRewrite);
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
    const effectiveText = data !== undefined ? String(data) : text || externalText || initialText;

    // Convert array props to comma-separated strings
    const inputLanguagesString = expectedInputLanguages?.join(',');
    const contextLanguagesString = expectedContextLanguages?.join(',');

    return (
      <ai-rewriter
        ref={combinedRef}
        tone={tone}
        format={format}
        length={length}
        shared-context={sharedContext}
        expected-input-languages={inputLanguagesString}
        expected-context-languages={contextLanguagesString}
        output-language={outputLanguage}
        auto-rewrite={autoRewrite}
        show-input={showInput}
        show-controls={showControls}
        show-output={showOutput}
        show-advanced-options={showAdvancedOptions}
        allow-streaming={allowStreaming}
        controls-only={controlsOnly}
        resizable={resizable}
        allow-copy={allowCopy}
        allow-download={allowDownload}
        auto-height={autoHeight}
        disabled={disabled}
        placeholder={placeholder}
        max-length={maxLength}
        max-height={maxHeight}
        download-filename={downloadFileName}
        text={effectiveText}
        external-text={effectiveText}
        initial-text={initialText}
        className={className}
        style={style}
        {...props}
      />
    );
  }
);

AIRewriter.displayName = 'AIRewriter';

export default AIRewriter;
