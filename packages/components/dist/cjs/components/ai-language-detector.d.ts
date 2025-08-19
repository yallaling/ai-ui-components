import { LitElement } from 'lit';
export declare class AILanguageDetectorElement extends LitElement {
    static styles: import("lit").CSSResult;
    text: string;
    private isLoading;
    private results;
    private error;
    private isInitialized;
    private detector;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private setupEventListeners;
    private initializeDetector;
    private handleDetect;
    private handleTextInput;
    private getConfidenceClass;
    private formatConfidence;
    private formatLanguageName;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=ai-language-detector.d.ts.map