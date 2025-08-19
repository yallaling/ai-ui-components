import { AIRewriterCapabilities, AIRewriterSession, AIRewriterOptions } from '../types/web-ai';

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

export class WebAIRewriter extends EventTarget {
  private session: AIRewriterSession | null = null;
  private capabilities: AIRewriterCapabilities | null = null;

  constructor() {
    super();
  }

  async initialize(): Promise<void> {
    try {
      // Use the same API detection as the working React components
      if (!('Rewriter' in self)) {
        throw new Error('Chrome AI Rewriter API not available');
      }

      // Use availability() method like in working React components
      const availabilityResult = await (self as any).Rewriter.availability();
      this.capabilities = { available: availabilityResult };
      
      if (availabilityResult === 'no') {
        throw new Error('Chrome AI Rewriter not available on this device');
      }

      this.dispatchEvent(new CustomEvent('initialized', {
        detail: { capabilities: this.capabilities }
      }));
    } catch (error) {
      this.dispatchEvent(new CustomEvent('error', {
        detail: { error: error instanceof Error ? error.message : 'Unknown error' }
      }));
      throw error;
    }
  }

  async createSession(options: RewriterOptions = {}): Promise<void> {
    try {
      if (!this.capabilities) {
        await this.initialize();
      }

      const sessionOptions: AIRewriterOptions = {
        tone: options.tone,
        format: options.format,
        length: options.length
      };

      this.session = await (self as any).Rewriter.create(sessionOptions);

      this.dispatchEvent(new CustomEvent('sessionCreated', {
        detail: { options: sessionOptions }
      }));
    } catch (error) {
      this.dispatchEvent(new CustomEvent('error', {
        detail: { error: error instanceof Error ? error.message : 'Failed to create session' }
      }));
      throw error;
    }
  }

  async rewrite(text: string, context?: string, options: RewriterOptions = {}): Promise<RewriterResult> {
    try {
      if (!this.session) {
        await this.createSession(options);
      }

      if (!this.session) {
        throw new Error('Failed to create rewriter session');
      }

      this.dispatchEvent(new CustomEvent('rewritingStarted', {
        detail: { originalText: text, context, options }
      }));

      // Use correct Chrome AI API - pass context as options object
      const rewriteOptions = context ? { context } : undefined;
      const content = await this.session.rewrite(text, rewriteOptions);
      
      const result: RewriterResult = {
        content,
        originalLength: text.length,
        rewrittenLength: content.length,
        changeRatio: Math.round(Math.abs(1 - content.length / text.length) * 100)
      };

      this.dispatchEvent(new CustomEvent('rewritingCompleted', {
        detail: result
      }));

      return result;
    } catch (error) {
      this.dispatchEvent(new CustomEvent('error', {
        detail: { error: error instanceof Error ? error.message : 'Rewriting failed' }
      }));
      throw error;
    }
  }

  async rewriteStreaming(text: string, context?: string, options: RewriterOptions = {}): Promise<ReadableStream<string>> {
    try {
      if (!this.session) {
        await this.createSession(options);
      }

      if (!this.session) {
        throw new Error('Failed to create rewriter session');
      }

      this.dispatchEvent(new CustomEvent('streamingStarted', {
        detail: { originalText: text, context, options }
      }));

      // Use correct Chrome AI API - pass context as options object
      const rewriteOptions = context ? { context } : undefined;
      const stream = await this.session.rewriteStreaming(text, rewriteOptions);

      // Wrap the stream to dispatch events
      const self = this;
      return new ReadableStream({
        async start(controller) {
          const reader = stream.getReader();
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              self.dispatchEvent(new CustomEvent('streamingChunk', {
                detail: { chunk: value }
              }));
              
              controller.enqueue(value);
            }
            controller.close();
            
            self.dispatchEvent(new CustomEvent('streamingCompleted'));
          } catch (error) {
            controller.error(error);
            self.dispatchEvent(new CustomEvent('error', {
              detail: { error: error instanceof Error ? error.message : 'Streaming failed' }
            }));
          } finally {
            reader.releaseLock();
          }
        }
      });
    } catch (error) {
      this.dispatchEvent(new CustomEvent('error', {
        detail: { error: error instanceof Error ? error.message : 'Streaming setup failed' }
      }));
      throw error;
    }
  }

  async destroy(): Promise<void> {
    if (this.session) {
      await this.session.destroy();
      this.session = null;
      
      this.dispatchEvent(new CustomEvent('sessionDestroyed'));
    }
  }

  // Utility methods
  isAvailable(): boolean {
    return this.capabilities?.available === 'readily' || this.capabilities?.available === 'after-download';
  }

  needsDownload(): boolean {
    return this.capabilities?.available === 'after-download';
  }

  getCapabilities(): AIRewriterCapabilities | null {
    return this.capabilities;
  }

  getSupportedTones(): string[] {
    return this.capabilities?.tones || [];
  }

  getSupportedFormats(): string[] {
    return this.capabilities?.formats || [];
  }

  getSupportedLengths(): Array<'shorter' | 'as-is' | 'longer'> {
    return this.capabilities?.lengths || ['shorter', 'as-is', 'longer'];
  }
}
