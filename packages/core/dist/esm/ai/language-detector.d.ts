import { AILanguageDetectorCapabilities, AILanguageDetectorOptions, AILanguageDetection } from '../types/web-ai';
export interface LanguageDetectorResult extends AILanguageDetection {
    detectedLanguage: string;
    confidence: number;
}
export declare class WebAILanguageDetector extends EventTarget {
    private session;
    private capabilities;
    constructor();
    initialize(): Promise<void>;
    createSession(options?: AILanguageDetectorOptions): Promise<void>;
    detect(text: string): Promise<LanguageDetectorResult[]>;
    destroy(): Promise<void>;
    isAvailable(): boolean;
    needsDownload(): boolean;
    getCapabilities(): AILanguageDetectorCapabilities | null;
    getSupportedLanguages(): string[];
}
//# sourceMappingURL=language-detector.d.ts.map