import { 
  AITranslator as IAITranslator, 
  AITranslatorSession, 
  AITranslatorOptions,
  AIModelDownloadProgress
} from '../types/web-ai';

/**
 * Core Web AI Translator class - Framework agnostic
 * Provides event-driven translation functionality
 */
export class WebAITranslator {
  private session: AITranslatorSession | null = null;
  private abortController: AbortController | null = null;
  private eventTarget = new EventTarget();

  constructor(
    private sourceLanguage: string = 'auto',
    private targetLanguage: string = 'en'
  ) {}

  /**
   * Add event listener for translation events
   */
  addEventListener(type: string, listener: EventListener) {
    this.eventTarget.addEventListener(type, listener);
  }

  /**
   * Remove event listener
   */
  removeEventListener(type: string, listener: EventListener) {
    this.eventTarget.removeEventListener(type, listener);
  }

  /**
   * Dispatch custom event
   */
  private dispatchEvent(type: string, detail: any) {
    this.eventTarget.dispatchEvent(new CustomEvent(type, { detail }));
  }

  /**
   * Check if Chrome AI Translator is available
   */
  async isSupported(): Promise<boolean> {
    try {
      // Use the same API detection as the working React components
      // Just check if the API exists, don't call availability() which requires arguments
      return 'Translator' in self && 'LanguageDetector' in self;
    } catch (error) {
      return false;
    }
  }

  /**
   * Initialize translator session
   */
  async initialize(): Promise<void> {
    try {
      // Use the same API detection as the working React components
      if (!('Translator' in self)) {
        throw new Error('Chrome AI Translator not available');
      }

      if (!('LanguageDetector' in self)) {
        throw new Error('Chrome AI LanguageDetector not available');
      }

      // Set up abort controller
      this.abortController = new AbortController();

      const options: AITranslatorOptions = {
        sourceLanguage: this.sourceLanguage,
        targetLanguage: this.targetLanguage,
        signal: this.abortController.signal,
        monitor: (progress: AIModelDownloadProgress) => {
          this.dispatchEvent('progress', {
            loaded: progress.loaded,
            total: progress.total
          });
        }
      };

      this.session = await (self as any).Translator.create(options);
      this.dispatchEvent('ready', { session: this.session });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Translation initialization failed';
      this.dispatchEvent('error', { error: errorMessage });
      throw error;
    }
  }

  /**
   * Translate text
   */
  async translate(text: string): Promise<string> {
    if (!text.trim()) {
      throw new Error('Text is required for translation');
    }

    try {
      // Initialize session if not already done
      if (!this.session) {
        await this.initialize();
      }

      if (!this.session) {
        throw new Error('Translation session not available');
      }

      this.dispatchEvent('translation-start', { text });

      const translatedText = await this.session.translate(text);
      
      this.dispatchEvent('translation-complete', { 
        originalText: text,
        translatedText,
        sourceLanguage: this.sourceLanguage,
        targetLanguage: this.targetLanguage
      });

      return translatedText;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Translation failed';
      this.dispatchEvent('error', { error: errorMessage });
      throw error;
    }
  }

  /**
   * Update source language
   */
  setSourceLanguage(language: string): void {
    if (this.sourceLanguage !== language) {
      this.sourceLanguage = language;
      // Reset session to use new language
      this.destroy();
    }
  }

  /**
   * Update target language
   */
  setTargetLanguage(language: string): void {
    if (this.targetLanguage !== language) {
      this.targetLanguage = language;
      // Reset session to use new language
      this.destroy();
    }
  }

  /**
   * Get current language configuration
   */
  getLanguages(): { source: string; target: string } {
    return {
      source: this.sourceLanguage,
      target: this.targetLanguage
    };
  }

  /**
   * Cancel ongoing operations
   */
  cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.cancel();
    
    if (this.session) {
      this.session.destroy();
      this.session = null;
    }

    this.dispatchEvent('destroyed', {});
  }

  /**
   * Get translator capabilities
   */
  async getCapabilities() {
    try {
      // Use the same API detection as the working React components
      if (!('Translator' in self)) {
        return null;
      }

      return await (self as any).Translator.capabilities();
    } catch (error) {
      return null;
    }
  }
}

export default WebAITranslator;
