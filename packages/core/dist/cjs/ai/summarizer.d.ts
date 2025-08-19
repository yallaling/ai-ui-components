import { AISummarizerCapabilities } from '../types/web-ai';
export interface SummarizerOptions {
    type?: 'key-points' | 'tldr' | 'teaser' | 'headline';
    format?: 'markdown' | 'plain-text';
    length?: 'short' | 'medium' | 'long';
}
export interface SummarizerResult {
    summary: string;
    originalLength: number;
    summaryLength: number;
    compressionRatio: number;
}
export declare class WebAISummarizer extends EventTarget {
    private session;
    private capabilities;
    constructor();
    initialize(): Promise<void>;
    createSession(options?: SummarizerOptions): Promise<void>;
    summarize(text: string, options?: SummarizerOptions): Promise<SummarizerResult>;
    destroy(): Promise<void>;
    isAvailable(): boolean;
    needsDownload(): boolean;
    getCapabilities(): AISummarizerCapabilities | null;
}
//# sourceMappingURL=summarizer.d.ts.map