import { LitElement } from 'lit';
/**
 * Universal AI Translator Web Component
 * Built with Lit for maximum framework compatibility
 */
export declare class AITranslatorElement extends LitElement {
    sourceLanguage: string;
    targetLanguage: string;
    autoTranslate: boolean;
    showInput: boolean;
    showControls: boolean;
    showOutput: boolean;
    controlsOnly: boolean;
    streaming: boolean;
    resizable: boolean;
    allowCopy: boolean;
    allowDownload: boolean;
    placeholder: string;
    maxLength: number;
    downloadFileName: string;
    text: string;
    externalText: string;
    private inputText;
    private translatedText;
    private isLoading;
    private error;
    private isSupported;
    private translator;
    static styles: import("lit").CSSResult;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private checkSupport;
    private initializeTranslator;
    private cleanup;
    private handleTranslate;
    private handleExternalTranslation;
    private handleInputChange;
    private autoTranslateTimeout;
    private handleLanguageChange;
    updated(changedProperties: Map<string, any>): void;
    render(): import("lit-html").TemplateResult<1>;
    private renderInput;
    private renderControls;
    private renderOutput;
    private handleCopy;
}
declare global {
    interface HTMLElementTagNameMap {
        'ai-translator-element': AITranslatorElement;
    }
}
//# sourceMappingURL=ai-translator.d.ts.map