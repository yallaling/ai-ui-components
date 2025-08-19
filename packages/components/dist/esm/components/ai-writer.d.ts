import { LitElement } from 'lit';
export declare class AIWriterElement extends LitElement {
    static styles: import("lit").CSSResult;
    prompt: string;
    context: string;
    tone: 'formal' | 'casual';
    format: 'plain-text' | 'markdown';
    length: 'short' | 'medium' | 'long';
    private isLoading;
    private result;
    private error;
    private isInitialized;
    private availableTones;
    private availableFormats;
    private writer;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private setupEventListeners;
    private initializeWriter;
    private handleWrite;
    private handlePromptInput;
    private handleContextInput;
    private handleToneChange;
    private handleFormatChange;
    private handleLengthChange;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=ai-writer.d.ts.map