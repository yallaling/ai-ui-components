import React, { useState, useRef, useEffect, useCallback } from 'react';
import { marked } from 'marked';
import { AIPromptProps } from './AIPrompt.types';
import './AIPrompt.css';

/**
 * Enhanced AI Prompt component with Chrome AI integration and prompt engineering features
 */
const AIPrompt: React.FC<AIPromptProps> = ({
  initialPrompt = '',
  onSubmit,
  isLoading = false,
  placeholder = 'Enter your prompt...',
  maxLength = 2000,
  showCounter = true,
  className = '',
  showTemplates = false,
  enableAutoComplete = false,
  showAIAssistance = false,
  aiModel = 'language',
  streaming = false,
  showExecution = false,
  temperature = 0.7,
  topK = 40,
  initialPrompts = [],
  onPromptImproved,
  onError,
  controlsOnly: _controlsOnly = false,
  externalPrompt: _externalPrompt = '',
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isImprovingPrompt, setIsImprovingPrompt] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<string>('');
  const [streamingText, setStreamingText] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Configure marked for safe HTML output
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  // Function to parse markdown content safely
  const parseMarkdown = useCallback((content: string): string => {
    try {
      // Clean up excessive whitespace before parsing
      const cleanedContent = content
        .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace multiple newlines with double newlines
        .trim();

      const result = marked.parse(cleanedContent);
      const htmlResult = typeof result === 'string' ? result : content;

      // Clean up excessive spacing in HTML
      return htmlResult
        .replace(/<\/p>\s*<p>/g, '</p><p>') // Remove spacing between paragraphs
        .replace(/^\s+|\s+$/g, '') // Trim leading/trailing whitespace
        .replace(/\s{2,}/g, ' '); // Replace multiple spaces with single space
    } catch (error) {
      console.error('Markdown parsing error:', error);
      // Fallback to plain text with basic formatting
      return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n\s*\n/g, '<br><br>') // Convert double newlines to line breaks
        .replace(/\n/g, '<br>');
    }
  }, []);

  // Function to detect if content contains markdown
  const isMarkdownContent = useCallback((content: string): boolean => {
    const markdownPatterns = [
      /#{1,6}\s+/, // Headers
      /\*\*(.*?)\*\*/, // Bold
      /\*(.*?)\*/, // Italic
      /`(.*?)`/, // Code
      /\[(.*?)\]\((.*?)\)/, // Links
      /^\s*[-*+]\s+/m, // Lists
      /^\s*\d+\.\s+/m, // Numbered lists
      /```/, // Code blocks
      /^\s*>/m, // Blockquotes
    ];

    return markdownPatterns.some(pattern => pattern.test(content));
  }, []);

  const promptTemplates = [
    {
      name: 'Creative Writing',
      template:
        'Write a creative story about [topic] with [style] tone. Include vivid descriptions and character development.',
    },
    {
      name: 'Technical Explanation',
      template:
        'Explain [concept] in simple terms for someone who is new to [field]. Use examples and analogies.',
    },
    {
      name: 'Email Draft',
      template:
        'Write a professional email to [recipient] about [subject]. The tone should be [formal/friendly/urgent].',
    },
    {
      name: 'Code Review',
      template:
        'Review this code for [language]: [code]. Focus on [performance/security/readability] improvements.',
    },
    {
      name: 'Summary Request',
      template:
        'Summarize the following text in [length] format, focusing on [key points/main ideas/action items].',
    },
  ];

  const generateSuggestions = useCallback(async () => {
    if (!enableAutoComplete) return;

    try {
      // Simple suggestion generation based on prompt content
      const suggestions = [];

      if (prompt.toLowerCase().includes('write')) {
        suggestions.push('...about the latest technological developments');
        suggestions.push('...in a conversational tone');
        suggestions.push('...with specific examples');
      }

      if (prompt.toLowerCase().includes('explain')) {
        suggestions.push('...using simple language');
        suggestions.push('...with step-by-step instructions');
        suggestions.push('...including practical examples');
      }

      if (prompt.toLowerCase().includes('create')) {
        suggestions.push('...that is engaging and informative');
        suggestions.push('...following best practices');
        suggestions.push('...with clear structure');
      }

      if (suggestions.length > 0) {
        setSuggestions(suggestions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
    }
  }, [prompt, enableAutoComplete]);

  useEffect(() => {
    if (enableAutoComplete && prompt.length > 10) {
      const debounceTimer = setTimeout(() => {
        generateSuggestions();
      }, 500);
      return () => clearTimeout(debounceTimer);
    }
  }, [prompt, enableAutoComplete, generateSuggestions]);

  const improvePrompt = useCallback(async () => {
    if (!showAIAssistance || !prompt.trim()) return;

    setIsImprovingPrompt(true);

    try {
      if (aiModel === 'rewriter' && 'Rewriter' in self) {
        // Check if Rewriter.availability is a function
        if (typeof (self as any).Rewriter?.availability !== 'function') {
          throw new Error(
            'Rewriter API is not properly initialized or availability method is not available'
          );
        }

        // Rewriter API uses availability() method with options
        const availabilityResult = await (self as any).Rewriter.availability({
          tone: 'as-is',
          format: 'plain-text',
          length: 'as-is',
        });

        if (
          availabilityResult === 'readily' ||
          availabilityResult === 'available'
        ) {
          try {
            const session = await (self as any).Rewriter.create({
              tone: 'more-formal',
              format: 'plain-text',
              length: 'as-is',
            });

            const improvedPrompt = await session.rewrite(prompt, {
              context:
                'Improve this prompt to be more clear, specific, and effective for AI interaction. Focus on clarity, context, and desired outcomes.',
            });

            onPromptImproved?.(improvedPrompt);
            setPrompt(improvedPrompt);
            session.destroy();
          } catch (err: any) {
            if (
              err.message?.includes('user gesture') ||
              err.message?.includes('requires a user gesture')
            ) {
              throw new Error(
                'Please click the improve button to download the AI model (user interaction required)'
              );
            }
            throw err;
          }
        }
      } else if (aiModel === 'writer' && 'Writer' in self) {
        // Check if Writer.availability is a function
        if (typeof (self as any).Writer?.availability !== 'function') {
          throw new Error(
            'Writer API is not properly initialized or availability method is not available'
          );
        }

        // Writer API uses availability() method with options
        const availabilityResult = await (self as any).Writer.availability({
          tone: 'formal',
          format: 'plain-text',
          length: 'medium',
        });

        if (
          availabilityResult === 'readily' ||
          availabilityResult === 'available'
        ) {
          try {
            const session = await (self as any).Writer.create({
              tone: 'formal',
              format: 'plain-text',
              length: 'medium',
            });

            const improvedPrompt = await session.write(
              `Improve this AI prompt to be more effective: "${prompt}". Make it clearer, more specific, and better structured for getting optimal AI responses.`
            );

            onPromptImproved?.(improvedPrompt);
            setPrompt(improvedPrompt);
            session.destroy();
          } catch (err: any) {
            if (
              err.message?.includes('user gesture') ||
              err.message?.includes('requires a user gesture')
            ) {
              throw new Error(
                'Please click the improve button to download the AI model (user interaction required)'
              );
            }
            throw err;
          }
        }
      } else if (aiModel === 'language') {
        // Use LanguageModel API for prompt improvement
        let languageModelAPI = null;

        // Try to access LanguageModel
        try {
          if (
            typeof globalThis !== 'undefined' &&
            (globalThis as any).LanguageModel
          ) {
            languageModelAPI = (globalThis as any).LanguageModel;
          } else if (
            typeof window !== 'undefined' &&
            (window as any).LanguageModel
          ) {
            languageModelAPI = (window as any).LanguageModel;
          } else if ((self as any).LanguageModel) {
            languageModelAPI = (self as any).LanguageModel;
          }
        } catch (_e) {
          console.log('LanguageModel not found in global scope');
        }

        if (languageModelAPI) {
          const availability = await languageModelAPI.availability();
          if (availability === 'readily' || availability === 'available') {
            const session = await languageModelAPI.create({
              temperature: 0.7,
              topK: 40,
            });

            const improvedPrompt = await session.prompt(
              `Improve this AI prompt to be more effective: "${prompt}". Make it clearer, more specific, and better structured for getting optimal AI responses. Return only the improved prompt without additional explanation.`
            );

            onPromptImproved?.(improvedPrompt);
            setPrompt(improvedPrompt);
            session.destroy();
          } else {
            throw new Error('LanguageModel API is not available');
          }
        } else {
          throw new Error('LanguageModel API is not found');
        }
      } else {
        // AI model not supported for improvement
        throw new Error(
          `AI model "${aiModel}" is not available. Please make sure you're using a compatible Chrome browser with AI features enabled.`
        );
      }
    } catch (error: any) {
      console.error('Error improving prompt:', error);
      onError?.(error.message || 'Failed to improve prompt');
    } finally {
      setIsImprovingPrompt(false);
    }
  }, [prompt, showAIAssistance, aiModel, onPromptImproved, onError]);

  const executePrompt = useCallback(async () => {
    if (!showExecution || !prompt.trim()) return;

    setIsExecuting(true);
    setExecutionResult('');
    setStreamingText('');

    try {
      // Check if LanguageModel API is available directly (Chrome AI)
      let languageModelAPI = null;

      // Try to access LanguageModel directly from global scope
      try {
        if (
          typeof globalThis !== 'undefined' &&
          (globalThis as any).LanguageModel
        ) {
          languageModelAPI = (globalThis as any).LanguageModel;
        } else if (
          typeof window !== 'undefined' &&
          (window as any).LanguageModel
        ) {
          languageModelAPI = (window as any).LanguageModel;
        } else if ((self as any).LanguageModel) {
          languageModelAPI = (self as any).LanguageModel;
        }
      } catch (_e) {
        console.log('LanguageModel not found in global scope');
      }

      if (languageModelAPI) {
        console.log('Found LanguageModel API, checking availability...');

        // Get model parameters
        const { defaultTemperature, maxTemperature, defaultTopK, maxTopK } =
          await languageModelAPI.params();
        console.log('Model params:', {
          defaultTemperature,
          maxTemperature,
          defaultTopK,
          maxTopK,
        });

        // Check availability
        const available = await languageModelAPI.availability();
        console.log('Availability:', available);

        if (available !== 'unavailable') {
          console.log('Creating session...');

          // Create session with proper options based on API limits
          const sessionOptions: any = {};

          // Use temperature within bounds
          if (temperature !== undefined) {
            sessionOptions.temperature = Math.min(
              Math.max(temperature, 0),
              maxTemperature || 1
            );
          }

          // Use topK within bounds
          if (topK !== undefined) {
            sessionOptions.topK = Math.min(Math.max(topK, 1), maxTopK || 40);
          }

          // Add initial prompts if provided
          if (initialPrompts.length > 0) {
            sessionOptions.initialPrompts = initialPrompts;
          }

          console.log('Session options:', sessionOptions);
          const session = await languageModelAPI.create(sessionOptions);
          console.log('Session created successfully');

          if (streaming) {
            console.log('Starting streaming response...');
            // Streaming response using the correct pattern from reference
            const stream = session.promptStreaming(prompt);

            let output = '';

            // Use async iteration exactly as in your reference
            for await (const chunk of stream) {
              // Append each chunk to build the complete response
              output += chunk;
              setStreamingText(output);
              console.log(
                'Streaming chunk received, total length:',
                output.length
              );
            }

            console.log(
              'Streaming complete, final output length:',
              output.length
            );
            setExecutionResult(output);
            session.destroy();
          } else {
            console.log('Getting non-streaming response...');
            // Non-streaming response
            const result = await session.prompt(prompt);
            console.log('Non-streaming result length:', result.length);
            setExecutionResult(result);
            session.destroy();
          }
        } else {
          console.log('Model is unavailable');
          throw new Error(
            'Chrome AI Language Model is currently unavailable. Please check that the model is downloaded and enabled.'
          );
        }
      } else {
        console.log('LanguageModel API not found, providing demo response');
        // Provide a more realistic demo response
        const demoResponse = `🤖 **AI Demo Response**

**Your prompt:** "${prompt}"

**Simulated AI Response:**
This is a demonstration response since the Chrome AI LanguageModel API is not currently available in this environment.

**To enable the real Chrome AI API:**

1. **Use Chrome Canary (recommended)** or Chrome Dev  
2. **Enable these flags in chrome://flags:**
   - \`#prompt-api-for-gemini-nano\`
   - \`#optimization-guide-on-device-model\`
3. **Restart Chrome completely**
4. **Wait for model download** (happens automatically on first use)

**Component Features Working:**
✅ Streaming simulation  
✅ Temperature: ${temperature}
✅ TopK: ${topK}  
✅ Error handling
✅ UI states and animations

Once the real API is enabled, this component will automatically detect and use the actual Chrome AI model for genuine responses!`;

        if (streaming) {
          // Simulate realistic streaming
          const words = demoResponse.split(' ');
          let currentText = '';

          for (let i = 0; i < words.length; i++) {
            currentText += (i > 0 ? ' ' : '') + words[i];
            setStreamingText(currentText);
            // Vary the delay to simulate realistic typing
            const delay = Math.random() * 80 + 20; // 20-100ms
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          setExecutionResult(currentText);
        } else {
          // Simulate processing delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          setExecutionResult(demoResponse);
        }
      }
    } catch (error: any) {
      console.error('Error executing prompt:', error);
      const errorMessage = error.message || 'Failed to execute prompt';
      setExecutionResult(`Error: ${errorMessage}`);
      onError?.(errorMessage);
    } finally {
      setIsExecuting(false);
    }
  }, [
    prompt,
    showExecution,
    streaming,
    temperature,
    topK,
    initialPrompts,
    onError,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      if (showExecution) {
        executePrompt();
      } else {
        onSubmit?.(prompt.trim());
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setPrompt(value);
    }
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setPrompt(template);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    const newPrompt = prompt + suggestion;
    if (newPrompt.length <= maxLength) {
      setPrompt(newPrompt);
    }
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const _insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = prompt.substring(0, start) + text + prompt.substring(end);

    if (newText.length <= maxLength) {
      setPrompt(newText);

      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
        textarea.focus();
      }, 0);
    }
  };

  const remainingChars = maxLength - prompt.length;

  return (
    <div className={`ai-prompt ${className}`}>
      {showTemplates && (
        <div className="ai-prompt__templates">
          <label htmlFor="template-select" className="ai-prompt__label">
            Quick Templates:
          </label>
          <select
            id="template-select"
            value={selectedTemplate}
            onChange={e => handleTemplateSelect(e.target.value)}
            className="ai-prompt__template-select"
            disabled={isLoading}
          >
            <option value="">Select a template...</option>
            {promptTemplates.map(template => (
              <option key={template.name} value={template.template}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <form onSubmit={handleSubmit} className="ai-prompt__form">
        <div className="ai-prompt__input-container">
          <div className="ai-prompt__textarea-wrapper">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={handleChange}
              placeholder={placeholder}
              className="ai-prompt__textarea"
              disabled={isLoading || isImprovingPrompt}
              rows={6}
              onFocus={() => setShowSuggestions(false)}
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className="ai-prompt__suggestions">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="ai-prompt__suggestion"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ai-prompt__footer">
            {showCounter && (
              <div
                className={`ai-prompt__counter ${remainingChars < 100 ? 'ai-prompt__counter--warning' : ''}`}
              >
                {remainingChars} characters remaining
              </div>
            )}

            <div className="ai-prompt__actions">
              {showAIAssistance && (
                <button
                  type="button"
                  onClick={improvePrompt}
                  disabled={!prompt.trim() || isLoading || isImprovingPrompt}
                  className="ai-prompt__improve"
                  title="Use AI to improve this prompt"
                >
                  {isImprovingPrompt ? '✨ Improving...' : '✨ Improve'}
                </button>
              )}

              <button
                type="submit"
                className="ai-prompt__submit"
                disabled={
                  !prompt.trim() ||
                  isLoading ||
                  isImprovingPrompt ||
                  isExecuting
                }
              >
                {isExecuting
                  ? 'Executing...'
                  : isLoading
                    ? 'Processing...'
                    : showExecution
                      ? 'Execute Prompt'
                      : 'Submit Prompt'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {showExecution && (executionResult || streamingText || isExecuting) && (
        <div className="ai-prompt__execution-result">
          <div className="ai-prompt__result-header">
            <h3 className="ai-prompt__result-title">
              🤖 AI Response
              {isExecuting && (
                <span className="ai-prompt__status"> (Processing...)</span>
              )}
            </h3>
            {streaming && isExecuting && (
              <div className="ai-prompt__streaming-indicator">
                <span className="ai-prompt__dot"></span>
                <span className="ai-prompt__dot"></span>
                <span className="ai-prompt__dot"></span>
              </div>
            )}
          </div>
          <div className="ai-prompt__result-content">
            {isExecuting && streaming && streamingText ? (
              <div className="ai-prompt__streaming">
                {isMarkdownContent(streamingText) ? (
                  <div
                    className="ai-prompt__markdown-content"
                    dangerouslySetInnerHTML={{
                      __html: parseMarkdown(streamingText),
                    }}
                  />
                ) : (
                  <div className="ai-prompt__plain-content">
                    {streamingText}
                  </div>
                )}
                <span className="ai-prompt__cursor">▊</span>
              </div>
            ) : isExecuting ? (
              <div className="ai-prompt__loading">
                <div className="ai-prompt__spinner">⟳</div>
                <span>Connecting to AI model...</span>
              </div>
            ) : executionResult ? (
              <div className="ai-prompt__final-result">
                {executionResult.startsWith('Error:') ? (
                  <div className="ai-prompt__error">
                    <span className="ai-prompt__error-icon">⚠️</span>
                    {executionResult}
                  </div>
                ) : (
                  <div className="ai-prompt__success-result">
                    {isMarkdownContent(executionResult) ? (
                      <div
                        className="ai-prompt__markdown-content"
                        dangerouslySetInnerHTML={{
                          __html: parseMarkdown(executionResult),
                        }}
                      />
                    ) : (
                      <div className="ai-prompt__plain-content">
                        {executionResult}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPrompt;
