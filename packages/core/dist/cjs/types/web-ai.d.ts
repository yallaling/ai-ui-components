/**
 * TypeScript definitions for Chrome's built-in AI APIs
 * Based on the Chrome AI proposal and experimental APIs
 */
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
    prompt(text: string, options?: {
        signal?: AbortSignal;
    }): Promise<string>;
    promptStreaming(text: string, options?: {
        signal?: AbortSignal;
    }): ReadableStream<string>;
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
    create(options?: AILanguageDetectorOptions): Promise<AILanguageDetectorSession>;
}
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
export interface AIWriterCapabilities {
    available: 'readily' | 'after-download' | 'no';
    tones?: string[];
    formats?: string[];
    lengths?: Array<'short' | 'medium' | 'long'>;
}
export interface AIWriterSession {
    write(prompt: string, options?: {
        context?: string;
    }): Promise<string>;
    writeStreaming(prompt: string, options?: {
        context?: string;
    }): ReadableStream<string>;
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
export interface AIRewriterCapabilities {
    available: 'readily' | 'after-download' | 'no';
    tones?: Array<'as-is' | 'more-formal' | 'more-casual'>;
    formats?: Array<'plain-text' | 'markdown'>;
    lengths?: Array<'shorter' | 'as-is' | 'longer'>;
}
export interface AIRewriterSession {
    rewrite(text: string, options?: {
        context?: string;
    }): Promise<string>;
    rewriteStreaming(text: string, options?: {
        context?: string;
    }): ReadableStream<string>;
    destroy(): void;
}
export interface AIRewriterOptions {
    tone?: 'as-is' | 'more-formal' | 'more-casual';
    format?: 'plain-text' | 'markdown';
    length?: 'shorter' | 'as-is' | 'longer';
    signal?: AbortSignal;
    monitor?: (progress: AIModelDownloadProgress) => void;
}
export interface AIRewriter {
    capabilities(): Promise<AIRewriterCapabilities>;
    create(options?: AIRewriterOptions): Promise<AIRewriterSession>;
}
export interface WindowAI {
    languageModel: AILanguageModel;
    translator: AITranslator;
    languageDetector: AILanguageDetector;
    summarizer: AISummarizer;
    writer: AIWriter;
    rewriter: AIRewriter;
}
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
    const LanguageModel: AILanguageModel;
    const Translator: AITranslator;
    const LanguageDetector: AILanguageDetector;
    const Summarizer: AISummarizer;
    const Writer: AIWriter;
    const Rewriter: AIRewriter;
}
export type ChromeAIGlobal = typeof globalThis & {
    LanguageModel: AILanguageModel;
    Translator: AITranslator;
    LanguageDetector: AILanguageDetector;
    Summarizer: AISummarizer;
    Writer: AIWriter;
    Rewriter: AIRewriter;
};
//# sourceMappingURL=web-ai.d.ts.map