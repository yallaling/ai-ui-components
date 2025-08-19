/**
 * Core Web AI Translator class - Framework agnostic
 * Provides event-driven translation functionality
 */
export declare class WebAITranslator {
    private sourceLanguage;
    private targetLanguage;
    private session;
    private abortController;
    private eventTarget;
    constructor(sourceLanguage?: string, targetLanguage?: string);
    /**
     * Add event listener for translation events
     */
    addEventListener(type: string, listener: EventListener): void;
    /**
     * Remove event listener
     */
    removeEventListener(type: string, listener: EventListener): void;
    /**
     * Dispatch custom event
     */
    private dispatchEvent;
    /**
     * Check if Chrome AI Translator is available
     */
    isSupported(): Promise<boolean>;
    /**
     * Initialize translator session
     */
    initialize(): Promise<void>;
    /**
     * Translate text
     */
    translate(text: string): Promise<string>;
    /**
     * Update source language
     */
    setSourceLanguage(language: string): void;
    /**
     * Update target language
     */
    setTargetLanguage(language: string): void;
    /**
     * Get current language configuration
     */
    getLanguages(): {
        source: string;
        target: string;
    };
    /**
     * Cancel ongoing operations
     */
    cancel(): void;
    /**
     * Clean up resources
     */
    destroy(): void;
    /**
     * Get translator capabilities
     */
    getCapabilities(): Promise<any>;
}
export default WebAITranslator;
//# sourceMappingURL=translator.d.ts.map