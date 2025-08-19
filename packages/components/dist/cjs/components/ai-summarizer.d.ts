import { LitElement } from 'lit';
export declare class AISummarizerElement extends LitElement {
    static styles: import("lit").CSSResult;
    text: string;
    type: 'key-points' | 'tldr' | 'teaser' | 'headline';
    format: 'markdown' | 'plain-text';
    length: 'short' | 'medium' | 'long';
    private isLoading;
    private result;
    private error;
    private isInitialized;
    private summarizer;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private setupEventListeners;
    private initializeSummarizer;
    private handleSummarize;
    private handleTextInput;
    private handleTypeChange;
    private handleFormatChange;
    private handleLengthChange;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=ai-summarizer.d.ts.map