/**
 * TypeScript definitions for Chrome's built-in AI APIs
 * Based on the Chrome AI proposal and experimental APIs
 */

// Base AI API types
export interface AICapabilities {
  available: 'readily' | 'after-download' | 'no';
  defaultTopK?: number;
  defaultTemperature?: number;
  maxTopK?: number;
  minTopK?: number;
  maxTemperature?: number;
  minTemperature?: number;
}

export interface AIModelDownloadProgress {
  loaded: number;
  total: number;
}

export interface AISession {
  prompt(text: string): Promise<string>;
  promptStreaming(text: string): ReadableStream<string>;
  destroy(): void;
  clone(): Promise<AISession>;
}

export interface AISessionOptions {
  topK?: number;
  temperature?: number;
  signal?: AbortSignal;
  monitor?: (progress: AIModelDownloadProgress) => void;
}

// Language Model API (Prompt API)
export interface AILanguageModelCapabilities {
  available: 'readily' | 'after-download' | 'no';
  defaultTopK?: number;
  defaultTemperature?: number;
  maxTopK?: number;
  minTopK?: number;
  maxTemperature?: number;
  minTemperature?: number;
}

export interface AILanguageModelSession {
  prompt(text: string, options?: { signal?: AbortSignal }): Promise<string>;
  promptStreaming(
    text: string,
    options?: { signal?: AbortSignal }
  ): ReadableStream<string>;
  destroy(): void;
  clone(): Promise<AILanguageModelSession>;
}

export interface AILanguageModelOptions {
  topK?: number;
  temperature?: number;
  initialPrompts?: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  signal?: AbortSignal;
  monitor?: (progress: AIModelDownloadProgress) => void;
}

export interface AILanguageModel {
  availability(): Promise<'readily' | 'after-download' | 'unavailable'>;
  params(): Promise<{
    defaultTemperature: number;
    maxTemperature: number;
    defaultTopK: number;
    maxTopK: number;
  }>;
  create(options?: AILanguageModelOptions): Promise<AILanguageModelSession>;
}

// Translator API
export interface AITranslatorCapabilities {
  available: 'readily' | 'after-download' | 'no';
  languagePairs?: Array<{
    sourceLanguage: string;
    targetLanguage: string;
  }>;
}

export interface AITranslatorSession {
  translate(text: string): Promise<string>;
  destroy(): void;
}

export interface AITranslatorOptions {
  sourceLanguage: string;
  targetLanguage: string;
  signal?: AbortSignal;
  monitor?: (progress: AIModelDownloadProgress) => void;
}

export interface AITranslator {
  capabilities(): Promise<AITranslatorCapabilities>;
  create(options: AITranslatorOptions): Promise<AITranslatorSession>;
}

// Language Detector API
export interface AILanguageDetectorCapabilities {
  available: 'readily' | 'after-download' | 'no';
  languages?: string[];
}

export interface AILanguageDetection {
  detectedLanguage: string;
  confidence: number;
}

export interface AILanguageDetectorSession {
  detect(text: string): Promise<AILanguageDetection[]>;
  destroy(): void;
}

export interface AILanguageDetectorOptions {
  signal?: AbortSignal;
  monitor?: (progress: AIModelDownloadProgress) => void;
}

export interface AILanguageDetector {
  capabilities(): Promise<AILanguageDetectorCapabilities>;
  create(
    options?: AILanguageDetectorOptions
  ): Promise<AILanguageDetectorSession>;
}

// Summarizer API
export interface AISummarizerCapabilities {
  available: 'readily' | 'after-download' | 'no';
  types?: Array<'key-points' | 'tldr' | 'teaser' | 'headline'>;
  formats?: Array<'markdown' | 'plain-text'>;
  lengths?: Array<'short' | 'medium' | 'long'>;
}

export interface AISummarizerSession {
  summarize(text: string): Promise<string>;
  summarizeStreaming(text: string): ReadableStream<string>;
  destroy(): void;
}

export interface AISummarizerOptions {
  type?: 'key-points' | 'tldr' | 'teaser' | 'headline';
  format?: 'markdown' | 'plain-text';
  length?: 'short' | 'medium' | 'long';
  signal?: AbortSignal;
  monitor?: (progress: AIModelDownloadProgress) => void;
}

export interface AISummarizer {
  capabilities(): Promise<AISummarizerCapabilities>;
  create(options?: AISummarizerOptions): Promise<AISummarizerSession>;
}

// Writer API
export interface AIWriterCapabilities {
  available: 'readily' | 'after-download' | 'no';
  tones?: string[];
  formats?: string[];
  lengths?: Array<'short' | 'medium' | 'long'>;
}

export interface AIWriterSession {
  write(prompt: string, context?: string): Promise<string>;
  writeStreaming(prompt: string, context?: string): ReadableStream<string>;
  destroy(): void;
}

export interface AIWriterOptions {
  tone?: string;
  format?: string;
  length?: 'short' | 'medium' | 'long';
  signal?: AbortSignal;
  monitor?: (progress: AIModelDownloadProgress) => void;
}

export interface AIWriter {
  capabilities(): Promise<AIWriterCapabilities>;
  create(options?: AIWriterOptions): Promise<AIWriterSession>;
}

// Rewriter API
export interface AIRewriterCapabilities {
  available: 'readily' | 'after-download' | 'no';
  tones?: string[];
  formats?: string[];
  lengths?: Array<'short' | 'medium' | 'long'>;
}

export interface AIRewriterSession {
  rewrite(text: string, context?: string): Promise<string>;
  rewriteStreaming(text: string, context?: string): ReadableStream<string>;
  destroy(): void;
}

export interface AIRewriterOptions {
  tone?: string;
  format?: string;
  length?: 'short' | 'medium' | 'long';
  signal?: AbortSignal;
  monitor?: (progress: AIModelDownloadProgress) => void;
}

export interface AIRewriter {
  capabilities(): Promise<AIRewriterCapabilities>;
  create(options?: AIRewriterOptions): Promise<AIRewriterSession>;
}

// Global AI interface (available on window.ai in Chrome)
export interface WindowAI {
  languageModel: AILanguageModel;
  translator: AITranslator;
  languageDetector: AILanguageDetector;
  summarizer: AISummarizer;
  writer: AIWriter;
  rewriter: AIRewriter;
}

// Extend Window interface
declare global {
  interface Window {
    ai?: WindowAI;
  }

  interface WorkerGlobalScope {
    LanguageModel: AILanguageModel;
    Translator: AITranslator;
    LanguageDetector: AILanguageDetector;
    Summarizer: AISummarizer;
    Writer: AIWriter;
    Rewriter: AIRewriter;
  }

  // Chrome AI APIs available on self/globalThis
  const LanguageModel: AILanguageModel;
  const Translator: AITranslator;
  const LanguageDetector: AILanguageDetector;
  const Summarizer: AISummarizer;
  const Writer: AIWriter;
  const Rewriter: AIRewriter;
}

// Helper type for Chrome AI global access
export type ChromeAIGlobal = typeof globalThis & {
  LanguageModel: AILanguageModel;
  Translator: AITranslator;
  LanguageDetector: AILanguageDetector;
  Summarizer: AISummarizer;
  Writer: AIWriter;
  Rewriter: AIRewriter;
};
