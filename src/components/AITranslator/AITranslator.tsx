/* eslint-disable @typescript-eslint/no-explicit-any */
// Chrome AI APIs are experimental and require 'any' types for global access
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AITranslatorSession } from '../../types/web-ai';
import { AITranslatorProps } from './AITranslator.types';
import './AITranslator.css';

/**
 * AI Translator component using Chrome's built-in translation API
 * Supports external data input and optional UI components
 */
const AITranslator: React.FC<AITranslatorProps> = ({
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
  streaming: _streaming = false,
  onTranslatorReady,
  controlsOnly = false,
  externalText,
  className = '',
  width,
  height,
  style,
  resizable = true,
  allowCopy: _allowCopy = true,
  allowDownload: _allowDownload = true,
  downloadFileName: _downloadFileName = 'translation.md',
  ...props
}) => {
  const [inputText, setInputText] = useState(text || '');
  const [translatedText, setTranslatedText] = useState('');
  const [currentSourceLanguage, setCurrentSourceLanguage] = useState(
    sourceLanguage || 'auto'
  );
  const [currentTargetLanguage, setCurrentTargetLanguage] = useState(
    targetLanguage || 'en'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({
    loaded: 0,
    total: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  const sessionRef = useRef<AITranslatorSession | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Language options for the dropdowns
  const languageOptions = [
    { code: 'auto', name: 'Detect Language' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'sv', name: 'Swedish' },
    { code: 'da', name: 'Danish' },
    { code: 'no', name: 'Norwegian' },
    { code: 'fi', name: 'Finnish' },
    { code: 'tr', name: 'Turkish' },
  ];

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

  // Get the current text to translate
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
      // Use the exact feature detection from Chrome documentation
      const translatorSupported = 'Translator' in self;
      const detectorSupported = 'LanguageDetector' in self;

      setIsSupported(translatorSupported && detectorSupported);

      if (!translatorSupported) {
        console.warn('Translator API is not supported in this browser');
      }
      if (!detectorSupported) {
        console.warn('LanguageDetector API is not supported in this browser');
      }
    };

    checkAvailability();
  }, []);

  // Create translation session
  const createSession = useCallback(async () => {
    if (!('Translator' in self)) {
      throw new Error('AI Translator API not available');
    }

    if (sessionRef.current) {
      sessionRef.current.destroy();
    }

    abortControllerRef.current = new AbortController();

    const session = await (self as any).Translator.create({
      sourceLanguage:
        currentSourceLanguage === 'auto' ? undefined : currentSourceLanguage,
      targetLanguage: currentTargetLanguage,
      signal: abortControllerRef.current.signal,
      monitor: (progress: any) => {
        if (progress.type === 'download') {
          setIsDownloading(true);
          setDownloadProgress({
            loaded: progress.loaded || 0,
            total: progress.total || 1,
          });
          onProgress?.(progress.loaded || 0, progress.total || 1);
        }
      },
    });

    sessionRef.current = session;
    setIsDownloading(false);
    return session;
  }, [currentSourceLanguage, currentTargetLanguage, onProgress]);

  // Perform translation (can be called externally or internally)
  const translateText = useCallback(
    async (externalData?: any) => {
      const textToTranslate = externalData
        ? convertDataToText(externalData)
        : getCurrentText();

      if (!textToTranslate.trim()) {
        setTranslatedText('');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Only create session if one doesn't exist
        let session = sessionRef.current;
        if (!session) {
          try {
            session = await createSession();
          } catch (err: any) {
            // If session creation fails due to user gesture requirement, provide helpful error
            if (err.message?.includes('user gesture')) {
              throw new Error(
                'Please click the translate button to download the AI model (user interaction required)'
              );
            }
            throw err;
          }
        }

        if (!session) {
          throw new Error('Failed to create translation session');
        }

        const result = await session.translate(textToTranslate);

        setTranslatedText(result);
        onTranslate?.(result);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Translation failed';
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsLoading(false);
        setIsDownloading(false);
      }
    },
    [createSession, getCurrentText, convertDataToText, onTranslate, onError]
  );

  // Auto-translate when text or languages change
  useEffect(() => {
    if (
      autoTranslate &&
      (data !== undefined || text !== undefined || inputText)
    ) {
      // Destroy existing session when languages change to force recreation
      if (sessionRef.current) {
        sessionRef.current.destroy();
        sessionRef.current = null;
      }
      translateText();
    }
  }, [
    data,
    text,
    inputText,
    currentSourceLanguage,
    currentTargetLanguage,
    autoTranslate,
    translateText,
  ]);

  // Update input text when prop changes
  useEffect(() => {
    setInputText(text || '');
  }, [text]);

  // Update language state when props change
  useEffect(() => {
    setCurrentSourceLanguage(sourceLanguage || 'auto');
  }, [sourceLanguage]);

  useEffect(() => {
    setCurrentTargetLanguage(targetLanguage || 'en');
  }, [targetLanguage]);

  // Expose translateText function to parent component
  useEffect(() => {
    if (onTranslatorReady) {
      onTranslatorReady(translateText);
    }
  }, [onTranslatorReady, translateText]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sessionRef.current?.destroy();
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleTranslate = () => {
    translateText();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setInputText(value);
    }
  };

  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    setError(null);
  };

  const handleSourceLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLanguage = e.target.value;
    setCurrentSourceLanguage(newLanguage);
    // Destroy session to force recreation with new languages
    if (sessionRef.current) {
      sessionRef.current.destroy();
      sessionRef.current = null;
    }
    setTranslatedText(''); // Clear previous translation
    setError(null);
  };

  const handleTargetLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLanguage = e.target.value;
    setCurrentTargetLanguage(newLanguage);
    // Destroy session to force recreation with new languages
    if (sessionRef.current) {
      sessionRef.current.destroy();
      sessionRef.current = null;
    }
    setTranslatedText(''); // Clear previous translation
    setError(null);
  };

  const handleSwapLanguages = () => {
    if (currentSourceLanguage === 'auto') {
      // Can't swap when source is auto-detect
      return;
    }

    const tempSource = currentSourceLanguage;
    const tempTarget = currentTargetLanguage;

    setCurrentSourceLanguage(tempTarget);
    setCurrentTargetLanguage(tempSource);

    // Swap text content as well
    setInputText(translatedText);
    setTranslatedText(inputText);

    // Destroy session to force recreation with swapped languages
    if (sessionRef.current) {
      sessionRef.current.destroy();
      sessionRef.current = null;
    }
    setError(null);
  };

  // Container styling
  const containerStyle: React.CSSProperties = {
    width: width || '100%',
    height: height,
    resize: resizable ? 'both' : 'none',
    overflow: resizable ? 'auto' : 'visible',
    ...style,
  };

  if (isSupported === false) {
    return (
      <div
        className={`ai-translator ai-translator--unsupported ${className}`}
        style={containerStyle}
        {...props}
      >
        <div className="ai-translator__error">
          <div className="ai-translator__error-icon">⚠️</div>
          <div className="ai-translator__error-message">
            {error || 'AI Translator is not supported in this browser'}
          </div>
          <div className="ai-translator__error-suggestion">
            Please use Chrome with AI features enabled
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`ai-translator ${className}`}
      style={containerStyle}
      {...props}
    >
      {showControls && (
        <div className="ai-translator__header">
          <div className="ai-translator__languages">
            <select
              value={currentSourceLanguage}
              onChange={handleSourceLanguageChange}
              disabled={isLoading}
              className="ai-translator__language-select"
            >
              {languageOptions.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <button
              className="ai-translator__swap-btn"
              onClick={handleSwapLanguages}
              disabled={isLoading || currentSourceLanguage === 'auto'}
              aria-label="Swap languages"
              title={
                currentSourceLanguage === 'auto'
                  ? 'Cannot swap when auto-detecting language'
                  : 'Swap languages'
              }
            >
              ⇄
            </button>
            <select
              value={currentTargetLanguage}
              onChange={handleTargetLanguageChange}
              disabled={isLoading}
              className="ai-translator__language-select"
            >
              {languageOptions
                .filter(lang => lang.code !== 'auto')
                .map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      )}

      <div className="ai-translator__content">
        {showInput && !controlsOnly && (
          <div className="ai-translator__input-section">
            <div className="ai-translator__input-header">
              <span className="ai-translator__label">Source Text</span>
              <span className="ai-translator__counter">
                {inputText.length}/{maxLength}
              </span>
            </div>
            <textarea
              value={inputText}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="ai-translator__textarea"
              disabled={isLoading}
              rows={4}
            />
            {showControls && (
              <div className="ai-translator__input-controls">
                <button
                  onClick={handleClear}
                  disabled={!inputText || isLoading}
                  className="ai-translator__clear-btn"
                >
                  Clear
                </button>
                <button
                  onClick={handleTranslate}
                  disabled={!getCurrentText().trim() || isLoading}
                  className="ai-translator__translate-btn"
                >
                  {isLoading ? 'Translating...' : 'Translate'}
                </button>
              </div>
            )}
          </div>
        )}

        {showControls && (!showInput || controlsOnly) && (
          <div className="ai-translator__external-controls">
            <button
              onClick={handleTranslate}
              disabled={!getCurrentText().trim() || isLoading}
              className="ai-translator__translate-btn"
            >
              {isLoading ? 'Translating...' : 'Translate'}
            </button>
          </div>
        )}

        {showOutput && (
          <div className="ai-translator__output-section">
            <div className="ai-translator__output-header">
              <span className="ai-translator__label">Translation</span>
              {isDownloading && (
                <div className="ai-translator__download-progress">
                  <span>Downloading model...</span>
                  <div className="ai-translator__progress-bar">
                    <div
                      className="ai-translator__progress-fill"
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
            <div className="ai-translator__output">
              {isLoading && !isDownloading && (
                <div className="ai-translator__loading">
                  <div className="ai-translator__spinner"></div>
                  <span>Translating...</span>
                </div>
              )}
              {error && (
                <div className="ai-translator__error">
                  <span className="ai-translator__error-icon">❌</span>
                  <span>{error}</span>
                </div>
              )}
              {translatedText && !isLoading && (
                <div className="ai-translator__result">{translatedText}</div>
              )}
              {!translatedText && !isLoading && !error && (
                <div className="ai-translator__placeholder">
                  Translation will appear here
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AITranslator;
