import { LitElement } from 'lit';
export declare class AIRewriterElement extends LitElement {
    static styles: import("lit").CSSResult;
    text: string;
    context: string;
    tone: 'as-is' | 'more-formal' | 'more-casual';
    format: 'plain-text' | 'markdown';
    length: 'shorter' | 'as-is' | 'longer';
    private isLoading;
    private result;
    private error;
    private isInitialized;
    private availableTones;
    private availableFormats;
    private rewriter;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private setupEventListeners;
    private initializeRewriter;
    private handleRewrite;
    private handleTextInput;
    private handleContextInput;
    private handleToneChange;
    private handleFormatChange;
    private handleLengthChange;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=ai-rewriter.d.ts.map