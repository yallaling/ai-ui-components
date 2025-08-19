// Main exports for React wrapper components
export { AITranslator, type AITranslatorProps } from './components/AITranslator';
export { AISummarizer, type AISummarizerProps, type SummaryType, type SummaryFormat, type SummaryLength } from './components/AISummarizer';
export { AIRewriter, type AIRewriterProps, type RewriterTone, type RewriterFormat, type RewriterLength } from './components/AIRewriter';
export { AILanguageDetector, type AILanguageDetectorProps, type AILanguageDetection } from './components/AILanguageDetector';
export { AIWriter, type AIWriterProps, type WriterTone, type WriterFormat, type WriterLength } from './components/AIWriter';
export { LoadingSpinner, type LoadingSpinnerProps } from './components/LoadingSpinner';
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './components/Button';

// Re-export types
export { type BaseComponentProps } from './types';

// Import Web Components to register them (when available)
// These imports will be conditional based on package availability
try {
  require('@yallaling/web-ai-components/ai-translator');
  require('@yallaling/web-ai-components/ai-summarizer');
  require('@yallaling/web-ai-components/ai-rewriter');
  require('@yallaling/web-ai-components/ai-language-detector');
  require('@yallaling/web-ai-components/ai-writer');
} catch (error) {
  // Web components package not available - components will work in fallback mode
  console.warn('Web AI Components not available. Components will work in standalone mode.');
}
