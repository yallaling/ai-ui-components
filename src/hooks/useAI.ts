import { useState, useCallback } from 'react';

export interface AIResponse {
  text: string;
  timestamp: Date;
  success: boolean;
  error?: string;
}

export interface UseAIOptions {
  apiEndpoint?: string;
  headers?: Record<string, string>;
  onSuccess?: (response: AIResponse) => void;
  onError?: (error: string) => void;
}

/**
 * Custom hook for AI interactions
 */
const useAI = (options: UseAIOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendPrompt = useCallback(
    async (prompt: string) => {
      if (!prompt.trim()) return;

      setIsLoading(true);
      setError(null);

      try {
        // Simulate AI API call - replace with actual implementation
        await new Promise(resolve =>
          setTimeout(resolve, 1000 + Math.random() * 2000)
        );

        const aiResponse: AIResponse = {
          text: `AI Response to: "${prompt}". This is a simulated response.`,
          timestamp: new Date(),
          success: true,
        };

        setResponse(aiResponse);
        options.onSuccess?.(aiResponse);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        options.onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setResponse(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    sendPrompt,
    reset,
    isLoading,
    response,
    error,
  };
};

export default useAI;
