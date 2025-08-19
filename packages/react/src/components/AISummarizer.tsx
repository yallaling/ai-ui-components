import React, { useEffect, useRef, useCallback, forwardRef } from 'react';
import '@yallaling/web-ai-components/ai-summarizer';
import { BaseComponentProps } from '../types';

export type SummaryType = 'key-points' | 'tldr' | 'teaser' | 'headline';
export type SummaryFormat = 'markdown' | 'plain-text';
export type SummaryLength = 'short' | 'medium' | 'long';

export interface AISummarizerProps extends BaseComponentProps {
  /**
   * Text to summarize (can be provided externally)
   */
  text?: string;
  /**
   * External data to summarize (accepts any type - will be converted to string)
   */
  data?: string | object | number | boolean;
  /**
   * Type of summary to generate
   */
  type?: SummaryType;
  /**
   * Output format
   */
  format?: SummaryFormat;
  /**
   * Summary length
   */
  length?: SummaryLength;
  /**
   * Additional context for better summarization
   */
  context?: string;
  /**
   * Auto-summarize when text/data changes
   */
  autoSummarize?: boolean;
  /**
   * Show input text area (optional UI)
   */
  showInput?: boolean;
  /**
   * Show summarization controls
   */
  showControls?: boolean;
  /**
   * Enable streaming mode
   */
  streaming?: boolean;
  /**
   * Maximum text length for input
   */
  maxLength?: number;
  /**
   * Placeholder text for input
   */
  placeholder?: string;
  /**
   * Show output area
   */
  showOutput?: boolean;
  /**
   * Show advanced options
   */
  showOptions?: boolean;
  /**
   * Controls only mode (no input/output)
   */
  controlsOnly?: boolean;
  /**
   * External text input (for programmatic use)
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
  /**
   * Callback when summarization is complete
   */
  onSummarize?: (summary: string) => void;
  /**
   * Callback for summarization errors
   */
  onError?: (error: string) => void;
  /**
   * Callback for download progress
   */
  onProgress?: (loaded: number, total: number) => void;
  /**
   * Callback for streaming chunks
   */
  onStreamingChunk?: (chunk: string) => void;
  /**
   * Function to trigger summarization externally
   */
  onSummarizerReady?: (
    summarizeFunction: (data?: string | object | number | boolean) => Promise<void>
  ) => void;
}

// Declare the custom element type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ai-summarizer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'type'?: SummaryType;
          'format'?: SummaryFormat;
          'length'?: SummaryLength;
          'context'?: string;
          'auto-summarize'?: boolean;
          'show-input'?: boolean;
          'show-controls'?: boolean;
          'show-output'?: boolean;
          'show-options'?: boolean;
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
 * React wrapper for the universal AI Summarizer Web Component
 * Maintains backward compatibility with existing React API
 */
export const AISummarizer = forwardRef<HTMLElement, AISummarizerProps>(
  (
    {
      text,
      data,
      type = 'key-points',
      format = 'markdown',
      length = 'medium',
      context,
      autoSummarize = false,
      showInput = true,
      showControls = true,
      showOutput = true,
      showOptions = true,
      controlsOnly = false,
      streaming = false,
      resizable = true,
      allowCopy = true,
      allowDownload = true,
      placeholder = 'Enter text to summarize...',
      maxLength = 10000,
      downloadFileName = 'summary.md',
      externalText,
      onSummarize,
      onError,
      onProgress,
      onStreamingChunk,
      onSummarizerReady,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const elementRef = useRef<HTMLElement | null>(null);
    const summarizerReadyCallbackRef = useRef(onSummarizerReady);

    // Update callback ref when prop changes
    useEffect(() => {
      summarizerReadyCallbackRef.current = onSummarizerReady;
    }, [onSummarizerReady]);

    // Set up event listeners and provide external API
    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      // Summarization complete event
      const handleSummarizationComplete = (event: CustomEvent) => {
        if (onSummarize) {
          onSummarize(event.detail.summary);
        }
      };

      // Summarization error event
      const handleSummarizationError = (event: CustomEvent) => {
        if (onError) {
          onError(event.detail.error);
        }
      };

      // Summarization progress event
      const handleSummarizationProgress = (event: CustomEvent) => {
        if (onProgress) {
          onProgress(event.detail.loaded, event.detail.total);
        }
      };

      // Streaming chunk event
      const handleStreamingChunk = (event: CustomEvent) => {
        if (onStreamingChunk) {
          onStreamingChunk(event.detail.chunk);
        }
      };

      // Set up event listeners
      element.addEventListener('summarization-complete', handleSummarizationComplete as EventListener);
      element.addEventListener('summarization-error', handleSummarizationError as EventListener);
      element.addEventListener('summarization-progress', handleSummarizationProgress as EventListener);
      element.addEventListener('streaming-chunk', handleStreamingChunk as EventListener);

      // Provide external summarize function
      if (summarizerReadyCallbackRef.current) {
        const summarizeFunction = async (data?: string | object | number | boolean) => {
          const textToSummarize = data !== undefined ? String(data) : undefined;
          if (textToSummarize !== undefined) {
            element.setAttribute('external-text', textToSummarize);
          }
          // Trigger summarization by dispatching a custom event
          element.dispatchEvent(new CustomEvent('trigger-summarization'));
        };
        summarizerReadyCallbackRef.current(summarizeFunction);
      }

      return () => {
        element.removeEventListener('summarization-complete', handleSummarizationComplete as EventListener);
        element.removeEventListener('summarization-error', handleSummarizationError as EventListener);
        element.removeEventListener('summarization-progress', handleSummarizationProgress as EventListener);
        element.removeEventListener('streaming-chunk', handleStreamingChunk as EventListener);
      };
    }, [onSummarize, onError, onProgress, onStreamingChunk]);

    // Update text when data prop changes
    useEffect(() => {
      if (data !== undefined && elementRef.current) {
        const textToSummarize = String(data);
        elementRef.current.setAttribute('external-text', textToSummarize);
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
      <ai-summarizer
        ref={combinedRef}
        type={type}
        format={format}
        length={length}
        context={context}
        auto-summarize={autoSummarize}
        show-input={showInput}
        show-controls={showControls}
        show-output={showOutput}
        show-options={showOptions}
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

AISummarizer.displayName = 'AISummarizer';

export default AISummarizer;
