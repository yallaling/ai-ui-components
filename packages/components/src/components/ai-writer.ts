import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { WebAIWriter } from '@yallaling/web-ai-core';

interface WriterResult {
  content: string;
  wordCount: number;
  characterCount: number;
}

@customElement('ai-writer-element')
export class AIWriterElement extends LitElement {
  static styles = css`
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

  @property() 
  prompt: string = '';

  @property()
  context: string = '';

  @property()
  tone: 'formal' | 'casual' = 'casual';

  @property()
  format: 'plain-text' | 'markdown' = 'plain-text';

  @property()
  length: 'short' | 'medium' | 'long' = 'medium';

  @state()
  private isLoading = false;

  @state()
  private result: WriterResult | null = null;

  @state()
  private error: string | null = null;

  @state()
  private isInitialized = false;

  @state()
  private availableTones: string[] = [];

  @state()
  private availableFormats: string[] = [];

  private writer: WebAIWriter;

  constructor() {
    super();
    this.writer = new WebAIWriter();
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

  private setupEventListeners() {
    this.writer.addEventListener('initialized', (event: any) => {
      this.isInitialized = true;
      this.error = null;
      
      // Get available options from capabilities - use valid Chrome AI format values
      const caps = this.writer.getCapabilities();
      this.availableTones = caps?.tones || ['formal', 'casual'];
      this.availableFormats = caps?.formats || ['plain-text', 'markdown'];
      
      this.requestUpdate();
    });

    this.writer.addEventListener('error', (event: any) => {
      this.error = event.detail.error;
      this.isLoading = false;
      this.requestUpdate();
    });

    this.writer.addEventListener('writingCompleted', (event: any) => {
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

  private async initializeWriter() {
    try {
      await this.writer.initialize();
    } catch (error) {
      console.error('Failed to initialize writer:', error);
    }
  }

  private async handleWrite() {
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
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Writing failed';
    } finally {
      this.isLoading = false;
    }
  }

  private handlePromptInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.prompt = target.value;
  }

  private handleContextInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.context = target.value;
  }

  private handleToneChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    const newTone = target.value as 'formal' | 'casual';
    console.log('Tone changed to:', newTone);
    this.tone = newTone;
    this.requestUpdate();
  }

  private handleFormatChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    const newFormat = target.value as 'plain-text' | 'markdown';
    console.log('Format changed to:', newFormat);
    this.format = newFormat;
    this.requestUpdate();
  }

  private handleLengthChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.length = target.value as any;
  }

  render() {
    return html`
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

        ${this.error ? html`
          <div class="error">${this.error}</div>
        ` : ''}

        ${this.result ? html`
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
}
