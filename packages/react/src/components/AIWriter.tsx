import React, { useEffect, useRef, useCallback, forwardRef } from 'react';
import '@yallaling/web-ai-components/ai-writer';
import { BaseComponentProps } from '../types';

export type WriterTone = 'formal' | 'casual';
export type WriterFormat = 'plain-text' | 'markdown';
export type WriterLength = 'short' | 'medium' | 'long';

export interface AIWriterProps extends BaseComponentProps {
  /**
   * Writing prompt
   */
  prompt?: string;
  /**
   * External data for writing prompt (accepts any type - will be converted to string)
   */
  data?: string | object | number | boolean;
  /**
   * Tone for generated content
   */
  tone?: WriterTone;
  /**
   * Output format
   */
  format?: WriterFormat;
  /**
   * Content length
   */
  length?: WriterLength;
  /**
   * Shared context for better generation
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
   * Auto-generate when prompt changes
   */
  autoGenerate?: boolean;
  /**
   * Show input text area
   */
  showInput?: boolean;
  /**
   * Show generation controls
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
   * Maximum prompt length
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
   * External prompt input (for programmatic use)
   */
  externalPrompt?: string;
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
   * Callback when content generation is complete
   */
  onContentGenerated?: (content: string) => void;
  /**
   * Callback for generation errors
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
   * Function to trigger generation externally
   */
  onWriterReady?: (
    generateFunction: (data?: string | object | number | boolean) => Promise<void>
  ) => void;
}

// Declare the custom element type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ai-writer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'tone'?: WriterTone;
          'format'?: WriterFormat;
          'length'?: WriterLength;
          'shared-context'?: string;
          'expected-input-languages'?: string;
          'expected-context-languages'?: string;
          'output-language'?: string;
          'auto-generate'?: boolean;
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
          'prompt'?: string;
          'external-prompt'?: string;
        },
        HTMLElement
      >;
    }
  }
}

/**
 * React wrapper for the universal AI Writer Web Component
 * Maintains backward compatibility with existing React API
 */
export const AIWriter = forwardRef<HTMLElement, AIWriterProps>(
  (
    {
      prompt,
      data,
      tone = 'casual',
      format = 'plain-text',
      length = 'medium',
      sharedContext,
      expectedInputLanguages,
      expectedContextLanguages,
      outputLanguage,
      autoGenerate = false,
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
      placeholder = 'Enter your writing prompt...',
      maxLength = 5000,
      maxHeight,
      downloadFileName = 'generated.md',
      externalPrompt,
      onContentGenerated,
      onError,
      onProgressUpdate,
      onStreamingChunk,
      onWriterReady,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const elementRef = useRef<HTMLElement | null>(null);
    const writerReadyCallbackRef = useRef(onWriterReady);

    // Update callback ref when prop changes
    useEffect(() => {
      writerReadyCallbackRef.current = onWriterReady;
    }, [onWriterReady]);

    // Set up event listeners and provide external API
    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      // Content generation complete event
      const handleGenerationComplete = (event: CustomEvent) => {
        if (onContentGenerated) {
          onContentGenerated(event.detail.content);
        }
      };

      // Generation error event
      const handleGenerationError = (event: CustomEvent) => {
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
      element.addEventListener('generation-complete', handleGenerationComplete as EventListener);
      element.addEventListener('generation-error', handleGenerationError as EventListener);
      element.addEventListener('progress-update', handleProgressUpdate as EventListener);
      element.addEventListener('streaming-chunk', handleStreamingChunk as EventListener);

      // Provide external generate function
      if (writerReadyCallbackRef.current) {
        const generateFunction = async (data?: string | object | number | boolean) => {
          const promptToGenerate = data !== undefined ? String(data) : undefined;
          if (promptToGenerate !== undefined) {
            element.setAttribute('external-prompt', promptToGenerate);
          }
          // Trigger generation by dispatching a custom event
          element.dispatchEvent(new CustomEvent('trigger-generation'));
        };
        writerReadyCallbackRef.current(generateFunction);
      }

      return () => {
        element.removeEventListener('generation-complete', handleGenerationComplete as EventListener);
        element.removeEventListener('generation-error', handleGenerationError as EventListener);
        element.removeEventListener('progress-update', handleProgressUpdate as EventListener);
        element.removeEventListener('streaming-chunk', handleStreamingChunk as EventListener);
      };
    }, [onContentGenerated, onError, onProgressUpdate, onStreamingChunk]);

    // Update prompt when data prop changes
    useEffect(() => {
      if (data !== undefined && elementRef.current) {
        const promptToGenerate = String(data);
        elementRef.current.setAttribute('external-prompt', promptToGenerate);
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

    // Determine the prompt to use
    const effectivePrompt = data !== undefined ? String(data) : prompt || externalPrompt;

    // Convert array props to comma-separated strings
    const inputLanguagesString = expectedInputLanguages?.join(',');
    const contextLanguagesString = expectedContextLanguages?.join(',');

    return (
      <ai-writer
        ref={combinedRef}
        tone={tone}
        format={format}
        length={length}
        shared-context={sharedContext}
        expected-input-languages={inputLanguagesString}
        expected-context-languages={contextLanguagesString}
        output-language={outputLanguage}
        auto-generate={autoGenerate}
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
        prompt={effectivePrompt}
        external-prompt={effectivePrompt}
        className={className}
        style={style}
        {...props}
      />
    );
  }
);

AIWriter.displayName = 'AIWriter';

export default AIWriter;
