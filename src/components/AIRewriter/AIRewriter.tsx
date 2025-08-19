/* eslint-disable @typescript-eslint/no-explicit-any */
// Chrome AI APIs are experimental and require 'any' types for global access
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  AIRewriterSession,
} from '../../types/web-ai';
import AIResultDisplay from '../AIResultDisplay/AIResultDisplay';
import './AIRewriter.css';

export interface AIRewriterProps {
  className?: string;
  'data-testid'?: string;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  onContentRewritten?: (content: string) => void;
  onError?: (error: string) => void;
  onProgressUpdate?: (progress: number) => void;
  onStreamingChunk?: (chunk: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoHeight?: boolean;
  maxHeight?: number;
  tone?: 'as-is' | 'more-formal' | 'more-casual';
  format?: 'plain-text';
  length?: 'shorter' | 'as-is' | 'longer';
  sharedContext?: string;
  expectedInputLanguages?: string[];
  expectedContextLanguages?: string[];
  outputLanguage?: string;
  showControls?: boolean;
  allowStreaming?: boolean;
  showAdvancedOptions?: boolean;
  initialText?: string;
  resizable?: boolean;
  allowCopy?: boolean;
  allowDownload?: boolean;
  downloadFileName?: string;
  controlsOnly?: boolean;
  externalText?: string;
}

export default function AIRewriter({
  className = '',
  'data-testid': testId,
  width,
  height,
  style,
  onContentRewritten,
  onError,
  onProgressUpdate,
  onStreamingChunk,
  placeholder = 'Enter text to rewrite...',
  disabled = false,
  autoHeight = true,
  maxHeight = 400,
  tone = 'as-is',
  format = 'plain-text',
  length = 'as-is',
  sharedContext = '',
  expectedInputLanguages = [],
  expectedContextLanguages = [],
  outputLanguage = 'en',
  showControls = true,
  allowStreaming = true,
  showAdvancedOptions: _showAdvancedOptions = false,
  initialText = '',
  controlsOnly = false,
  externalText = '',
  resizable = true,
  allowCopy = true,
  allowDownload = true,
  downloadFileName = 'ai-rewriter-content.md',
}: AIRewriterProps) {
  const [originalText, setOriginalText] = useState(initialText);
  const [rewrittenContent, setRewrittenContent] = useState('');
  const [context, setContext] = useState(sharedContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTone, setCurrentTone] = useState(tone);
  const [currentFormat, setCurrentFormat] = useState(format);
  const [currentLength, setCurrentLength] = useState(length);
  const [currentOutputLanguage, _setCurrentOutputLanguage] =
    useState(outputLanguage);
  const [isStreaming, setIsStreaming] = useState(false);

  const sessionRef = useRef<AIRewriterSession | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setCurrentTone(tone);
  }, [tone]);

  useEffect(() => {
    setCurrentFormat(format);
  }, [format]);

  useEffect(() => {
    setCurrentLength(length);
  }, [length]);

  const checkAvailability = useCallback(async () => {
    try {
      console.log('Starting AI Rewriter availability check...');
      console.log('Window object:', typeof window);
      console.log('Self object:', typeof self);
      console.log('AI object in self:', 'ai' in self);
      console.log('Rewriter in self:', 'Rewriter' in self);

      if (!('Rewriter' in self)) {
        console.log('Rewriter API not found in browser');
        setError(
          'AI Rewriter API is not available in this browser. Please ensure you are using Chrome Canary with AI features enabled.'
        );
        return;
      }

      console.log('Rewriter API found, creating options...');

      const options = {
        tone: currentTone,
        format: currentFormat,
        length: currentLength,
        // Chrome AI Rewriter currently only supports English ('en')
        expectedInputLanguages: expectedInputLanguages?.length
          ? expectedInputLanguages
          : ['en'],
        expectedContextLanguages: expectedContextLanguages?.length
          ? expectedContextLanguages
          : ['en'],
        outputLanguage: currentOutputLanguage,
      };

      console.log('Checking Rewriter availability with options:', options);

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Availability check timeout')), 10000)
      );

      const availabilityPromise = (self as any).Rewriter.availability(options);

      const availabilityResult = await Promise.race([
        availabilityPromise,
        timeoutPromise,
      ]);

      console.log('Rewriter availability result:', availabilityResult);

      // Handle both 'readily' and 'available' as positive responses
      setIsAvailable(
        availabilityResult === 'readily' || availabilityResult === 'available'
      );

      if (availabilityResult === 'no') {
        setError('AI Rewriter is not supported on this device');
      } else if (availabilityResult === 'after-download') {
        setError('AI Rewriter model needs to be downloaded first');
      } else if (
        availabilityResult === 'readily' ||
        availabilityResult === 'available'
      ) {
        setError(null); // Clear any previous errors
        console.log('AI Rewriter is ready to use');
      }
    } catch (err) {
      console.error('Error checking AI Rewriter availability:', err);
      setError(
        `Failed to check AI Rewriter availability: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
      onError?.('Failed to check AI Rewriter availability');
    }
  }, [
    currentTone,
    currentFormat,
    currentLength,
    currentOutputLanguage,
    expectedInputLanguages,
    expectedContextLanguages,
    onError,
  ]);

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  const handleRewrite = useCallback(async () => {
    const effectiveText = controlsOnly ? externalText : originalText;
    if (!effectiveText.trim() || !isAvailable || isLoading) return;

    setIsLoading(true);
    setError(null);
    setRewrittenContent('');
    setIsStreaming(allowStreaming);

    // Cancel any previous operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      if (!('Rewriter' in self)) {
        throw new Error('AI Rewriter API is not available');
      }

      console.log('Creating Rewriter session with options:', {
        tone: currentTone,
        format: currentFormat,
        length: currentLength,
        sharedContext: context,
        expectedInputLanguages,
        expectedContextLanguages,
        outputLanguage: currentOutputLanguage,
      });

      // Create rewriter session with all options from reference pattern
      const rewriter = await (self as any).Rewriter.create({
        tone: currentTone,
        format: currentFormat,
        length: currentLength,
        sharedContext: context,
        expectedInputLanguages: expectedInputLanguages?.length
          ? expectedInputLanguages
          : ['en'],
        expectedContextLanguages: expectedContextLanguages?.length
          ? expectedContextLanguages
          : ['en'],
        outputLanguage: currentOutputLanguage,
        monitor(m: any) {
          m.addEventListener('downloadprogress', (e: any) => {
            console.log(`Downloaded ${e.loaded * 100}%`);
            onProgressUpdate?.(e.loaded);
          });
        },
        signal: abortController.signal,
      });

      sessionRef.current = rewriter;
      console.log('Rewriter session created successfully');

      if (allowStreaming && rewriter.rewriteStreaming) {
        console.log('Starting streaming rewrite...');
        // Use streaming with context as in reference pattern
        const stream: ReadableStream = rewriter.rewriteStreaming(
          effectiveText,
          { context }
        );

        let output = '';

        // Use async iteration with proper TypeScript handling
        try {
          for await (const chunk of stream as any) {
            output += chunk;
            setRewrittenContent(output);
            onStreamingChunk?.(chunk);
            console.log(
              'Streaming chunk received, total length:',
              output.length
            );
          }
        } catch (streamError: any) {
          console.log(
            'Async iteration failed, trying reader approach:',
            streamError
          );
          // Fallback to reader approach
          const reader = (stream as ReadableStream).getReader();
          try {
            let reading = true;
            while (reading) {
              const { done, value } = await reader.read();
              if (done) {
                reading = false;
                break;
              }

              output += value;
              setRewrittenContent(output);
              onStreamingChunk?.(value);
              console.log(
                'Reader chunk received, total length:',
                output.length
              );
            }
          } finally {
            reader.releaseLock();
          }
        }

        console.log('Streaming complete, final output:', output);
        onContentRewritten?.(output);
      } else if (rewriter.rewrite) {
        console.log('Using non-streaming rewrite...');
        // Use standard rewrite with context
        const result = await rewriter.rewrite(effectiveText, { context });
        console.log('Rewrite result length:', result.length);
        setRewrittenContent(result);
        onContentRewritten?.(result);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('AI Rewriter operation was cancelled');
        return;
      }

      console.error('Error rewriting content:', err);
      const errorMessage = err.message || 'Failed to rewrite content';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      onProgressUpdate?.(100);
    }
  }, [
    originalText,
    externalText,
    controlsOnly,
    context,
    isAvailable,
    currentTone,
    currentFormat,
    currentLength,
    currentOutputLanguage,
    expectedInputLanguages,
    expectedContextLanguages,
    allowStreaming,
    onContentRewritten,
    onError,
    onProgressUpdate,
    onStreamingChunk,
    isLoading,
  ]);

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
    setIsStreaming(false);
  }, []);

  const handleClear = useCallback(() => {
    setOriginalText('');
    setRewrittenContent('');
    setContext('');
    setError(null);
  }, []);

  const _handleCopyContent = useCallback(() => {
    if (rewrittenContent) {
      navigator.clipboard.writeText(rewrittenContent).catch(err => {
        console.error('Failed to copy content:', err);
      });
    }
  }, [rewrittenContent]);

  const handleSwapContent = useCallback(() => {
    if (rewrittenContent) {
      setOriginalText(rewrittenContent);
      setRewrittenContent('');
    }
  }, [rewrittenContent]);

  if (!isAvailable && !error) {
    return (
      <div
        className={`ai-rewriter ai-rewriter--unavailable ${className}`}
        data-testid={testId}
      >
        <div className="ai-rewriter__status">
          <div className="ai-rewriter__spinner"></div>
          <span>Checking AI Rewriter availability...</span>
        </div>
      </div>
    );
  }

  // Container styling
  const containerStyle: React.CSSProperties = {
    width: width || '100%',
    height: height,
    resize: resizable ? 'both' : 'none',
    overflow: resizable ? 'auto' : 'visible',
    ...style,
  };

  return (
    <div
      className={`ai-rewriter ${className}`}
      data-testid={testId}
      style={containerStyle}
    >
      {showControls && (
        <div className="ai-rewriter__controls">
          <div className="ai-rewriter__control-group">
            <label htmlFor="ai-rewriter-tone" className="ai-rewriter__label">
              Tone:
            </label>
            <select
              id="ai-rewriter-tone"
              value={currentTone}
              onChange={e =>
                setCurrentTone(e.target.value as typeof currentTone)
              }
              className="ai-rewriter__select"
              disabled={disabled || isLoading}
            >
              <option value="as-is">As-is</option>
              <option value="more-formal">More Formal</option>
              <option value="more-casual">More Casual</option>
            </select>
          </div>

          <div className="ai-rewriter__control-group">
            <label htmlFor="ai-rewriter-format" className="ai-rewriter__label">
              Format:
            </label>
            <select
              id="ai-rewriter-format"
              value={currentFormat}
              onChange={e =>
                setCurrentFormat(e.target.value as typeof currentFormat)
              }
              className="ai-rewriter__select"
              disabled={disabled || isLoading}
            >
              <option value="plain-text">Plain Text</option>
            </select>
          </div>

          <div className="ai-rewriter__control-group">
            <label htmlFor="ai-rewriter-length" className="ai-rewriter__label">
              Length:
            </label>
            <select
              id="ai-rewriter-length"
              value={currentLength}
              onChange={e =>
                setCurrentLength(e.target.value as typeof currentLength)
              }
              className="ai-rewriter__select"
              disabled={disabled || isLoading}
            >
              <option value="shorter">Shorter</option>
              <option value="as-is">Same Length</option>
              <option value="longer">Longer</option>
            </select>
          </div>
        </div>
      )}

      <div className="ai-rewriter__content">
        {!controlsOnly && (
          <div className="ai-rewriter__input-section">
            <label
              htmlFor="ai-rewriter-original"
              className="ai-rewriter__section-title"
            >
              Original Text
            </label>
            <textarea
              id="ai-rewriter-original"
              value={originalText}
              onChange={e => setOriginalText(e.target.value)}
              placeholder={placeholder}
              className="ai-rewriter__textarea"
              disabled={disabled || isLoading}
              style={
                autoHeight
                  ? { resize: 'vertical', maxHeight: `${maxHeight}px` }
                  : undefined
              }
              rows={autoHeight ? undefined : 4}
            />

            <label
              htmlFor="ai-rewriter-context"
              className="ai-rewriter__section-title"
            >
              Context (Optional)
            </label>
            <textarea
              id="ai-rewriter-context"
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="Provide additional context for better rewriting..."
              className="ai-rewriter__textarea ai-rewriter__textarea--context"
              disabled={disabled || isLoading}
              rows={2}
            />
          </div>
        )}

        <div className="ai-rewriter__actions">
          <button
            onClick={handleRewrite}
            disabled={
              disabled ||
              (!controlsOnly && !originalText.trim()) ||
              (controlsOnly && !externalText.trim()) ||
              isLoading ||
              !isAvailable
            }
            className="ai-rewriter__button ai-rewriter__button--primary"
          >
            {isLoading
              ? isStreaming
                ? 'Rewriting...'
                : 'Rewriting...'
              : 'Rewrite Text'}
          </button>

          {isLoading && (
            <button
              onClick={handleCancel}
              className="ai-rewriter__button ai-rewriter__button--secondary"
            >
              Cancel
            </button>
          )}

          <button
            onClick={handleClear}
            disabled={disabled || isLoading}
            className="ai-rewriter__button ai-rewriter__button--secondary"
          >
            Clear All
          </button>

          {rewrittenContent && (
            <button
              onClick={handleSwapContent}
              disabled={disabled || isLoading}
              className="ai-rewriter__button ai-rewriter__button--secondary"
              title="Use rewritten text as input for further rewriting"
            >
              🔄 Use as Input
            </button>
          )}
        </div>

        {error && (
          <div className="ai-rewriter__error" role="alert">
            ⚠️ {error}
          </div>
        )}

        {rewrittenContent && (
          <AIResultDisplay
            content={rewrittenContent}
            allowCopy={allowCopy}
            allowDownload={allowDownload}
            downloadFileName={downloadFileName}
            className="ai-rewriter__result-display"
          />
        )}

        {isStreaming && (
          <div className="ai-rewriter__streaming-indicator">
            <div className="ai-rewriter__typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>AI is rewriting...</span>
          </div>
        )}
      </div>
    </div>
  );
}
