import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// Import from local core package
import { WebAISummarizer } from '@yallaling/web-ai-core';

// Define local interface since it's not exported from core
interface SummarizerResult {
  summary: string;
  originalLength: number;
  summaryLength: number;
  compressionRatio: number;
}

@customElement('ai-summarizer-element')
export class AISummarizerElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 600px;
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
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
      min-width: 200px;
    }

    label {
      font-size: 14px;
      font-weight: 500;
      color: #555;
    }

    textarea {
      width: 100%;
      min-height: 120px;
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

    select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      background: white;
    }

    select:focus {
      outline: none;
      border-color: #4285f4;
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
    }

    .button:hover:not(:disabled) {
      background: #3367d6;
    }

    .button:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }

    .output {
      margin-top: 16px;
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
      line-height: 1.5;
      color: #333;
      white-space: pre-wrap;
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

  @property() 
  text: string = '';

  @property()
  type: 'key-points' | 'tldr' | 'teaser' | 'headline' = 'tldr';

  @property()
  format: 'markdown' | 'plain-text' = 'markdown';

  @property()
  length: 'short' | 'medium' | 'long' = 'medium';

  @state()
  private isLoading = false;

  @state()
  private result: SummarizerResult | null = null;

  @state()
  private error: string | null = null;

  @state()
  private isInitialized = false;

  private summarizer: WebAISummarizer;

  constructor() {
    super();
    this.summarizer = new WebAISummarizer();
    this.setupEventListeners();
  }

  connectedCallback() {
    super.connectedCallback();
    this.initializeSummarizer();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.summarizer.destroy();
  }

  private setupEventListeners() {
    this.summarizer.addEventListener('initialized', () => {
      this.isInitialized = true;
      this.error = null;
      this.requestUpdate();
    });

    this.summarizer.addEventListener('error', (event: any) => {
      this.error = event.detail.error;
      this.isLoading = false;
      this.requestUpdate();
    });

    this.summarizer.addEventListener('summarizationCompleted', (event: any) => {
      this.result = event.detail;
      this.isLoading = false;
      this.requestUpdate();
      
      // Dispatch custom event for parent components
      this.dispatchEvent(new CustomEvent('summarization-complete', {
        detail: event.detail,
        bubbles: true
      }));
    });
  }

  private async initializeSummarizer() {
    try {
      await this.summarizer.initialize();
    } catch (error) {
      console.error('Failed to initialize summarizer:', error);
    }
  }

  private async handleSummarize() {
    if (!this.text.trim()) {
      this.error = 'Please enter some text to summarize';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.result = null;

    try {
      const result = await this.summarizer.summarize(this.text, {
        type: this.type,
        format: this.format,
        length: this.length
      });
      
      this.result = result;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Summarization failed';
    } finally {
      this.isLoading = false;
    }
  }

  private handleTextInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.text = target.value;
    
    // Dispatch input event for parent components
    this.dispatchEvent(new CustomEvent('text-input', {
      detail: { text: this.text },
      bubbles: true
    }));
  }

  private handleTypeChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.type = target.value as any;
  }

  private handleFormatChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.format = target.value as any;
  }

  private handleLengthChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.length = target.value as any;
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <div class="title">AI Text Summarizer</div>
        </div>

        <div class="status">
          <div class="status-indicator ${this.isLoading ? 'loading' : this.error ? 'error' : ''}"></div>
          <span>
            ${this.isLoading ? 'Summarizing...' : 
              this.error ? 'Error occurred' : 
              this.isInitialized ? 'Ready to summarize' : 'Initializing...'}
          </span>
        </div>

        <div class="input-group">
          <label for="text-input">Text to Summarize</label>
          <textarea
            id="text-input"
            .value=${this.text}
            @input=${this.handleTextInput}
            placeholder="Enter the text you want to summarize..."
          ></textarea>
        </div>

        <div class="controls">
          <div>
            <label for="type-select">Type</label>
            <select id="type-select" .value=${this.type} @change=${this.handleTypeChange}>
              <option value="tldr">TL;DR</option>
              <option value="key-points">Key Points</option>
              <option value="teaser">Teaser</option>
              <option value="headline">Headline</option>
            </select>
          </div>

          <div>
            <label for="format-select">Format</label>
            <select id="format-select" .value=${this.format} @change=${this.handleFormatChange}>
              <option value="markdown">Markdown</option>
              <option value="plain-text">Plain Text</option>
            </select>
          </div>

          <div>
            <label for="length-select">Length</label>
            <select id="length-select" .value=${this.length} @change=${this.handleLengthChange}>
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>

          <button 
            class="button" 
            @click=${this.handleSummarize}
            .disabled=${!this.isInitialized || this.isLoading || !this.text.trim()}
          >
            ${this.isLoading ? 'Summarizing...' : 'Summarize'}
          </button>
        </div>

        ${this.error ? html`
          <div class="error">${this.error}</div>
        ` : ''}

        ${this.result ? html`
          <div class="output">
            <div class="output-label">Summary</div>
            <div class="output-content">${this.result.summary}</div>
            <div class="stats">
              <div class="stat">
                <span>Original:</span>
                <span>${this.result.originalLength} chars</span>
              </div>
              <div class="stat">
                <span>Summary:</span>
                <span>${this.result.summaryLength} chars</span>
              </div>
              <div class="stat">
                <span>Compression:</span>
                <span>${this.result.compressionRatio}%</span>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}
