export interface AIPromptProps {
  /**
   * Initial prompt text
   */
  initialPrompt?: string;
  /**
   * Handler for prompt submission
   */
  onSubmit?: (prompt: string) => void;
  /**
   * Handler for AI response
   */
  onResponse?: (response: string) => void;
  /**
   * Handler for errors
   */
  onError?: (error: string) => void;
  /**
   * Whether the AI is currently processing
   */
  isLoading?: boolean;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Maximum character limit
   */
  maxLength?: number;
  /**
   * Show character counter
   */
  showCounter?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Show prompt templates dropdown
   */
  showTemplates?: boolean;
  /**
   * Enable auto-completion suggestions
   */
  enableAutoComplete?: boolean;
  /**
   * Show AI-powered prompt improvement
   */
  showAIAssistance?: boolean;
  /**
   * AI model to use for assistance
   */
  aiModel?: 'language' | 'writer' | 'rewriter';
  /**
   * Enable streaming responses
   */
  streaming?: boolean;
  /**
   * Show AI execution and response
   */
  showExecution?: boolean;
  /**
   * Temperature for AI model (0.0 to 1.0)
   */
  temperature?: number;
  /**
   * Top K for AI model
   */
  topK?: number;
  /**
   * Initial prompts for context
   */
  initialPrompts?: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  /**
   * Callback when prompt is improved by AI
   */
  onPromptImproved?: (improvedPrompt: string) => void;
  /**
   * Show controls only mode (hide input field)
   */
  controlsOnly?: boolean;
  /**
   * External prompt to use when controlsOnly is enabled
   */
  externalPrompt?: string;
}
