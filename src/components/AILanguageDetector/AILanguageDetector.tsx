import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AILanguageDetectorProps } from './AILanguageDetector.types';
import {
  AILanguageDetectorSession,
  AILanguageDetection,
  AIModelDownloadProgress,
} from '../../types/chrome-ai';
import './AILanguageDetector.css';

/**
 * AI Language Detector component using Chrome's built-in language detection API
 */
const AILanguageDetector: React.FC<AILanguageDetectorProps> = ({
  text,
  expectedLanguages = [],
  confidenceThreshold = 0.5,
  autoDetect = false,
  showControls = true,
  maxLength = 2000,
  onDetect,
  onError,
  onProgress,
  placeholder = 'Enter text to detect language...',
  showConfidence = true,
  maxSuggestions = 3,
  className = '',
  ...props
}) => {
  const [inputText, setInputText] = useState(text || '');
  const [detections, setDetections] = useState<AILanguageDetection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({
    loaded: 0,
    total: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  const sessionRef = useRef<AILanguageDetectorSession | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Language code to name mapping
  const languageNames: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ru: 'Russian',
    ja: 'Japanese',
    ko: 'Korean',
    zh: 'Chinese',
    ar: 'Arabic',
    hi: 'Hindi',
    nl: 'Dutch',
    sv: 'Swedish',
    da: 'Danish',
    no: 'Norwegian',
    fi: 'Finnish',
    pl: 'Polish',
    tr: 'Turkish',
    th: 'Thai',
    vi: 'Vietnamese',
    cs: 'Czech',
    hu: 'Hungarian',
    ro: 'Romanian',
    bg: 'Bulgarian',
    hr: 'Croatian',
    sk: 'Slovak',
    sl: 'Slovenian',
    et: 'Estonian',
    lv: 'Latvian',
    lt: 'Lithuanian',
    mt: 'Maltese',
    ga: 'Irish',
    cy: 'Welsh',
  };

  // Check API availability
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        // Use the exact feature detection from Chrome documentation
        const detectorSupported = 'LanguageDetector' in self;

        if (!detectorSupported) {
          setError('AI Language Detector API is not available in this browser');
          return;
        }

        const capabilities = await (
          self as any
        ).LanguageDetector.availability();
        setIsSupported(
          capabilities === 'available' || capabilities === 'readily'
        );

        if (capabilities === 'unavailable') {
          setError('AI Language Detector is not supported on this device');
        } else if (
          capabilities === 'downloadable' ||
          capabilities === 'downloading'
        ) {
          setError('AI Language Detector model needs to be downloaded first');
        }
      } catch (err) {
        console.error('Error checking AI Language Detector availability:', err);
        setError('Failed to check AI Language Detector availability');
        onError?.('Failed to check AI Language Detector availability');
      }
    };

    checkAvailability();
  }, []);

  // Create detection session
  const createSession = useCallback(async () => {
    if (!('LanguageDetector' in self)) {
      throw new Error('AI Language Detector API not available');
    }

    if (sessionRef.current) {
      sessionRef.current.destroy();
    }

    abortControllerRef.current = new AbortController();

    try {
      const session = await (self as any).LanguageDetector.create({
        signal: abortControllerRef.current.signal,
        monitor: (progress: any) => {
          if (progress.type === 'download') {
            setIsDownloading(true);
            setDownloadProgress({
              loaded: progress.loaded || 0,
              total: progress.total || 1,
            });
          }
        },
      });

      sessionRef.current = session;
      setIsDownloading(false);
      return session;
    } catch (err: any) {
      // If session creation fails due to user gesture requirement, provide helpful error
      if (
        err.message?.includes('user gesture') ||
        err.message?.includes('requires a user gesture')
      ) {
        throw new Error(
          'Please click the detect button to download the AI model (user interaction required)'
        );
      }
      throw err;
    }
  }, []);

  // Perform language detection
  const detectLanguage = useCallback(
    async (textToAnalyze: string) => {
      if (!textToAnalyze.trim()) {
        setDetections([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const session = sessionRef.current || (await createSession());
        const results = await session.detect(textToAnalyze);

        // Convert API response format to our format and filter by confidence threshold
        const formattedResults = (results || [])
          .filter((result: any) => result && typeof result === 'object')
          .map((result: any) => ({
            detectedLanguage: result.detectedLanguage || 'unknown',
            confidence: result.confidence || 0,
          }));

        const filteredResults = formattedResults
          .filter(
            (detection: any) => detection.confidence >= confidenceThreshold
          )
          .slice(0, maxSuggestions);

        setDetections(filteredResults);
        onDetect?.(filteredResults);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Language detection failed';
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsLoading(false);
        setIsDownloading(false);
      }
    },
    [createSession, confidenceThreshold, maxSuggestions, onDetect, onError]
  );

  // Auto-detect when text changes
  useEffect(() => {
    if (autoDetect && inputText) {
      const timeoutId = setTimeout(() => {
        detectLanguage(inputText);
      }, 500); // Debounce detection

      return () => clearTimeout(timeoutId);
    }
  }, [inputText, autoDetect, detectLanguage]);

  // Update input text when prop changes
  useEffect(() => {
    setInputText(text || '');
  }, [text]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sessionRef.current?.destroy();
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleDetect = () => {
    detectLanguage(inputText);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setInputText(value);
    }
  };

  const handleClear = () => {
    setInputText('');
    setDetections([]);
    setError(null);
  };

  const getLanguageName = (code: string) => {
    if (!code) return 'Unknown';
    return languageNames[code] || code.toUpperCase();
  };

  const formatConfidence = (confidence: number) => {
    return `${Math.round(confidence * 100)}%`;
  };

  if (isSupported === false) {
    return (
      <div
        className={`ai-language-detector ai-language-detector--unsupported ${className}`}
        {...props}
      >
        <div className="ai-language-detector__error">
          <div className="ai-language-detector__error-icon">⚠️</div>
          <div className="ai-language-detector__error-message">
            {error || 'AI Language Detector is not supported in this browser'}
          </div>
          <div className="ai-language-detector__error-suggestion">
            Please use Chrome with AI features enabled
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ai-language-detector ${className}`} {...props}>
      <div className="ai-language-detector__content">
        <div className="ai-language-detector__input-section">
          <div className="ai-language-detector__input-header">
            <span className="ai-language-detector__label">Text to Analyze</span>
            <span className="ai-language-detector__counter">
              {inputText.length}/{maxLength}
            </span>
          </div>
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="ai-language-detector__textarea"
            disabled={isLoading}
            rows={4}
          />
          {showControls && (
            <div className="ai-language-detector__controls">
              <button
                onClick={handleClear}
                disabled={!inputText || isLoading}
                className="ai-language-detector__clear-btn"
              >
                Clear
              </button>
              <button
                onClick={handleDetect}
                disabled={!inputText.trim() || isLoading}
                className="ai-language-detector__detect-btn"
              >
                {isLoading ? 'Detecting...' : 'Detect Language'}
              </button>
            </div>
          )}
        </div>

        <div className="ai-language-detector__results-section">
          <div className="ai-language-detector__results-header">
            <span className="ai-language-detector__label">
              Detected Languages
            </span>
            {isDownloading && (
              <div className="ai-language-detector__download-progress">
                <span>Downloading model...</span>
                <div className="ai-language-detector__progress-bar">
                  <div
                    className="ai-language-detector__progress-fill"
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

          <div className="ai-language-detector__results">
            {isLoading && !isDownloading && (
              <div className="ai-language-detector__loading">
                <div className="ai-language-detector__spinner"></div>
                <span>Analyzing language...</span>
              </div>
            )}

            {error && (
              <div className="ai-language-detector__error">
                <span className="ai-language-detector__error-icon">❌</span>
                <span>{error}</span>
              </div>
            )}

            {detections.length > 0 && !isLoading && (
              <div className="ai-language-detector__detections">
                {detections
                  .filter(detection => detection && detection.detectedLanguage)
                  .map((detection, index) => (
                    <div
                      key={`${detection.detectedLanguage || 'unknown'}-${index}`}
                      className="ai-language-detector__detection"
                    >
                      <div className="ai-language-detector__language">
                        <span className="ai-language-detector__language-name">
                          {getLanguageName(detection.detectedLanguage)}
                        </span>
                        <span className="ai-language-detector__language-code">
                          ({detection.detectedLanguage})
                        </span>
                      </div>
                      {showConfidence && (
                        <div className="ai-language-detector__confidence">
                          <span className="ai-language-detector__confidence-text">
                            {formatConfidence(detection.confidence)}
                          </span>
                          <div className="ai-language-detector__confidence-bar">
                            <div
                              className="ai-language-detector__confidence-fill"
                              style={{
                                width: `${detection.confidence * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {detections.length === 0 && !isLoading && !error && inputText && (
              <div className="ai-language-detector__no-results">
                No languages detected above{' '}
                {formatConfidence(confidenceThreshold)} confidence
              </div>
            )}

            {!inputText && !isLoading && !error && (
              <div className="ai-language-detector__placeholder">
                Language detection results will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILanguageDetector;
