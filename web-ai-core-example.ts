// @yallaling/web-ai-core
// Core Web AI logic (framework-agnostic)

export interface WebAITranslatorOptions {
  sourceLanguage: string;
  targetLanguage: string;
  streaming?: boolean;
}

export class WebAITranslator {
  private session: any = null;
  private abortController: AbortController | null = null;

  async isAvailable(): Promise<boolean> {
    try {
      return 'translation' in self && 'canTranslate' in self.translation;
    } catch {
      return false;
    }
  }

  async createSession(options: WebAITranslatorOptions) {
    if (this.session) {
      this.session.destroy();
    }

    const canTranslate = await (self as any).translation.canTranslate({
      sourceLanguage: options.sourceLanguage,
      targetLanguage: options.targetLanguage,
    });

    if (canTranslate === 'no') {
      throw new Error('Translation not supported for this language pair');
    }

    this.session = await (self as any).translation.createTranslator({
      sourceLanguage: options.sourceLanguage,
      targetLanguage: options.targetLanguage,
    });

    return this.session;
  }

  async translate(text: string, onProgress?: (chunk: string) => void): Promise<string> {
    if (!this.session) {
      throw new Error('Translation session not initialized');
    }

    this.abortController = new AbortController();

    try {
      if (onProgress) {
        // Streaming translation
        const stream = this.session.translateStreaming(text, {
          signal: this.abortController.signal,
        });

        let result = '';
        for await (const chunk of stream) {
          result = chunk;
          onProgress(chunk);
        }
        return result;
      } else {
        // Non-streaming translation
        return await this.session.translate(text, {
          signal: this.abortController.signal,
        });
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Translation was cancelled');
      }
      throw error;
    }
  }

  cancel() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  destroy() {
    this.cancel();
    if (this.session) {
      this.session.destroy();
      this.session = null;
    }
  }
}

// Similar classes for other AI features
export class ChromeAISummarizer { /* ... */ }
export class ChromeAIRewriter { /* ... */ }
export class ChromeAILanguageDetector { /* ... */ }
