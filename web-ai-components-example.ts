// @yallaling/web-ai-components
// Lit Web Component implementation

import { LitElement, html, css, property, state } from 'lit';
import { customElement } from 'lit/decorators.js';
import { WebAITranslator, WebAITranslatorOptions } from '@yallaling/web-ai-core';

@customElement('ai-translator')
export class AITranslatorElement extends LitElement {
  // Public properties (attributes)
  @property({ attribute: 'source-language' }) sourceLanguage = 'en';
  @property({ attribute: 'target-language' }) targetLanguage = 'es';
  @property({ type: Boolean }) streaming = false;
  @property({ type: Boolean, attribute: 'auto-translate' }) autoTranslate = false;
  @property() placeholder = 'Enter text to translate...';
  @property({ type: Number, attribute: 'max-length' }) maxLength = 5000;

  // Internal state
  @state() private inputText = '';
  @state() private translatedText = '';
  @state() private isLoading = false;
  @state() private error = '';
  @state() private isAvailable = false;

  private translator = new WebAITranslator();

  static styles = css`
    :host {
      display: block;
      font-family: system-ui, sans-serif;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      background: white;
    }

    .translator {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .controls {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }

    .language-select {
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
    }

    .input-section, .output-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .textarea {
      min-height: 120px;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-family: inherit;
      font-size: 14px;
      resize: vertical;
    }

    .textarea:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .button {
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    }

    .button:hover:not(:disabled) {
      background: #0056b3;
    }

    .button:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .error {
      color: #dc3545;
      font-size: 14px;
      margin-top: 8px;
    }

    .loading {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #6c757d;
      font-size: 14px;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid #e0e0e0;
      border-top: 2px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .unavailable {
      text-align: center;
      padding: 24px;
      color: #6c757d;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this.checkAvailability();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.translator.destroy();
  }

  private async checkAvailability() {
    try {
      this.isAvailable = await this.translator.isAvailable();
    } catch (error) {
      this.error = `Failed to check availability: ${error}`;
    }
  }

  private async handleTranslate() {
    if (!this.inputText.trim() || this.isLoading) return;

    this.isLoading = true;
    this.error = '';
    this.translatedText = '';

    try {
      await this.translator.createSession({
        sourceLanguage: this.sourceLanguage,
        targetLanguage: this.targetLanguage,
        streaming: this.streaming,
      });

      if (this.streaming) {
        await this.translator.translate(this.inputText, (chunk) => {
          this.translatedText = chunk;
          this.dispatchEvent(new CustomEvent('streaming-chunk', {
            detail: { chunk },
            bubbles: true,
          }));
        });
      } else {
        this.translatedText = await this.translator.translate(this.inputText);
      }

      // Dispatch translation complete event
      this.dispatchEvent(new CustomEvent('translate', {
        detail: {
          originalText: this.inputText,
          translatedText: this.translatedText,
          sourceLanguage: this.sourceLanguage,
          targetLanguage: this.targetLanguage,
        },
        bubbles: true,
      }));

    } catch (error) {
      this.error = `Translation failed: ${error}`;
      this.dispatchEvent(new CustomEvent('error', {
        detail: { error: this.error },
        bubbles: true,
      }));
    } finally {
      this.isLoading = false;
    }
  }

  private handleInputChange(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.inputText = target.value;

    if (this.autoTranslate && this.inputText.trim()) {
      // Debounce auto-translation
      clearTimeout(this.autoTranslateTimeout);
      this.autoTranslateTimeout = setTimeout(() => {
        this.handleTranslate();
      }, 500);
    }
  }

  private autoTranslateTimeout: number | undefined;

  render() {
    if (!this.isAvailable) {
      return html`
        <div class="unavailable">
          <h3>Chrome AI Translation Unavailable</h3>
          <p>Please ensure you're using Chrome 138+ with AI flags enabled.</p>
        </div>
      `;
    }

    return html`
      <div class="translator">
        <div class="controls">
          <select 
            class="language-select" 
            .value=${this.sourceLanguage}
            @change=${(e: Event) => {
              const target = e.target as HTMLSelectElement;
              this.sourceLanguage = target.value;
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
          
          <span>→</span>
          
          <select 
            class="language-select"
            .value=${this.targetLanguage}
            @change=${(e: Event) => {
              const target = e.target as HTMLSelectElement;
              this.targetLanguage = target.value;
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
        </div>

        <div class="input-section">
          <label for="input-text">Text to translate:</label>
          <textarea
            id="input-text"
            class="textarea"
            .value=${this.inputText}
            @input=${this.handleInputChange}
            placeholder=${this.placeholder}
            maxlength=${this.maxLength}
            ?disabled=${this.isLoading}
          ></textarea>
        </div>

        <button 
          class="button" 
          @click=${this.handleTranslate}
          ?disabled=${!this.inputText.trim() || this.isLoading}
        >
          ${this.isLoading ? html`
            <div class="loading">
              <div class="spinner"></div>
              Translating...
            </div>
          ` : 'Translate'}
        </button>

        ${this.translatedText ? html`
          <div class="output-section">
            <label for="output-text">Translation:</label>
            <textarea
              id="output-text"
              class="textarea"
              .value=${this.translatedText}
              readonly
            ></textarea>
          </div>
        ` : ''}

        ${this.error ? html`
          <div class="error">${this.error}</div>
        ` : ''}
      </div>
    `;
  }
}

// Export for use in frameworks
declare global {
  interface HTMLElementTagNameMap {
    'ai-translator': AITranslatorElement;
  }
}
