export class WebAILanguageDetector extends EventTarget {
    constructor() {
        super();
        this.session = null;
        this.capabilities = null;
    }
    async initialize() {
        try {
            // Use the same API detection as the working React components
            if (!('LanguageDetector' in self)) {
                throw new Error('Chrome AI Language Detector API not available');
            }
            // Use availability() method like in working React components
            const availabilityResult = await self.LanguageDetector.availability();
            this.capabilities = { available: availabilityResult };
            if (availabilityResult === 'no') {
                throw new Error('Chrome AI Language Detection not available on this device');
            }
            this.dispatchEvent(new CustomEvent('initialized', {
                detail: { capabilities: this.capabilities }
            }));
        }
        catch (error) {
            this.dispatchEvent(new CustomEvent('error', {
                detail: { error: error instanceof Error ? error.message : 'Unknown error' }
            }));
            throw error;
        }
    }
    async createSession(options = {}) {
        try {
            if (!this.capabilities) {
                await this.initialize();
            }
            this.session = await self.LanguageDetector.create(options);
            this.dispatchEvent(new CustomEvent('sessionCreated', {
                detail: { options }
            }));
        }
        catch (error) {
            this.dispatchEvent(new CustomEvent('error', {
                detail: { error: error instanceof Error ? error.message : 'Failed to create session' }
            }));
            throw error;
        }
    }
    async detect(text) {
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
        }
        catch (error) {
            this.dispatchEvent(new CustomEvent('error', {
                detail: { error: error instanceof Error ? error.message : 'Language detection failed' }
            }));
            throw error;
        }
    }
    async destroy() {
        if (this.session) {
            await this.session.destroy();
            this.session = null;
            this.dispatchEvent(new CustomEvent('sessionDestroyed'));
        }
    }
    // Utility methods
    isAvailable() {
        return this.capabilities?.available === 'readily' || this.capabilities?.available === 'after-download';
    }
    needsDownload() {
        return this.capabilities?.available === 'after-download';
    }
    getCapabilities() {
        return this.capabilities;
    }
    getSupportedLanguages() {
        return this.capabilities?.languages || [];
    }
}
//# sourceMappingURL=language-detector.js.map