export class WebAISummarizer extends EventTarget {
    constructor() {
        super();
        this.session = null;
        this.capabilities = null;
    }
    async initialize() {
        try {
            // Use the same API detection as the working React components
            if (!('Summarizer' in self)) {
                throw new Error('Chrome AI Summarization API not available');
            }
            // Use availability() method like in working React components
            const availabilityResult = await self.Summarizer.availability();
            this.capabilities = { available: availabilityResult };
            if (availabilityResult === 'no') {
                throw new Error('Chrome AI Summarization not available on this device');
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
            const sessionOptions = {
                type: options.type || 'tl;dr',
                format: options.format || 'markdown',
                length: options.length || 'medium'
            };
            this.session = await self.Summarizer.create(sessionOptions);
            this.dispatchEvent(new CustomEvent('sessionCreated', {
                detail: { options: sessionOptions }
            }));
        }
        catch (error) {
            this.dispatchEvent(new CustomEvent('error', {
                detail: { error: error instanceof Error ? error.message : 'Failed to create session' }
            }));
            throw error;
        }
    }
    async summarize(text, options = {}) {
        try {
            if (!this.session) {
                await this.createSession(options);
            }
            if (!this.session) {
                throw new Error('Failed to create summarization session');
            }
            this.dispatchEvent(new CustomEvent('summarizationStarted', {
                detail: { originalText: text, options }
            }));
            const summary = await this.session.summarize(text);
            const result = {
                summary,
                originalLength: text.length,
                summaryLength: summary.length,
                compressionRatio: Math.round((1 - summary.length / text.length) * 100)
            };
            this.dispatchEvent(new CustomEvent('summarizationCompleted', {
                detail: result
            }));
            return result;
        }
        catch (error) {
            this.dispatchEvent(new CustomEvent('error', {
                detail: { error: error instanceof Error ? error.message : 'Summarization failed' }
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
}
//# sourceMappingURL=summarizer.js.map