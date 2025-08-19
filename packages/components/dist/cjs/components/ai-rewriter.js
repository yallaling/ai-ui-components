"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIRewriterElement = void 0;
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
const web_ai_core_1 = require("@yallaling/web-ai-core");
let AIRewriterElement = class AIRewriterElement extends lit_1.LitElement {
    constructor() {
        super();
        this.text = '';
        this.context = '';
        this.tone = 'as-is';
        this.format = 'plain-text';
        this.length = 'as-is';
        this.isLoading = false;
        this.result = null;
        this.error = null;
        this.isInitialized = false;
        this.availableTones = [];
        this.availableFormats = [];
        this.rewriter = new web_ai_core_1.WebAIRewriter();
        this.setupEventListeners();
    }
    connectedCallback() {
        super.connectedCallback();
        this.initializeRewriter();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.rewriter.destroy();
    }
    setupEventListeners() {
        this.rewriter.addEventListener('initialized', (event) => {
            this.isInitialized = true;
            this.error = null;
            // Get available options from capabilities - use valid Chrome AI format values
            const caps = this.rewriter.getCapabilities();
            this.availableTones = (caps === null || caps === void 0 ? void 0 : caps.tones) || ['formal', 'casual'];
            this.availableFormats = (caps === null || caps === void 0 ? void 0 : caps.formats) || ['plain-text', 'markdown'];
            this.requestUpdate();
        });
        this.rewriter.addEventListener('error', (event) => {
            this.error = event.detail.error;
            this.isLoading = false;
            this.requestUpdate();
        });
        this.rewriter.addEventListener('rewritingCompleted', (event) => {
            this.result = event.detail;
            this.isLoading = false;
            this.requestUpdate();
            // Dispatch custom event for parent components
            this.dispatchEvent(new CustomEvent('rewriting-complete', {
                detail: event.detail,
                bubbles: true
            }));
        });
    }
    async initializeRewriter() {
        try {
            await this.rewriter.initialize();
        }
        catch (error) {
            console.error('Failed to initialize rewriter:', error);
        }
    }
    async handleRewrite() {
        if (!this.text.trim()) {
            this.error = 'Please enter some text to rewrite';
            return;
        }
        // Ensure we have valid values for rewriter
        const validTone = ['as-is', 'more-formal', 'more-casual'].includes(this.tone) ? this.tone : 'as-is';
        const validFormat = ['plain-text', 'markdown'].includes(this.format) ? this.format : 'plain-text';
        const validLength = ['shorter', 'as-is', 'longer'].includes(this.length) ? this.length : 'as-is';
        this.isLoading = true;
        this.error = null;
        this.result = null;
        try {
            const result = await this.rewriter.rewrite(this.text, this.context || undefined, {
                tone: validTone,
                format: validFormat,
                length: validLength
            });
            this.result = result;
        }
        catch (error) {
            this.error = error instanceof Error ? error.message : 'Rewriting failed';
        }
        finally {
            this.isLoading = false;
        }
    }
    handleTextInput(e) {
        const target = e.target;
        this.text = target.value;
    }
    handleContextInput(e) {
        const target = e.target;
        this.context = target.value;
    }
    handleToneChange(e) {
        const target = e.target;
        const newTone = target.value;
        console.log('Rewriter tone changed to:', newTone);
        this.tone = newTone;
        this.requestUpdate();
    }
    handleFormatChange(e) {
        const target = e.target;
        const newFormat = target.value;
        console.log('Rewriter format changed to:', newFormat);
        this.format = newFormat;
        this.requestUpdate();
    }
    handleLengthChange(e) {
        const target = e.target;
        const newLength = target.value;
        console.log('Rewriter length changed to:', newLength);
        this.length = newLength;
        this.requestUpdate();
    }
    render() {
        return (0, lit_1.html) `
      <div class="container">
        <div class="header">
          <div class="title">AI Text Rewriter</div>
        </div>

        <div class="status">
          <div class="status-indicator ${this.isLoading ? 'loading' : this.error ? 'error' : ''}"></div>
          <span>
            ${this.isLoading ? 'Rewriting text...' :
            this.error ? 'Error occurred' :
                this.isInitialized ? 'Ready to rewrite' : 'Initializing...'}
          </span>
        </div>

        <div class="input-group full-width">
          <label for="text-input">Text to Rewrite *</label>
          <textarea
            id="text-input"
            .value=${this.text}
            @input=${this.handleTextInput}
            placeholder="Enter the text you want to rewrite..."
          ></textarea>
        </div>

        <div class="input-group full-width">
          <label for="context-input">Rewriting Instructions (Optional)</label>
          <textarea
            id="context-input"
            .value=${this.context}
            @input=${this.handleContextInput}
            placeholder="Specify how you want the text to be rewritten..."
          ></textarea>
        </div>

        <div class="controls">
          <div class="input-group">
            <label for="tone-select">Tone</label>
            <select id="tone-select" .value=${this.tone} @change=${this.handleToneChange}>
              <option value="as-is" ?selected=${this.tone === 'as-is'}>As-is</option>
              <option value="more-formal" ?selected=${this.tone === 'more-formal'}>More Formal</option>
              <option value="more-casual" ?selected=${this.tone === 'more-casual'}>More Casual</option>
            </select>
          </div>

          <div class="input-group">
            <label for="format-select">Format</label>
            <select id="format-select" .value=${this.format} @change=${this.handleFormatChange}>
              <option value="plain-text" ?selected=${this.format === 'plain-text'}>Plain Text</option>
              <option value="markdown" ?selected=${this.format === 'markdown'}>Markdown</option>
            </select>
          </div>

          <div class="input-group">
            <label for="length-select">Length</label>
            <select id="length-select" .value=${this.length} @change=${this.handleLengthChange}>
              <option value="shorter" ?selected=${this.length === 'shorter'}>Shorter</option>
              <option value="as-is" ?selected=${this.length === 'as-is'}>Same Length</option>
              <option value="longer" ?selected=${this.length === 'longer'}>Longer</option>
            </select>
          </div>
        </div>

        <button 
          class="button" 
          @click=${this.handleRewrite}
          .disabled=${!this.isInitialized || this.isLoading || !this.text.trim()}
        >
          ${this.isLoading ? 'Rewriting...' : 'Rewrite Text'}
        </button>

        ${this.error ? (0, lit_1.html) `
          <div class="error">${this.error}</div>
        ` : ''}

        ${this.result ? (0, lit_1.html) `
          <div class="comparison">
            <div class="comparison-item">
              <div class="comparison-label">Original Text</div>
              <div class="comparison-content">${this.text}</div>
            </div>
            
            <div class="comparison-item">
              <div class="comparison-label">Rewritten Text</div>
              <div class="comparison-content">${this.result.content}</div>
            </div>

            <div class="stats">
              <div class="stat">
                <span>Original:</span>
                <span>${this.result.originalLength} chars</span>
              </div>
              <div class="stat">
                <span>Rewritten:</span>
                <span>${this.result.rewrittenLength} chars</span>
              </div>
              <div class="stat">
                <span>Change:</span>
                <span>${this.result.changeRatio}%</span>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
    }
};
exports.AIRewriterElement = AIRewriterElement;
AIRewriterElement.styles = (0, lit_1.css) `
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 700px;
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

    .controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    label {
      font-size: 14px;
      font-weight: 500;
      color: #555;
    }

    textarea, select {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
    }

    textarea {
      min-height: 100px;
      resize: vertical;
    }

    textarea:focus, select:focus {
      outline: none;
      border-color: #4285f4;
      box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.1);
    }

    .button {
      background: #4285f4;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
      margin-top: 12px;
    }

    .button:hover:not(:disabled) {
      background: #3367d6;
    }

    .button:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }

    .comparison {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 20px;
    }

    .comparison-item {
      padding: 16px;
      background: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #e8eaed;
    }

    .comparison-label {
      font-size: 14px;
      font-weight: 500;
      color: #555;
      margin-bottom: 8px;
    }

    .comparison-content {
      font-size: 14px;
      line-height: 1.6;
      color: #333;
      white-space: pre-wrap;
      background: white;
      padding: 12px;
      border-radius: 4px;
      border: 1px solid #e0e0e0;
      min-height: 100px;
    }

    .stats {
      display: flex;
      gap: 16px;
      margin-top: 16px;
      font-size: 12px;
      color: #666;
      grid-column: 1 / -1;
      justify-content: center;
      padding: 12px;
      background: #f0f4ff;
      border-radius: 6px;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 4px;
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

    @media (max-width: 600px) {
      .comparison {
        grid-template-columns: 1fr;
      }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;
__decorate([
    (0, decorators_js_1.property)()
], AIRewriterElement.prototype, "text", void 0);
__decorate([
    (0, decorators_js_1.property)()
], AIRewriterElement.prototype, "context", void 0);
__decorate([
    (0, decorators_js_1.property)()
], AIRewriterElement.prototype, "tone", void 0);
__decorate([
    (0, decorators_js_1.property)()
], AIRewriterElement.prototype, "format", void 0);
__decorate([
    (0, decorators_js_1.property)()
], AIRewriterElement.prototype, "length", void 0);
__decorate([
    (0, decorators_js_1.state)()
], AIRewriterElement.prototype, "isLoading", void 0);
__decorate([
    (0, decorators_js_1.state)()
], AIRewriterElement.prototype, "result", void 0);
__decorate([
    (0, decorators_js_1.state)()
], AIRewriterElement.prototype, "error", void 0);
__decorate([
    (0, decorators_js_1.state)()
], AIRewriterElement.prototype, "isInitialized", void 0);
__decorate([
    (0, decorators_js_1.state)()
], AIRewriterElement.prototype, "availableTones", void 0);
__decorate([
    (0, decorators_js_1.state)()
], AIRewriterElement.prototype, "availableFormats", void 0);
exports.AIRewriterElement = AIRewriterElement = __decorate([
    (0, decorators_js_1.customElement)('ai-rewriter-element')
], AIRewriterElement);
//# sourceMappingURL=ai-rewriter.js.map