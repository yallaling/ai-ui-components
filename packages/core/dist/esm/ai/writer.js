export class WebAIWriter extends EventTarget {
    constructor() {
        super();
        this.session = null;
        this.capabilities = null;
    }
    async initialize() {
        try {
            // Use the same API detection as the working React components
            if (!('Writer' in self)) {
                throw new Error('Chrome AI Writer API not available');
            }
            // Use availability() method like in working React components
            const availabilityResult = await self.Writer.availability();
            this.capabilities = { available: availabilityResult };
            if (availabilityResult === 'no') {
                throw new Error('Chrome AI Writer not available on this device');
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
                tone: options.tone,
                format: options.format,
                length: options.length
            };
            this.session = await self.Writer.create(sessionOptions);
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
    async write(prompt, context, options = {}) {
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
            const result = {
                content,
                wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
                characterCount: content.length
            };
            this.dispatchEvent(new CustomEvent('writingCompleted', {
                detail: result
            }));
            return result;
        }
        catch (error) {
            this.dispatchEvent(new CustomEvent('error', {
                detail: { error: error instanceof Error ? error.message : 'Writing failed' }
            }));
            throw error;
        }
    }
    async writeStreaming(prompt, context, options = {}) {
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
                            if (done)
                                break;
                            self.dispatchEvent(new CustomEvent('streamingChunk', {
                                detail: { chunk: value }
                            }));
                            controller.enqueue(value);
                        }
                        controller.close();
                        self.dispatchEvent(new CustomEvent('streamingCompleted'));
                    }
                    catch (error) {
                        controller.error(error);
                        self.dispatchEvent(new CustomEvent('error', {
                            detail: { error: error instanceof Error ? error.message : 'Streaming failed' }
                        }));
                    }
                    finally {
                        reader.releaseLock();
                    }
                }
            });
        }
        catch (error) {
            this.dispatchEvent(new CustomEvent('error', {
                detail: { error: error instanceof Error ? error.message : 'Streaming setup failed' }
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
    getSupportedTones() {
        return this.capabilities?.tones || [];
    }
    getSupportedFormats() {
        return this.capabilities?.formats || [];
    }
    getSupportedLengths() {
        return this.capabilities?.lengths || ['short', 'medium', 'long'];
    }
}
//# sourceMappingURL=writer.js.map