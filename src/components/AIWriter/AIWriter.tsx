/* eslint-disable @typescript-eslint/no-explicit-any */
// Chrome AI APIs are experimental and require 'any' types for global access
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  AIWriterSession,
} from '../../types/web-ai';
import AIResultDisplay from '../AIResultDisplay/AIResultDisplay';
import './AIWriter.css';

export interface AIWriterProps {
  className?: string;
  'data-testid'?: string;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  onContentGenerated?: (content: string) => void;
  onError?: (error: string) => void;
  onProgressUpdate?: (progress: number) => void;
  onStreamingChunk?: (chunk: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoHeight?: boolean;
  maxHeight?: number;
  tone?: 'formal' | 'casual';
  format?: 'plain-text' | 'markdown';
  length?: 'short' | 'medium' | 'long';
  sharedContext?: string;
  expectedInputLanguages?: string[];
  expectedContextLanguages?: string[];
  outputLanguage?: string;
  showControls?: boolean;
  allowStreaming?: boolean;
  showAdvancedOptions?: boolean;
  controlsOnly?: boolean;
  externalPrompt?: string;
  resizable?: boolean;
  allowCopy?: boolean;
  allowDownload?: boolean;
  downloadFileName?: string;
}

export default function AIWriter({
  className = '',
  'data-testid': testId,
  width,
  height,
  style,
  onContentGenerated,
  onError,
  onProgressUpdate,
  onStreamingChunk,
  placeholder = 'Enter your writing prompt...',
  disabled = false,
  autoHeight = true,
  maxHeight = 400,
  tone = 'casual',
  format = 'plain-text',
  length = 'medium',
  sharedContext = '',
  expectedInputLanguages = [],
  expectedContextLanguages = [],
  outputLanguage = 'en',
  showControls = true,
  allowStreaming = true,
  showAdvancedOptions = false,
  controlsOnly = false,
  externalPrompt = '',
  resizable = true,
  allowCopy = true,
  allowDownload = true,
  downloadFileName = 'ai-writer-content.md',
}: AIWriterProps) {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [context, setContext] = useState(sharedContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTone, setCurrentTone] = useState(tone);
  const [currentFormat, setCurrentFormat] = useState(format);
  const [currentLength, setCurrentLength] = useState(length);
  const [currentOutputLanguage, setCurrentOutputLanguage] =
    useState(outputLanguage);
  const [isStreaming, setIsStreaming] = useState(false);

  const sessionRef = useRef<AIWriterSession | null>(null);
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
      // Use the exact feature detection from Chrome documentation
      const writerSupported = 'Writer' in self;

      if (!writerSupported) {
        setError('AI Writer API is not available in this browser');
        return;
      }

      const availabilityResult = await (self as any).Writer.availability({
        tone: currentTone,
        format: currentFormat,
        length: currentLength,
        expectedInputLanguages,
        expectedContextLanguages,
        outputLanguage: currentOutputLanguage,
      });

      console.log('Writer availability result:', availabilityResult);

      // Handle both 'readily' and 'available' as positive responses
      setIsAvailable(
        availabilityResult === 'readily' || availabilityResult === 'available'
      );

      if (availabilityResult === 'no') {
        setError('AI Writer is not supported on this device');
      } else if (availabilityResult === 'after-download') {
        setError('AI Writer model needs to be downloaded first');
      } else if (
        availabilityResult === 'readily' ||
        availabilityResult === 'available'
      ) {
        setError(null); // Clear any previous errors
        console.log('AI Writer is ready to use');
      }
    } catch (err) {
      console.error('Error checking AI Writer availability:', err);
      setError('Failed to check AI Writer availability');
      onError?.('Failed to check AI Writer availability');
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

  const handleGenerate = useCallback(async () => {
    const effectivePrompt = controlsOnly ? externalPrompt : prompt;
    if (!effectivePrompt.trim() || !isAvailable || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedContent('');
    setIsStreaming(allowStreaming);

    // Cancel any previous operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      // Create session using the reference pattern
      if (!('Writer' in self)) {
        throw new Error('AI Writer API is not available');
      }

      console.log('Creating Writer session with options:', {
        tone: currentTone,
        format: currentFormat,
        length: currentLength,
        sharedContext: context,
        expectedInputLanguages,
        expectedContextLanguages,
        outputLanguage: currentOutputLanguage,
      });

      // Create writer session with all options from reference
      const writer = await (self as any).Writer.create({
        tone: currentTone,
        format: currentFormat,
        length: currentLength,
        sharedContext: context,
        expectedInputLanguages,
        expectedContextLanguages,
        outputLanguage: currentOutputLanguage,
        monitor(m: any) {
          m.addEventListener('downloadprogress', (e: any) => {
            console.log(`Downloaded ${e.loaded * 100}%`);
            onProgressUpdate?.(e.loaded);
          });
        },
        signal: abortController.signal,
      });

      sessionRef.current = writer;
      console.log('Writer session created successfully');

      if (allowStreaming && writer.writeStreaming) {
        console.log('Starting streaming generation...');
        // Use streaming with context as in reference
        const stream: ReadableStream = writer.writeStreaming(effectivePrompt, {
          context,
        });

        let output = '';

        // Use async iteration with proper TypeScript handling
        try {
          for await (const chunk of stream as any) {
            output += chunk;
            setGeneratedContent(output);
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
              setGeneratedContent(output);
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
        onContentGenerated?.(output);
      } else if (writer.write) {
        console.log('Using non-streaming generation...');
        // Use standard generation with context
        const result = await writer.write(effectivePrompt, { context });
        console.log('Generation result length:', result.length);
        setGeneratedContent(result);
        onContentGenerated?.(result);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('AI Writer generation was cancelled');
        return;
      }

      console.error('Error generating content:', err);
      const errorMessage = err.message || 'Failed to generate content';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      onProgressUpdate?.(100);
    }
  }, [
    prompt,
    externalPrompt,
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
    onContentGenerated,
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
    setPrompt('');
    setGeneratedContent('');
    setError(null);
  }, []);

  // Create container style with width/height support
  const containerStyle: React.CSSProperties = {
    width: width || '100%',
    height: height,
    resize: resizable ? 'both' : 'none',
    overflow: resizable ? 'auto' : 'visible',
    minWidth: '300px',
    minHeight: '200px',
    ...style,
  };

  if (!isAvailable && !error) {
    return (
      <div
        className={`ai-writer ai-writer--unavailable ${className}`}
        data-testid={testId}
        style={containerStyle}
      >
        <div className="ai-writer__status">
          <div className="ai-writer__spinner"></div>
          <span>Checking AI Writer availability...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`ai-writer ${className}`}
      data-testid={testId}
      style={containerStyle}
    >
      {showControls && (
        <div className="ai-writer__controls">
          <div className="ai-writer__control-group">
            <label htmlFor="ai-writer-tone" className="ai-writer__label">
              Tone:
            </label>
            <select
              id="ai-writer-tone"
              value={currentTone}
              onChange={e =>
                setCurrentTone(e.target.value as typeof currentTone)
              }
              className="ai-writer__select"
              disabled={disabled || isLoading}
            >
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          <div className="ai-writer__control-group">
            <label htmlFor="ai-writer-format" className="ai-writer__label">
              Format:
            </label>
            <select
              id="ai-writer-format"
              value={currentFormat}
              onChange={e =>
                setCurrentFormat(e.target.value as typeof currentFormat)
              }
              className="ai-writer__select"
              disabled={disabled || isLoading}
            >
              <option value="plain-text">Plain Text</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>

          <div className="ai-writer__control-group">
            <label htmlFor="ai-writer-length" className="ai-writer__label">
              Length:
            </label>
            <select
              id="ai-writer-length"
              value={currentLength}
              onChange={e =>
                setCurrentLength(e.target.value as typeof currentLength)
              }
              className="ai-writer__select"
              disabled={disabled || isLoading}
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>

          {showAdvancedOptions && (
            <>
              <div className="ai-writer__control-group">
                <label
                  htmlFor="ai-writer-language"
                  className="ai-writer__label"
                >
                  Output Language:
                </label>
                <select
                  id="ai-writer-language"
                  value={currentOutputLanguage}
                  onChange={e => setCurrentOutputLanguage(e.target.value)}
                  className="ai-writer__select"
                  disabled={disabled || isLoading}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
            </>
          )}
        </div>
      )}

      {!controlsOnly && (
        <div className="ai-writer__input-section">
          {showAdvancedOptions && (
            <textarea
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="Shared context (optional)..."
              className="ai-writer__context"
              disabled={disabled || isLoading}
              rows={2}
            />
          )}

          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={placeholder}
            className="ai-writer__prompt"
            disabled={disabled || isLoading}
            style={
              autoHeight
                ? { resize: 'vertical', maxHeight: `${maxHeight}px` }
                : undefined
            }
            rows={autoHeight ? undefined : 3}
          />
        </div>
      )}

      <div className="ai-writer__actions-section">
        <div className="ai-writer__prompt-actions">
          <button
            onClick={handleGenerate}
            disabled={
              disabled ||
              (!controlsOnly && !prompt.trim()) ||
              (controlsOnly && !externalPrompt.trim()) ||
              isLoading ||
              !isAvailable
            }
            className="ai-writer__button ai-writer__button--primary"
          >
            {isLoading
              ? isStreaming
                ? 'Generating...'
                : 'Generating...'
              : 'Generate Content'}
          </button>

          {isLoading && (
            <button
              onClick={handleCancel}
              className="ai-writer__button ai-writer__button--secondary"
            >
              Cancel
            </button>
          )}

          <button
            onClick={handleClear}
            disabled={disabled || isLoading}
            className="ai-writer__button ai-writer__button--secondary"
          >
            Clear
          </button>
        </div>
      </div>

      {error && (
        <div className="ai-writer__error" role="alert">
          ⚠️ {error}
        </div>
      )}

      {generatedContent && (
        <AIResultDisplay
          content={generatedContent}
          allowCopy={allowCopy}
          allowDownload={allowDownload}
          downloadFileName={downloadFileName}
          className="ai-writer__result-display"
        />
      )}

      {isStreaming && (
        <div className="ai-writer__streaming-indicator">
          <div className="ai-writer__typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>AI is writing...</span>
        </div>
      )}
    </div>
  );
}
