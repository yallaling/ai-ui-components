export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface AIChatProps {
  /**
   * Array of chat messages
   */
  messages: Message[];
  /**
   * Handler for sending new messages
   */
  onSendMessage: (message: string) => void;
  /**
   * Whether the AI is currently processing
   */
  isLoading?: boolean;
  /**
   * Placeholder text for the input
   */
  placeholder?: string;
  /**
   * Maximum height of the chat container
   */
  maxHeight?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}
