import { AIWriterCapabilities } from '../types/web-ai';
export interface WriterOptions {
    tone?: 'formal' | 'casual';
    format?: 'plain-text' | 'markdown';
    length?: 'short' | 'medium' | 'long';
}
export interface WriterResult {
    content: string;
    wordCount: number;
    characterCount: number;
}
export declare class WebAIWriter extends EventTarget {
    private session;
    private capabilities;
    constructor();
    initialize(): Promise<void>;
    createSession(options?: WriterOptions): Promise<void>;
    write(prompt: string, context?: string, options?: WriterOptions): Promise<WriterResult>;
    writeStreaming(prompt: string, context?: string, options?: WriterOptions): Promise<ReadableStream<string>>;
    destroy(): Promise<void>;
    isAvailable(): boolean;
    needsDownload(): boolean;
    getCapabilities(): AIWriterCapabilities | null;
    getSupportedTones(): string[];
    getSupportedFormats(): string[];
    getSupportedLengths(): Array<'short' | 'medium' | 'long'>;
}
//# sourceMappingURL=writer.d.ts.map