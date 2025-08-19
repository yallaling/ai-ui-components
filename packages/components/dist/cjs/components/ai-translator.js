"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AITranslatorElement = void 0;
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
const web_ai_core_1 = require("@yallaling/web-ai-core");
/**
 * Universal AI Translator Web Component
 * Built with Lit for maximum framework compatibility
 */
let AITranslatorElement = class AITranslatorElement extends lit_1.LitElement {
    constructor() {
        super(...arguments);
        // Public properties
        this.sourceLanguage = 'auto';
        this.targetLanguage = 'en';
        this.autoTranslate = false;
        this.showInput = true;
        this.showControls = true;
        this.showOutput = true;
        this.controlsOnly = false;
        this.streaming = false;
        this.resizable = true;
        this.allowCopy = true;
        this.allowDownload = true;
        this.placeholder = 'Enter text to translate...';
        this.maxLength = 5000;
        this.downloadFileName = 'translation.md';
        this.text = '';
        this.externalText = '';
        // Internal state
        this.inputText = '';
        this.translatedText = '';
        this.isLoading = false;
        this.error = '';
        this.isSupported = false;
        this.translator = null;
        this.handleExternalTranslation = () => {
            this.handleTranslate();
        };
    }
    connectedCallback() {
        super.connectedCallback();
        this.initializeTranslator();
        this.checkSupport();
        // Listen for external events
        this.addEventListener('trigger-translation', this.handleExternalTranslation);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.cleanup();
    }
    async checkSupport() {
        if (!this.translator)
            return;
        this.isSupported = await this.translator.isSupported();
    }
    initializeTranslator() {
        this.translator = new web_ai_core_1.WebAITranslator(this.sourceLanguage, this.targetLanguage);
        // Set up event listeners
        this.translator.addEventListener('translation-start', () => {
            this.isLoading = true;
            this.error = '';
        });
        this.translator.addEventListener('translation-complete', (event) => {
            this.translatedText = event.detail.translatedText;
            this.isLoading = false;
            // Dispatch React-compatible event
            this.dispatchEvent(new CustomEvent('translation-complete', {
                detail: {
                    translatedText: event.detail.translatedText,
                    originalText: event.detail.originalText,
                    sourceLanguage: event.detail.sourceLanguage,
                    targetLanguage: event.detail.targetLanguage
                },
                bubbles: true
            }));
        });
        this.translator.addEventListener('error', (event) => {
            this.error = event.detail.error;
            this.isLoading = false;
            // Dispatch React-compatible event
            this.dispatchEvent(new CustomEvent('translation-error', {
                detail: { error: event.detail.error },
                bubbles: true
            }));
        });
        this.translator.addEventListener('progress', (event) => {
            // Dispatch React-compatible event
            this.dispatchEvent(new CustomEvent('translation-progress', {
                detail: {
                    loaded: event.detail.loaded,
                    total: event.detail.total
                },
                bubbles: true
            }));
        });
    }
    cleanup() {
        if (this.translator) {
            this.translator.destroy();
            this.translator = null;
        }
    }
    async handleTranslate() {
        if (!this.translator)
            return;
        const textToTranslate = this.externalText || this.inputText || this.text;
        if (!textToTranslate.trim()) {
            this.error = 'Please enter text to translate';
            return;
        }
        try {
            await this.translator.translate(textToTranslate);
        }
        catch (error) {
            console.error('Translation failed:', error);
        }
    }
    handleInputChange(event) {
        const target = event.target;
        this.inputText = target.value;
        if (this.autoTranslate && this.inputText.trim()) {
            // Debounce auto-translation
            clearTimeout(this.autoTranslateTimeout);
            this.autoTranslateTimeout = setTimeout(() => {
                this.handleTranslate();
            }, 500);
        }
    }
    handleLanguageChange() {
        if (this.translator) {
            this.translator.setSourceLanguage(this.sourceLanguage);
            this.translator.setTargetLanguage(this.targetLanguage);
        }
    }
    updated(changedProperties) {
        if (changedProperties.has('sourceLanguage') || changedProperties.has('targetLanguage')) {
            this.handleLanguageChange();
        }
        if (changedProperties.has('externalText') && this.externalText && this.autoTranslate) {
            this.handleTranslate();
        }
    }
    render() {
        if (this.controlsOnly) {
            return (0, lit_1.html) `
        <div class="translator-container">
          ${this.showControls ? this.renderControls() : ''}
          ${this.error ? (0, lit_1.html) `<div class="error">${this.error}</div>` : ''}
          ${this.isLoading ? (0, lit_1.html) `<div class="loading">Translating...</div>` : ''}
        </div>
      `;
        }
        return (0, lit_1.html) `
      <div class="translator-container">
        ${this.showInput ? this.renderInput() : ''}
        ${this.showControls ? this.renderControls() : ''}
        ${this.showOutput ? this.renderOutput() : ''}
        ${this.error ? (0, lit_1.html) `<div class="error">${this.error}</div>` : ''}
      </div>
    `;
    }
    renderInput() {
        return (0, lit_1.html) `
      <div class="input-section">
        <textarea
          .value=${this.inputText}
          @input=${this.handleInputChange}
          placeholder=${this.placeholder}
          maxlength=${this.maxLength}
        ></textarea>
      </div>
    `;
    }
    renderControls() {
        return (0, lit_1.html) `
      <div class="controls-section">
        <select
          .value=${this.sourceLanguage}
          @change=${(e) => {
            this.sourceLanguage = e.target.value;
        }}
        >
          <option value="auto">Auto-detect</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="pt">Portuguese</option>
          <option value="ru">Russian</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
          <option value="zh">Chinese</option>
        </select>
        
        <span>→</span>
        
        <select
          .value=${this.targetLanguage}
          @change=${(e) => {
            this.targetLanguage = e.target.value;
        }}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="pt">Portuguese</option>
          <option value="ru">Russian</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
          <option value="zh">Chinese</option>
        </select>

        <button
          @click=${this.handleTranslate}
          ?disabled=${this.isLoading || !this.isSupported}
        >
          ${this.isLoading ? 'Translating...' : 'Translate'}
        </button>
      </div>
    `;
    }
    renderOutput() {
        return (0, lit_1.html) `
      <div class="output-section">
        <div class="output-text">
          ${this.translatedText || (this.isLoading ? 'Translating...' : 'Translation will appear here')}
        </div>
        ${this.translatedText && this.allowCopy ? (0, lit_1.html) `
          <button
            class="secondary-button"
            @click=${this.handleCopy}
          >
            Copy Translation
          </button>
        ` : ''}
      </div>
    `;
    }
    async handleCopy() {
        if (this.translatedText) {
            try {
                await navigator.clipboard.writeText(this.translatedText);
                // Could add a toast notification here
            }
            catch (error) {
                console.error('Failed to copy text:', error);
            }
        }
    }
};
exports.AITranslatorElement = AITranslatorElement;
AITranslatorElement.styles = (0, lit_1.css) `
    :host {
      display: block;
      font-family: system-ui, -apple-system, sans-serif;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      background: white;
      --primary-color: #007bff;
      --error-color: #dc3545;
      --success-color: #28a745;
    }

    .translator-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .input-section, .output-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .controls-section {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }

    textarea {
      width: 100%;
      min-height: 100px;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: inherit;
      font-size: 14px;
      resize: vertical;
    }

    textarea:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .output-text {
      min-height: 100px;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: #f8f9fa;
      white-space: pre-wrap;
      font-size: 14px;
    }

    button {
      padding: 8px 16px;
      border: 1px solid var(--primary-color);
      border-radius: 4px;
      background: var(--primary-color);
      color: white;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }

    button:hover:not(:disabled) {
      background: #0056b3;
      border-color: #0056b3;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .secondary-button {
      background: transparent;
      color: var(--primary-color);
    }

    .secondary-button:hover:not(:disabled) {
      background: var(--primary-color);
      color: white;
    }

    select {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .error {
      color: var(--error-color);
      font-size: 14px;
      padding: 8px;
      background: #f8d7da;
      border-radius: 4px;
    }

    .loading {
      color: var(--primary-color);
      font-size: 14px;
      padding: 8px;
    }

    .hidden {
      display: none;
    }

    @media (max-width: 768px) {
      .controls-section {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `;
__decorate([
    (0, decorators_js_1.property)({ attribute: 'source-language' })
], AITranslatorElement.prototype, "sourceLanguage", void 0);
__decorate([
    (0, decorators_js_1.property)({ attribute: 'target-language' })
], AITranslatorElement.prototype, "targetLanguage", void 0);
__decorate([
    (0, decorators_js_1.property)({ type: Boolean, attribute: 'auto-translate' })
], AITranslatorElement.prototype, "autoTranslate", void 0);
__decorate([
    (0, decorators_js_1.property)({ type: Boolean, attribute: 'show-input' })
], AITranslatorElement.prototype, "showInput", void 0);
__decorate([
    (0, decorators_js_1.property)({ type: Boolean, attribute: 'show-controls' })
], AITranslatorElement.prototype, "showControls", void 0);
__decorate([
    (0, decorators_js_1.property)({ type: Boolean, attribute: 'show-output' })
], AITranslatorElement.prototype, "showOutput", void 0);
__decorate([
    (0, decorators_js_1.property)({ type: Boolean, attribute: 'controls-only' })
], AITranslatorElement.prototype, "controlsOnly", void 0);
__decorate([
    (0, decorators_js_1.property)({ type: Boolean })
], AITranslatorElement.prototype, "streaming", void 0);
__decorate([
    (0, decorators_js_1.property)({ type: Boolean })
], AITranslatorElement.prototype, "resizable", void 0);
__decorate([
    (0, decorators_js_1.property)({ type: Boolean, attribute: 'allow-copy' })
], AITranslatorElement.prototype, "allowCopy", void 0);
__decorate([
    (0, decorators_js_1.property)({ type: Boolean, attribute: 'allow-download' })
], AITranslatorElement.prototype, "allowDownload", void 0);
__decorate([
    (0, decorators_js_1.property)()
], AITranslatorElement.prototype, "placeholder", void 0);
__decorate([
    (0, decorators_js_1.property)({ type: Number, attribute: 'max-length' })
], AITranslatorElement.prototype, "maxLength", void 0);
__decorate([
    (0, decorators_js_1.property)({ attribute: 'download-filename' })
], AITranslatorElement.prototype, "downloadFileName", void 0);
__decorate([
    (0, decorators_js_1.property)()
], AITranslatorElement.prototype, "text", void 0);
__decorate([
    (0, decorators_js_1.property)({ attribute: 'external-text' })
], AITranslatorElement.prototype, "externalText", void 0);
__decorate([
    (0, decorators_js_1.state)()
], AITranslatorElement.prototype, "inputText", void 0);
__decorate([
    (0, decorators_js_1.state)()
], AITranslatorElement.prototype, "translatedText", void 0);
__decorate([
    (0, decorators_js_1.state)()
], AITranslatorElement.prototype, "isLoading", void 0);
__decorate([
    (0, decorators_js_1.state)()
], AITranslatorElement.prototype, "error", void 0);
__decorate([
    (0, decorators_js_1.state)()
], AITranslatorElement.prototype, "isSupported", void 0);
exports.AITranslatorElement = AITranslatorElement = __decorate([
    (0, decorators_js_1.customElement)('ai-translator-element')
], AITranslatorElement);
//# sourceMappingURL=ai-translator.js.map