"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIWriterElement = void 0;
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
const web_ai_core_1 = require("@yallaling/web-ai-core");
let AIWriterElement = class AIWriterElement extends lit_1.LitElement {
    constructor() {
        super();
        this.prompt = '';
        this.context = '';
        this.tone = 'casual';
        this.format = 'plain-text';
        this.length = 'medium';
        this.isLoading = false;
        this.result = null;
        this.error = null;
        this.isInitialized = false;
        this.availableTones = [];
        this.availableFormats = [];
        this.writer = new web_ai_core_1.WebAIWriter();
        this.setupEventListeners();
    }
    connectedCallback() {
        super.connectedCallback();
        this.initializeWriter();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.writer.destroy();
    }
    setupEventListeners() {
        this.writer.addEventListener('initialized', (event) => {
            this.isInitialized = true;
            this.error = null;
            // Get available options from capabilities - use valid Chrome AI format values
            const caps = this.writer.getCapabilities();
            this.availableTones = (caps === null || caps === void 0 ? void 0 : caps.tones) || ['formal', 'casual'];
            this.availableFormats = (caps === null || caps === void 0 ? void 0 : caps.formats) || ['plain-text', 'markdown'];
            this.requestUpdate();
        });
        this.writer.addEventListener('error', (event) => {
            this.error = event.detail.error;
            this.isLoading = false;
            this.requestUpdate();
        });
        this.writer.addEventListener('writingCompleted', (event) => {
            this.result = event.detail;
            this.isLoading = false;
            this.requestUpdate();
            // Dispatch custom event for parent components
            this.dispatchEvent(new CustomEvent('writing-complete', {
                detail: event.detail,
                bubbles: true
            }));
        });
    }
    async initializeWriter() {
        try {
            await this.writer.initialize();
        }
        catch (error) {
            console.error('Failed to initialize writer:', error);
        }
    }
    async handleWrite() {
        if (!this.prompt.trim()) {
            this.error = 'Please enter a writing prompt';
            return;
        }
        // Ensure we have valid values
        const validTone = ['formal', 'casual'].includes(this.tone) ? this.tone : 'casual';
        const validFormat = ['plain-text', 'markdown'].includes(this.format) ? this.format : 'plain-text';
        this.isLoading = true;
        this.error = null;
        this.result = null;
        try {
            const result = await this.writer.write(this.prompt, this.context || undefined, {
                tone: validTone,
                format: validFormat,
                length: this.length
            });
            this.result = result;
        }
        catch (error) {
            this.error = error instanceof Error ? error.message : 'Writing failed';
        }
        finally {
            this.isLoading = false;
        }
    }
    handlePromptInput(e) {
        const target = e.target;
        this.prompt = target.value;
    }
    handleContextInput(e) {
        const target = e.target;
        this.context = target.value;
    }
    handleToneChange(e) {
        const target = e.target;
        const newTone = target.value;
        console.log('Tone changed to:', newTone);
        this.tone = newTone;
        this.requestUpdate();
    }
    handleFormatChange(e) {
        const target = e.target;
        const newFormat = target.value;
        console.log('Format changed to:', newFormat);
        this.format = newFormat;
        this.requestUpdate();
    }
    handleLengthChange(e) {
        const target = e.target;
        this.length = target.value;
    }
    render() {
        return (0, lit_1.html) `
      <div class="container">
        <div class="header">
          <div class="title">AI Content Writer</div>
        </div>

        <div class="status">
          <div class="status-indicator ${this.isLoading ? 'loading' : this.error ? 'error' : ''}"></div>
          <span>
            ${this.isLoading ? 'Writing content...' :
            this.error ? 'Error occurred' :
                this.isInitialized ? 'Ready to write' : 'Initializing...'}
          </span>
        </div>

        <div class="input-group">
          <label for="prompt-input">Writing Prompt *</label>
          <textarea
            id="prompt-input"
            .value=${this.prompt}
            @input=${this.handlePromptInput}
            placeholder="Describe what you want to write about..."
          ></textarea>
        </div>

        <div class="input-group">
          <label for="context-input">Additional Context (Optional)</label>
          <textarea
            id="context-input"
            .value=${this.context}
            @input=${this.handleContextInput}
            placeholder="Provide any additional context or requirements..."
          ></textarea>
        </div>

        <div class="controls">
          <div class="input-group">
            <label for="tone-select">Tone</label>
            <select id="tone-select" .value=${this.tone} @change=${this.handleToneChange}>
              <option value="formal" ?selected=${this.tone === 'formal'}>Formal</option>
              <option value="casual" ?selected=${this.tone === 'casual'}>Casual</option>
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
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
        </div>

        <button 
          class="button" 
          @click=${this.handleWrite}
          .disabled=${!this.isInitialized || this.isLoading || !this.prompt.trim()}
        >
          ${this.isLoading ? 'Writing...' : 'Generate Content'}
        </button>

        ${this.error ? (0, lit_1.html) `
          <div class="error">${this.error}</div>
        ` : ''}

        ${this.result ? (0, lit_1.html) `
          <div class="output">
            <div class="output-label">Generated Content</div>
            <div class="output-content">${this.result.content}</div>
            <div class="stats">
              <div class="stat">
                <span>Words:</span>
                <span>${this.result.wordCount}</span>
              </div>
              <div class="stat">
                <span>Characters:</span>
                <span>${this.result.characterCount}</span>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
    }
};
exports.AIWriterElement = AIWriterElement;
AIWriterElement.styles = (0, lit_1.css) `
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

    label {
      font-size: 14px;
      font-weight: 500;
      color: #555;
    }

    input, textarea, select {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
    }

    textarea {
      min-height: 80px;
      resize: vertical;
    }

    input:focus, textarea:focus, select:focus {
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

    .output {
      margin-top: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #e8eaed;
    }

    .output-label {
      font-size: 14px;
      font-weight: 500;
      color: #555;
      margin-bottom: 8px;
    }

    .output-content {
      font-size: 14px;
      line-height: 1.6;
      color: #333;
      white-space: pre-wrap;
      background: white;
      padding: 12px;
      border-radius: 4px;
      border: 1px solid #e0e0e0;
    }

    .stats {
      display: flex;
      gap: 16px;
      margin-top: 12px;
      font-size: 12px;
      color: #666;
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

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;
__decorate([
    (0, decorators_js_1.property)()
], AIWriterElement.prototype, "prompt", void 0);
__decorate([
    (0, decorators_js_1.property)()
], AIWriterElement.prototype, "context", void 0);
__decorate([
    (0, decorators_js_1.property)()
], AIWriterElement.prototype, "tone", void 0);
__decorate([
    (0, decorators_js_1.property)()
], AIWriterElement.prototype, "format", void 0);
__decorate([
    (0, decorators_js_1.property)()
], AIWriterElement.prototype, "length", void 0);
__decorate([
    (0, decorators_js_1.state)()
], AIWriterElement.prototype, "isLoading", void 0);
__decorate([
    (0, decorators_js_1.state)()
], AIWriterElement.prototype, "result", void 0);
__decorate([
    (0, decorators_js_1.state)()
], AIWriterElement.prototype, "error", void 0);
__decorate([
    (0, decorators_js_1.state)()
], AIWriterElement.prototype, "isInitialized", void 0);
__decorate([
    (0, decorators_js_1.state)()
], AIWriterElement.prototype, "availableTones", void 0);
__decorate([
    (0, decorators_js_1.state)()
], AIWriterElement.prototype, "availableFormats", void 0);
exports.AIWriterElement = AIWriterElement = __decorate([
    (0, decorators_js_1.customElement)('ai-writer-element')
], AIWriterElement);
//# sourceMappingURL=ai-writer.js.map