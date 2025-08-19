import { AIRewriterCapabilities } from '../types/web-ai';
export interface RewriterOptions {
    tone?: 'as-is' | 'more-formal' | 'more-casual';
    format?: 'plain-text' | 'markdown';
    length?: 'shorter' | 'as-is' | 'longer';
}
export interface RewriterResult {
    content: string;
    originalLength: number;
    rewrittenLength: number;
    changeRatio: number;
}
export declare class WebAIRewriter extends EventTarget {
    private session;
    private capabilities;
    constructor();
    initialize(): Promise<void>;
    createSession(options?: RewriterOptions): Promise<void>;
    rewrite(text: string, context?: string, options?: RewriterOptions): Promise<RewriterResult>;
    rewriteStreaming(text: string, context?: string, options?: RewriterOptions): Promise<ReadableStream<string>>;
    destroy(): Promise<void>;
    isAvailable(): boolean;
    needsDownload(): boolean;
    getCapabilities(): AIRewriterCapabilities | null;
    getSupportedTones(): string[];
    getSupportedFormats(): string[];
    getSupportedLengths(): Array<'shorter' | 'as-is' | 'longer'>;
}
//# sourceMappingURL=rewriter.d.ts.map