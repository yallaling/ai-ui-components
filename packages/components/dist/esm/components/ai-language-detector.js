var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { WebAILanguageDetector } from '@yallaling/web-ai-core';
let AILanguageDetectorElement = class AILanguageDetectorElement extends LitElement {
    constructor() {
        super();
        this.text = '';
        this.isLoading = false;
        this.results = [];
        this.error = null;
        this.isInitialized = false;
        this.detector = new WebAILanguageDetector();
        this.setupEventListeners();
    }
    connectedCallback() {
        super.connectedCallback();
        this.initializeDetector();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.detector.destroy();
    }
    setupEventListeners() {
        this.detector.addEventListener('initialized', () => {
            this.isInitialized = true;
            this.error = null;
            this.requestUpdate();
        });
        this.detector.addEventListener('error', (event) => {
            this.error = event.detail.error;
            this.isLoading = false;
            this.requestUpdate();
        });
        this.detector.addEventListener('detectionCompleted', (event) => {
            this.results = event.detail.detections;
            this.isLoading = false;
            this.requestUpdate();
            // Dispatch custom event for parent components
            this.dispatchEvent(new CustomEvent('detection-complete', {
                detail: event.detail.detections,
                bubbles: true
            }));
        });
    }
    async initializeDetector() {
        try {
            await this.detector.initialize();
        }
        catch (error) {
            console.error('Failed to initialize language detector:', error);
        }
    }
    async handleDetect() {
        if (!this.text.trim()) {
            this.error = 'Please enter some text to detect language';
            return;
        }
        this.isLoading = true;
        this.error = null;
        this.results = [];
        try {
            const detections = await this.detector.detect(this.text);
            this.results = detections;
        }
        catch (error) {
            this.error = error instanceof Error ? error.message : 'Language detection failed';
        }
        finally {
            this.isLoading = false;
        }
    }
    handleTextInput(e) {
        const target = e.target;
        this.text = target.value;
        // Dispatch input event for parent components
        this.dispatchEvent(new CustomEvent('text-input', {
            detail: { text: this.text },
            bubbles: true
        }));
    }
    getConfidenceClass(confidence) {
        if (confidence >= 0.8)
            return 'high';
        if (confidence >= 0.5)
            return 'medium';
        return 'low';
    }
    formatConfidence(confidence) {
        return `${Math.round(confidence * 100)}%`;
    }
    formatLanguageName(code) {
        // Convert language codes to readable names
        const languageNames = {
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ru': 'Russian',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh': 'Chinese',
            'ar': 'Arabic',
            'hi': 'Hindi',
            'th': 'Thai',
            'vi': 'Vietnamese',
            'tr': 'Turkish',
            'pl': 'Polish',
            'nl': 'Dutch',
            'sv': 'Swedish',
            'da': 'Danish',
            'no': 'Norwegian',
            'fi': 'Finnish'
        };
        return languageNames[code] || code.toUpperCase();
    }
    render() {
        return html `
      <div class="container">
        <div class="header">
          <div class="title">AI Language Detector</div>
        </div>

        <div class="status">
          <div class="status-indicator ${this.isLoading ? 'loading' : this.error ? 'error' : ''}"></div>
          <span>
            ${this.isLoading ? 'Detecting language...' :
            this.error ? 'Error occurred' :
                this.isInitialized ? 'Ready to detect language' : 'Initializing...'}
          </span>
        </div>

        <div class="input-group">
          <label for="text-input">Text to Analyze</label>
          <textarea
            id="text-input"
            .value=${this.text}
            @input=${this.handleTextInput}
            placeholder="Enter text in any language to detect..."
          ></textarea>
        </div>

        <button 
          class="button" 
          @click=${this.handleDetect}
          .disabled=${!this.isInitialized || this.isLoading || !this.text.trim()}
        >
          ${this.isLoading ? 'Detecting...' : 'Detect Language'}
        </button>

        ${this.error ? html `
          <div class="error">${this.error}</div>
        ` : ''}

        ${this.results.length > 0 ? html `
          <div class="results">
            ${this.results.map(result => html `
              <div class="result-item">
                <div class="language">${this.formatLanguageName(result.detectedLanguage)}</div>
                <div class="confidence ${this.getConfidenceClass(result.confidence)}">
                  ${this.formatConfidence(result.confidence)}
                </div>
              </div>
            `)}
          </div>
        ` : this.isLoading ? '' : this.text && !this.error ? html `
          <div class="no-results">No language detected</div>
        ` : ''}
      </div>
    `;
    }
};
AILanguageDetectorElement.styles = css `
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 500px;
    }

    .container {
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #ffffff;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }

    .title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }

    label {
      font-size: 14px;
      font-weight: 500;
      color: #555;
    }

    textarea {
      width: 100%;
      min-height: 100px;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
    }

    textarea:focus {
      outline: none;
      border-color: #4285f4;
      box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.1);
    }

    .button {
      background: #4285f4;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
      margin-bottom: 16px;
    }

    .button:hover:not(:disabled) {
      background: #3367d6;
    }

    .button:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }

    .results {
      margin-top: 16px;
    }

    .result-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      margin-bottom: 8px;
      background: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #e8eaed;
    }

    .language {
      font-weight: 500;
      color: #333;
      font-size: 14px;
    }

    .confidence {
      font-size: 12px;
      color: #666;
      background: #e8f0fe;
      padding: 4px 8px;
      border-radius: 12px;
    }

    .confidence.high {
      background: #e8f5e8;
      color: #137333;
    }

    .confidence.medium {
      background: #fef7e0;
      color: #b06000;
    }

    .confidence.low {
      background: #fce8e6;
      color: #d93025;
    }

    .error {
      color: #d93025;
      font-size: 14px;
      margin-top: 8px;
    }

    .status {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 14px;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #34a853;
    }

    .status-indicator.loading {
      background: #fbbc05;
      animation: pulse 1s infinite;
    }

    .status-indicator.error {
      background: #ea4335;
    }

    .no-results {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 20px;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;
__decorate([
    property()
], AILanguageDetectorElement.prototype, "text", void 0);
__decorate([
    state()
], AILanguageDetectorElement.prototype, "isLoading", void 0);
__decorate([
    state()
], AILanguageDetectorElement.prototype, "results", void 0);
__decorate([
    state()
], AILanguageDetectorElement.prototype, "error", void 0);
__decorate([
    state()
], AILanguageDetectorElement.prototype, "isInitialized", void 0);
AILanguageDetectorElement = __decorate([
    customElement('ai-language-detector-element')
], AILanguageDetectorElement);
export { AILanguageDetectorElement };
//# sourceMappingURL=ai-language-detector.js.map