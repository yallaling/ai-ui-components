import { AIWriterCapabilities, AIWriterSession, AIWriterOptions } from '../types/web-ai';

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

export class WebAIWriter extends EventTarget {
  private session: AIWriterSession | null = null;
  private capabilities: AIWriterCapabilities | null = null;

  constructor() {
    super();
  }

  async initialize(): Promise<void> {
    try {
      // Use the same API detection as the working React components
      if (!('Writer' in self)) {
        throw new Error('Chrome AI Writer API not available');
      }

      // Use availability() method like in working React components
      const availabilityResult = await (self as any).Writer.availability();
      this.capabilities = { available: availabilityResult };
      
      if (availabilityResult === 'no') {
        throw new Error('Chrome AI Writer not available on this device');
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

  async createSession(options: WriterOptions = {}): Promise<void> {
    try {
      if (!this.capabilities) {
        await this.initialize();
      }

      const sessionOptions: AIWriterOptions = {
        tone: options.tone,
        format: options.format,
        length: options.length
      };

      this.session = await (self as any).Writer.create(sessionOptions);

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

  async write(prompt: string, context?: string, options: WriterOptions = {}): Promise<WriterResult> {
    try {
      if (!this.session) {
        await this.createSession(options);
      }

      if (!this.session) {
        throw new Error('Failed to create writer session');
      }

      this.dispatchEvent(new CustomEvent('writingStarted', {
        detail: { prompt, context, options }
      }));

      // Use correct Chrome AI API - pass context as options object
      const writeOptions = context ? { context } : undefined;
      const content = await this.session.write(prompt, writeOptions);
      
      const result: WriterResult = {
        content,
        wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
        characterCount: content.length
      };

      this.dispatchEvent(new CustomEvent('writingCompleted', {
        detail: result
      }));

      return result;
    } catch (error) {
      this.dispatchEvent(new CustomEvent('error', {
        detail: { error: error instanceof Error ? error.message : 'Writing failed' }
      }));
      throw error;
    }
  }

  async writeStreaming(prompt: string, context?: string, options: WriterOptions = {}): Promise<ReadableStream<string>> {
    try {
      if (!this.session) {
        await this.createSession(options);
      }

      if (!this.session) {
        throw new Error('Failed to create writer session');
      }

      this.dispatchEvent(new CustomEvent('streamingStarted', {
        detail: { prompt, context, options }
      }));

      // Use correct Chrome AI API - pass context as options object
      const writeOptions = context ? { context } : undefined;
      const stream = await this.session.writeStreaming(prompt, writeOptions);

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

  getCapabilities(): AIWriterCapabilities | null {
    return this.capabilities;
  }

  getSupportedTones(): string[] {
    return this.capabilities?.tones || [];
  }

  getSupportedFormats(): string[] {
    return this.capabilities?.formats || [];
  }

  getSupportedLengths(): Array<'short' | 'medium' | 'long'> {
    return this.capabilities?.lengths || ['short', 'medium', 'long'];
  }
}
