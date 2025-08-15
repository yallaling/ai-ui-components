import React, { useState, useRef, useEffect } from 'react';
import { AIChatProps } from './AIChat.types';
import './AIChat.css';

/**
 * AI Chat component for conversational interfaces
 */
const AIChat: React.FC<AIChatProps> = ({
  messages,
  onSendMessage,
  isLoading = false,
  placeholder = 'Type your message...',
  maxHeight = '400px',
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`ai-chat ${className}`}>
      <div className="ai-chat__messages" style={{ maxHeight }}>
        {messages.map(message => (
          <div
            key={message.id}
            className={`ai-chat__message ai-chat__message--${message.sender}`}
          >
            <div className="ai-chat__message-content">
              <div className="ai-chat__message-text">{message.text}</div>
              <div className="ai-chat__message-time">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="ai-chat__message ai-chat__message--ai">
            <div className="ai-chat__message-content">
              <div className="ai-chat__typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="ai-chat__form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="ai-chat__input"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="ai-chat__send-button"
          disabled={!inputValue.trim() || isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AIChat;
