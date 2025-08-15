// Main entry point for the ai-ui-components library
export * from './components';
export * from './hooks';
export * from './utils';

// Export types explicitly to avoid naming conflicts with components
export type {
  // Common types
  BaseComponentProps,
  Size,
  Variant,
  Status,

  // Component prop types
  ButtonComponentProps,
  InputComponentProps,
  ModalComponentProps,
  TooltipComponentProps,

  // Chrome AI API types
  WindowAI,
  AICapabilities,
  AIModelDownloadProgress,
  AISession,
  AISessionOptions,
  AILanguageModel,
  AITranslatorCapabilities,
  AITranslatorSession,
  AITranslatorOptions,
  AITranslator as AITranslatorAPI,
  AILanguageDetectorCapabilities,
  AILanguageDetection,
  AILanguageDetectorSession,
  AILanguageDetectorOptions,
  AILanguageDetector as AILanguageDetectorAPI,
  AISummarizerCapabilities,
  AISummarizerSession,
  AISummarizerOptions,
  AISummarizer as AISummarizerAPI,
  AIWriterCapabilities,
  AIWriterSession,
  AIWriterOptions,
  AIWriter as AIWriterAPI,
  AIRewriterCapabilities,
  AIRewriterSession,
  AIRewriterOptions,
  AIRewriter as AIRewriterAPI,
} from './types';
