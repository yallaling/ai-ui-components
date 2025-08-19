import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { WebAITranslator } from '@yallaling/web-ai-core';

/**
 * Universal AI Translator Web Component
 * Built with Lit for maximum framework compatibility
 */
@customElement('ai-translator-element')
export class AITranslatorElement extends LitElement {
  // Public properties
  @property({ attribute: 'source-language' })
  sourceLanguage = 'auto';

  @property({ attribute: 'target-language' })
  targetLanguage = 'en';

  @property({ type: Boolean, attribute: 'auto-translate' })
  autoTranslate = false;

  @property({ type: Boolean, attribute: 'show-input' })
  showInput = true;

  @property({ type: Boolean, attribute: 'show-controls' })
  showControls = true;

  @property({ type: Boolean, attribute: 'show-output' })
  showOutput = true;

  @property({ type: Boolean, attribute: 'controls-only' })
  controlsOnly = false;

  @property({ type: Boolean })
  streaming = false;

  @property({ type: Boolean })
  resizable = true;

  @property({ type: Boolean, attribute: 'allow-copy' })
  allowCopy = true;

  @property({ type: Boolean, attribute: 'allow-download' })
  allowDownload = true;

  @property()
  placeholder = 'Enter text to translate...';

  @property({ type: Number, attribute: 'max-length' })
  maxLength = 5000;

  @property({ attribute: 'download-filename' })
  downloadFileName = 'translation.md';

  @property()
  text = '';

  @property({ attribute: 'external-text' })
  externalText = '';

  // Internal state
  @state()
  private inputText = '';

  @state()
  private translatedText = '';

  @state()
  private isLoading = false;

  @state()
  private error = '';

  @state()
  private isSupported = false;

  private translator: WebAITranslator | null = null;

  static styles = css`
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

  private async checkSupport() {
    if (!this.translator) return;
    this.isSupported = await this.translator.isSupported();
  }

  private initializeTranslator() {
    this.translator = new WebAITranslator(this.sourceLanguage, this.targetLanguage);

    // Set up event listeners
    this.translator.addEventListener('translation-start', () => {
      this.isLoading = true;
      this.error = '';
    });

    this.translator.addEventListener('translation-complete', (event: any) => {
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

    this.translator.addEventListener('error', (event: any) => {
      this.error = event.detail.error;
      this.isLoading = false;
      
      // Dispatch React-compatible event
      this.dispatchEvent(new CustomEvent('translation-error', {
        detail: { error: event.detail.error },
        bubbles: true
      }));
    });

    this.translator.addEventListener('progress', (event: any) => {
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

  private cleanup() {
    if (this.translator) {
      this.translator.destroy();
      this.translator = null;
    }
  }

  private async handleTranslate() {
    if (!this.translator) return;

    const textToTranslate = this.externalText || this.inputText || this.text;
    if (!textToTranslate.trim()) {
      this.error = 'Please enter text to translate';
      return;
    }

    try {
      await this.translator.translate(textToTranslate);
    } catch (error) {
      console.error('Translation failed:', error);
    }
  }

  private handleExternalTranslation = () => {
    this.handleTranslate();
  };

  private handleInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.inputText = target.value;

    if (this.autoTranslate && this.inputText.trim()) {
      // Debounce auto-translation
      clearTimeout(this.autoTranslateTimeout);
      this.autoTranslateTimeout = setTimeout(() => {
        this.handleTranslate();
      }, 500);
    }
  }

  private autoTranslateTimeout: any;

  private handleLanguageChange() {
    if (this.translator) {
      this.translator.setSourceLanguage(this.sourceLanguage);
      this.translator.setTargetLanguage(this.targetLanguage);
    }
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('sourceLanguage') || changedProperties.has('targetLanguage')) {
      this.handleLanguageChange();
    }

    if (changedProperties.has('externalText') && this.externalText && this.autoTranslate) {
      this.handleTranslate();
    }
  }

  render() {
    if (this.controlsOnly) {
      return html`
        <div class="translator-container">
          ${this.showControls ? this.renderControls() : ''}
          ${this.error ? html`<div class="error">${this.error}</div>` : ''}
          ${this.isLoading ? html`<div class="loading">Translating...</div>` : ''}
        </div>
      `;
    }

    return html`
      <div class="translator-container">
        ${this.showInput ? this.renderInput() : ''}
        ${this.showControls ? this.renderControls() : ''}
        ${this.showOutput ? this.renderOutput() : ''}
        ${this.error ? html`<div class="error">${this.error}</div>` : ''}
      </div>
    `;
  }

  private renderInput() {
    return html`
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

  private renderControls() {
    return html`
      <div class="controls-section">
        <select
          .value=${this.sourceLanguage}
          @change=${(e: Event) => {
            this.sourceLanguage = (e.target as HTMLSelectElement).value;
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
          @change=${(e: Event) => {
            this.targetLanguage = (e.target as HTMLSelectElement).value;
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

  private renderOutput() {
    return html`
      <div class="output-section">
        <div class="output-text">
          ${this.translatedText || (this.isLoading ? 'Translating...' : 'Translation will appear here')}
        </div>
        ${this.translatedText && this.allowCopy ? html`
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

  private async handleCopy() {
    if (this.translatedText) {
      try {
        await navigator.clipboard.writeText(this.translatedText);
        // Could add a toast notification here
      } catch (error) {
        console.error('Failed to copy text:', error);
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ai-translator-element': AITranslatorElement;
  }
}
