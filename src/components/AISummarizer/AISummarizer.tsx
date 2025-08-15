/* eslint-disable @typescript-eslint/no-explicit-any */
// Chrome AI APIs are experimental and require 'any' types for global access
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AISummarizerSession,
} from '../../types/chrome-ai';
import AIResultDisplay from '../AIResultDisplay/AIResultDisplay';
import {
  AISummarizerProps,
  SummaryType,
  SummaryFormat,
  SummaryLength,
} from './AISummarizer.types';
import './AISummarizer.css';

/**
 * AI Summarizer component using Chrome's built-in summarization API
 * Supports external data input and optional UI components
 */
const AISummarizer: React.FC<AISummarizerProps> = ({
  text,
  data,
  type = 'tldr',
  format = 'plain-text',
  length = 'medium',
  context = '',
  autoSummarize = false,
  showInput = true,
  showControls = true,
  showOutput = true,
  streaming = false,
  maxLength = 10000,
  placeholder = 'Enter text to summarize...',
  onSummarize,
  onError,
  onProgress,
  onStreamingChunk,
  showOptions = true,
  onSummarizerReady,
  className = '',
  controlsOnly = false,
  externalText = '',
  width,
  height,
  style,
  resizable = true,
  allowCopy = true,
  allowDownload = true,
  downloadFileName = 'summary.md',
  ...props
}) => {
  const [inputText, setInputText] = useState(text || '');
  const [inputContext, setInputContext] = useState(context || '');
  const [summary, setSummary] = useState('');
  const [currentType, setCurrentType] = useState<SummaryType>(type);
  const [currentFormat, setCurrentFormat] = useState<SummaryFormat>(format);
  const [currentLength, setCurrentLength] = useState<SummaryLength>(length);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({
    loaded: 0,
    total: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const sessionRef = useRef<AISummarizerSession | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamReaderRef = useRef<ReadableStreamDefaultReader<string> | null>(
    null
  );

  // Helper function to convert any data type to text
  const convertDataToText = useCallback((data: any): string => {
    if (typeof data === 'string') return data;
    if (typeof data === 'number' || typeof data === 'boolean')
      return String(data);
    if (data === null || data === undefined) return '';

    // Handle HTML elements
    if (data instanceof HTMLElement) {
      return data.innerText || data.textContent || '';
    }

    // Handle arrays
    if (Array.isArray(data)) {
      return data.map(item => convertDataToText(item)).join('\n');
    }

    // Handle objects
    if (typeof data === 'object') {
      try {
        // Try to extract meaningful text from object
        if (data.text) return String(data.text);
        if (data.content) return String(data.content);
        if (data.value) return String(data.value);
        if (data.message) return String(data.message);

        // Convert object to JSON as fallback
        return JSON.stringify(data, null, 2);
      } catch {
        return '[Object]';
      }
    }

    return String(data);
  }, []);

  // Get the current text to summarize
  const getCurrentText = useCallback(() => {
    // If in controls-only mode, use external text first
    if (controlsOnly && externalText !== undefined) {
      return externalText;
    }

    // If input field is shown, always use inputText (user can modify it)
    if (showInput) {
      return inputText;
    }

    // For headless mode (no input field), use external data sources
    if (data !== undefined) {
      return convertDataToText(data);
    }
    if (text !== undefined) {
      return text;
    }

    // Fallback to inputText
    return inputText;
  }, [
    controlsOnly,
    externalText,
    showInput,
    inputText,
    data,
    text,
    convertDataToText,
  ]);

  // Check API availability
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const summarizerSupported = 'Summarizer' in self;

        if (!summarizerSupported) {
          setError('AI Summarizer API is not available in this browser');
          return;
        }

        const capabilities = await (self as any).Summarizer.availability();
        setIsSupported(
          capabilities === 'available' || capabilities === 'readily'
        );

        if (capabilities === 'unavailable') {
          setError('AI Summarizer is not supported on this device');
        } else if (
          capabilities === 'downloadable' ||
          capabilities === 'downloading'
        ) {
          setError('AI Summarizer model needs to be downloaded first');
        }
      } catch (err) {
        console.error('Error checking AI Summarizer availability:', err);
        setError('Failed to check AI Summarizer availability');
        onError?.('Failed to check AI Summarizer availability');
      }
    };

    checkAvailability();
  }, [onError]);

  // Create summarization session
  const createSession = useCallback(async () => {
    if (!('Summarizer' in self)) {
      throw new Error('AI Summarizer API not available');
    }

    if (sessionRef.current) {
      sessionRef.current.destroy();
    }

    abortControllerRef.current = new AbortController();

    try {
      const session = await (self as any).Summarizer.create({
        type: currentType,
        format: currentFormat,
        length: currentLength,
        signal: abortControllerRef.current.signal,
        monitor: (progress: any) => {
          setDownloadProgress(progress);
          setIsDownloading(progress.loaded < progress.total);
          onProgress?.(progress.loaded, progress.total);
        },
      });

      sessionRef.current = session;
      return session;
    } catch (err: any) {
      if (
        err.message?.includes('user gesture') ||
        err.message?.includes('requires a user gesture')
      ) {
        throw new Error(
          'Please click the summarize button to download the AI model (user interaction required)'
        );
      }
      throw err;
    }
  }, [currentType, currentFormat, currentLength, onProgress]);

  // Perform summarization (can be called externally or internally)
  const summarizeText = useCallback(
    async (externalData?: any) => {
      const textToSummarize = externalData
        ? convertDataToText(externalData)
        : getCurrentText();

      if (!textToSummarize.trim()) {
        setSummary('');
        return;
      }

      const fullText = inputContext
        ? `${inputContext}\n\n${textToSummarize}`
        : textToSummarize;

      setIsLoading(true);
      setError(null);
      setSummary('');

      try {
        // Always create a new session to ensure current options are used
        const session = await createSession();

        if (streaming) {
          setIsStreaming(true);
          const stream = session.summarizeStreaming(fullText);
          const reader = stream.getReader();
          streamReaderRef.current = reader;

          let accumulatedSummary = '';

          let reading = true;
          while (reading) {
            const { done, value } = await reader.read();

            if (done) {
              reading = false;
              break;
            }

            accumulatedSummary += value;
            setSummary(accumulatedSummary);
            onStreamingChunk?.(value);
          }

          onSummarize?.(accumulatedSummary);
          setIsStreaming(false);
        } else {
          const result = await session.summarize(fullText);
          setSummary(result);
          onSummarize?.(result);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Summarization failed';
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsLoading(false);
        setIsDownloading(false);
        setIsStreaming(false);
      }
    },
    [
      createSession,
      getCurrentText,
      convertDataToText,
      inputContext,
      streaming,
      onSummarize,
      onStreamingChunk,
      onError,
    ]
  );

  // Auto-summarize when text or options change
  useEffect(() => {
    if (
      autoSummarize &&
      (data !== undefined || text !== undefined || inputText)
    ) {
      summarizeText();
    }
  }, [
    data,
    text,
    inputText,
    currentType,
    currentFormat,
    currentLength,
    autoSummarize,
    summarizeText,
  ]);

  // Clear session when options change to force recreation with new options
  useEffect(() => {
    if (sessionRef.current) {
      sessionRef.current.destroy();
      sessionRef.current = null;
    }
  }, [currentType, currentFormat, currentLength]);

  // Update input text when prop changes
  useEffect(() => {
    setInputText(text || '');
  }, [text]);

  // Update context when prop changes
  useEffect(() => {
    setInputContext(context || '');
  }, [context]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sessionRef.current?.destroy();
      abortControllerRef.current?.abort();
      streamReaderRef.current?.cancel();
    };
  }, []);

  // Expose summarizeText function to parent component
  useEffect(() => {
    if (onSummarizerReady) {
      onSummarizerReady(summarizeText);
    }
  }, [onSummarizerReady, summarizeText]);

  const handleSummarize = () => {
    summarizeText();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setInputText(value);
    }
  };

  const handleContextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputContext(e.target.value);
  };

  const handleClear = () => {
    setInputText('');
    setInputContext('');
    setSummary('');
    setError(null);
  };

  if (isSupported === false) {
    return (
      <div
        className={`ai-summarizer ai-summarizer--unsupported ${className}`}
        {...props}
      >
        <div className="ai-summarizer__error">
          <div className="ai-summarizer__error-icon">⚠️</div>
          <div className="ai-summarizer__error-message">
            {error || 'AI Summarizer is not supported in this browser'}
          </div>
          <div className="ai-summarizer__error-suggestion">
            Please use Chrome with AI features enabled
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div
      className={`ai-summarizer ${className}`}
      style={containerStyle}
      {...props}
    >
      {showOptions && (
        <div className="ai-summarizer__options">
          <div className="ai-summarizer__option-group">
            <label className="ai-summarizer__option-label">Type:</label>
            <select
              value={currentType}
              onChange={e => setCurrentType(e.target.value as SummaryType)}
              disabled={isLoading}
              className="ai-summarizer__select"
            >
              <option value="tldr">TL;DR</option>
              <option value="key-points">Key Points</option>
              <option value="teaser">Teaser</option>
              <option value="headline">Headline</option>
            </select>
          </div>

          <div className="ai-summarizer__option-group">
            <label className="ai-summarizer__option-label">Format:</label>
            <select
              value={currentFormat}
              onChange={e => setCurrentFormat(e.target.value as SummaryFormat)}
              disabled={isLoading}
              className="ai-summarizer__select"
            >
              <option value="plain-text">Plain Text</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>

          <div className="ai-summarizer__option-group">
            <label className="ai-summarizer__option-label">Length:</label>
            <select
              value={currentLength}
              onChange={e => setCurrentLength(e.target.value as SummaryLength)}
              disabled={isLoading}
              className="ai-summarizer__select"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
        </div>
      )}

      <div className="ai-summarizer__content">
        {showInput && !controlsOnly && (
          <div className="ai-summarizer__input-section">
            <div className="ai-summarizer__input-header">
              <span className="ai-summarizer__label">Text to Summarize</span>
              <span className="ai-summarizer__counter">
                {inputText.length}/{maxLength}
              </span>
            </div>
            <textarea
              value={inputText}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="ai-summarizer__textarea ai-summarizer__textarea--main"
              disabled={isLoading}
              rows={6}
            />

            <div className="ai-summarizer__context-section">
              <div className="ai-summarizer__input-header">
                <span className="ai-summarizer__label">Context (Optional)</span>
              </div>
              <textarea
                value={inputContext}
                onChange={handleContextChange}
                placeholder="Additional context to improve summarization..."
                className="ai-summarizer__textarea ai-summarizer__textarea--context"
                disabled={isLoading}
                rows={2}
              />
            </div>

            {showControls && (
              <div className="ai-summarizer__controls">
                <button
                  onClick={handleClear}
                  disabled={(!inputText && !inputContext) || isLoading}
                  className="ai-summarizer__clear-btn"
                >
                  Clear
                </button>
                <button
                  onClick={handleSummarize}
                  disabled={!getCurrentText().trim() || isLoading}
                  className="ai-summarizer__summarize-btn"
                >
                  {isLoading
                    ? isStreaming
                      ? 'Streaming...'
                      : 'Summarizing...'
                    : 'Summarize'}
                </button>
              </div>
            )}
          </div>
        )}

        {showControls && (!showInput || controlsOnly) && (
          <div className="ai-summarizer__external-controls">
            <button
              onClick={handleSummarize}
              disabled={!getCurrentText().trim() || isLoading}
              className="ai-summarizer__summarize-btn"
            >
              {isLoading
                ? isStreaming
                  ? 'Streaming...'
                  : 'Summarizing...'
                : 'Summarize'}
            </button>
          </div>
        )}

        {showOutput && (
          <div className="ai-summarizer__output-section">
            <div className="ai-summarizer__output-header">
              <span className="ai-summarizer__label">Summary</span>
              {isDownloading && (
                <div className="ai-summarizer__download-progress">
                  <span>Downloading model...</span>
                  <div className="ai-summarizer__progress-bar">
                    <div
                      className="ai-summarizer__progress-fill"
                      style={{
                        width:
                          downloadProgress.total > 0
                            ? `${(downloadProgress.loaded / downloadProgress.total) * 100}%`
                            : '0%',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="ai-summarizer__output">
              {isLoading && !isDownloading && (
                <div className="ai-summarizer__loading">
                  <div className="ai-summarizer__spinner"></div>
                  <span>
                    {isStreaming
                      ? 'Streaming summary...'
                      : 'Generating summary...'}
                  </span>
                </div>
              )}

              {error && (
                <div className="ai-summarizer__error">
                  <span>{error}</span>
                </div>
              )}

              {summary && (
                <AIResultDisplay
                  content={summary}
                  allowCopy={allowCopy}
                  allowDownload={allowDownload}
                  downloadFileName={downloadFileName}
                  className="ai-summarizer__result-display"
                />
              )}

              {!summary && !isLoading && !error && (
                <div className="ai-summarizer__placeholder">
                  Summary will appear here
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISummarizer;
