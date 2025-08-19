import { AILanguageDetectorCapabilities, AILanguageDetectorSession, AILanguageDetectorOptions, AILanguageDetection } from '../types/web-ai';

export interface LanguageDetectorResult extends AILanguageDetection {
  detectedLanguage: string;
  confidence: number;
}

export class WebAILanguageDetector extends EventTarget {
  private session: AILanguageDetectorSession | null = null;
  private capabilities: AILanguageDetectorCapabilities | null = null;

  constructor() {
    super();
  }

  async initialize(): Promise<void> {
    try {
      // Use the same API detection as the working React components
      if (!('LanguageDetector' in self)) {
        throw new Error('Chrome AI Language Detector API not available');
      }

      // Use availability() method like in working React components
      const availabilityResult = await (self as any).LanguageDetector.availability();
      this.capabilities = { available: availabilityResult };
      
      if (availabilityResult === 'no') {
        throw new Error('Chrome AI Language Detection not available on this device');
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

  async createSession(options: AILanguageDetectorOptions = {}): Promise<void> {
    try {
      if (!this.capabilities) {
        await this.initialize();
      }

      this.session = await (self as any).LanguageDetector.create(options);

      this.dispatchEvent(new CustomEvent('sessionCreated', {
        detail: { options }
      }));
    } catch (error) {
      this.dispatchEvent(new CustomEvent('error', {
        detail: { error: error instanceof Error ? error.message : 'Failed to create session' }
      }));
      throw error;
    }
  }

  async detect(text: string): Promise<LanguageDetectorResult[]> {
    try {
      if (!this.session) {
        await this.createSession();
      }

      if (!this.session) {
        throw new Error('Failed to create language detection session');
      }

      this.dispatchEvent(new CustomEvent('detectionStarted', {
        detail: { text }
      }));

      const detections = await this.session.detect(text);

      this.dispatchEvent(new CustomEvent('detectionCompleted', {
        detail: { detections }
      }));

      return detections;
    } catch (error) {
      this.dispatchEvent(new CustomEvent('error', {
        detail: { error: error instanceof Error ? error.message : 'Language detection failed' }
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

  getCapabilities(): AILanguageDetectorCapabilities | null {
    return this.capabilities;
  }

  getSupportedLanguages(): string[] {
    return this.capabilities?.languages || [];
  }
}
