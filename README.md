# Chrome AI Components

A comprehensive TypeScript React component library for Chrome AI integration, built with modern tools and best practices.

> ⚠️ **Chrome Version Requirement**: This library requires **Chrome 138+** to access the experimental Chrome AI APIs. Make sure you're using a compatible browser version.

## ✨ Latest Features (v1.1.0)

- 📏 **Dynamic Sizing** - Customizable width/height with `resizable` option
- 📝 **Rich Markdown Output** - Beautiful ReactMarkdown rendering for AI results  
- 📋 **Copy & Download** - One-click copy to clipboard and download as `.md` files
- 🍞 **Toast Notifications** - Success feedback for user actions
- 📱 **Responsive Design** - Components adapt to all screen sizes
- ♿ **Accessibility** - WCAG compliant with proper ARIA labels

## Features

- 🚀 **Modern Build Setup** - TypeScript, Rollup, and tree-shaking support
- 📚 **Storybook Integration** - Component documentation and testing
- 🧪 **Testing Ready** - Jest and React Testing Library setup
- 🎨 **Code Quality** - ESLint and Prettier configuration
- 📦 **NPM Ready** - Optimized for npm publishing with proper entry points
- 🔄 **CI/CD Ready** - GitHub Actions workflow included
- 🌲 **Tree Shakeable** - Supports both CommonJS and ES modules

## Installation

```bash
npm install @yallaling/ai-ui-components
# or
yarn add @yallaling/ai-ui-components
```

## Quick Start

```tsx
import React, { useState } from 'react';
import { 
  Button, 
  AIChat, 
  AIPrompt, 
  AISummarizer, 
  AITranslator,
  LoadingSpinner,
  Toaster 
} from '@yallaling/ai-ui-components';

function App() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'ai' as const,
      timestamp: new Date(),
    }
  ]);

  const handleSendMessage = (message: string) => {
    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user' as const,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handlePromptSubmit = (prompt: string) => {
    console.log('AI Prompt submitted:', prompt);
  };

  return (
    <div>
      {/* Basic Button */}
      <Button variant="primary" size="large">
        Get Started with AI
      </Button>
      
      {/* AI Chat Interface */}
      <AIChat 
        messages={messages}
        onSendMessage={handleSendMessage}
        placeholder="Type your message..."
      />
      
      {/* AI Prompt Input */}
      <AIPrompt 
        onSubmit={handlePromptSubmit}
        placeholder="Enter your AI prompt..."
        maxLength={500}
        showCounter={true}
        aiModel="language"
      />
      
      {/* Loading Indicator */}
      <LoadingSpinner size="medium" text="Processing..." />
      
      {/* Toast Notifications (required for copy/download features) */}
      <Toaster position="top-right" />
    </div>
  );
}
```
```

### ✨ Advanced Chrome AI Features

```tsx
import { AIWriter, AISummarizer, AITranslator, AIRewriter, AILanguageDetector } from '@yallaling/ai-ui-components';

function AdvancedAIApp() {
  const handleSummarize = (summary: string) => {
    console.log('Summary generated:', summary);
  };

  const handleTranslate = (translation: string) => {
    console.log('Translation completed:', translation);
  };

  const handleRewrite = (rewrittenText: string) => {
    console.log('Text rewritten:', rewrittenText);
  };

  const handleLanguageDetection = (detectedLanguage: string) => {
    console.log('Language detected:', detectedLanguage);
  };

  return (
    <div>
      {/* AI Text Summarizer */}
      <AISummarizer
        onSummarize={handleSummarize}
        type="key-points"
        format="markdown"
        length="medium"
        placeholder="Enter text to summarize..."
        width="100%"
        height="400px"
        resizable={true}
        allowCopy={true}
        allowDownload={true}
        downloadFileName="summary.md"
        showControls={true}
        streaming={true}
      />

      {/* AI Language Translator */}
      <AITranslator
        onTranslate={handleTranslate}
        sourceLanguage="en"
        targetLanguage="es"
        placeholder="Enter text to translate..."
        width="600px"
        height="300px"
        autoTranslate={false}
        streaming={true}
        showControls={true}
        allowCopy={true}
        allowDownload={true}
        downloadFileName="translation.txt"
      />

      {/* AI Text Rewriter */}
      <AIRewriter
        onRewrite={handleRewrite}
        tone="formal"
        format="as-is"
        length="as-is"
        placeholder="Enter text to rewrite..."
        width="100%"
        resizable={true}
        allowCopy={true}
        allowDownload={true}
        streaming={true}
      />

      {/* AI Language Detector */}
      <AILanguageDetector
        onDetect={handleLanguageDetection}
        placeholder="Enter text to detect language..."
        autoDetect={true}
        showConfidence={true}
        allowCopy={true}
      />

      {/* AI Content Writer */}
      <AIWriter
        width="800px"
        height="600px"
        resizable={true}
        allowCopy={true}
        allowDownload={true}
        downloadFileName="ai-content.md"
        placeholder="Start writing with AI assistance..."
        streaming={true}
      />
    </div>
  );
}
```
```

## Components

### Button
A versatile button component with multiple variants and sizes.

```tsx
<Button 
  variant="primary" 
  size="medium" 
  loading={false}
  disabled={false}
  onClick={() => console.log('clicked')}
>
  Click me
</Button>
```

**Props:**
- `variant`: "primary" | "secondary" | "outline" | "ghost"
- `size`: "small" | "medium" | "large"
- `loading`: boolean - Shows loading spinner
- `disabled`: boolean

### AIChat
A comprehensive chat interface component for AI conversations with message history and real-time responses.

```tsx
const sampleMessages = [
  {
    id: '1',
    text: 'Hello! How can I help you today?',
    sender: 'ai',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: '2',
    text: 'I need help with creating a React component.',
    sender: 'user',
    timestamp: new Date(Date.now() - 240000),
  },
];

<AIChat 
  messages={sampleMessages}
  onSendMessage={handleSendMessage}
  placeholder="Type your message..."
  isLoading={false}
  maxMessageLength={1000}
/>
```

**Props:**
- `messages`: Array of message objects with id, text, sender, timestamp
- `onSendMessage`: Callback function when user sends a message
- `placeholder`: Input placeholder text
- `isLoading`: Show typing indicator
- `maxMessageLength`: Maximum characters per message

### AIPrompt
A powerful prompt input component for AI interactions with character counting and validation.

```tsx
<AIPrompt 
  onSubmit={handlePromptSubmit}
  placeholder="Enter your AI prompt..."
  maxLength={500}
  showCounter={true}
  aiModel="language"
  isLoading={false}
  disabled={false}
/>
```

**Props:**
- `onSubmit`: Callback function when prompt is submitted
- `maxLength`: Maximum character limit (default: 500)
- `showCounter`: Display character counter
- `aiModel`: "language" | "text" | "image" - AI model type
- `isLoading`: Show loading state
- `placeholder`: Input placeholder text

### AISummarizer
Text summarization component using Chrome's built-in AI summarization API.

```tsx
<AISummarizer
  onSummarize={handleSummarize}
  type="key-points"
  format="markdown"
  length="medium"
  placeholder="Enter text to summarize..."
  width="100%"
  height="400px"
  resizable={true}
  allowCopy={true}
  allowDownload={true}
  downloadFileName="summary.md"
  streaming={true}
  autoSummarize={false}
/>
```

**Props:**
- `type`: "tldr" | "key-points" | "teaser" | "headline"
- `format`: "plain-text" | "markdown"
- `length`: "short" | "medium" | "long"
- `streaming`: Enable real-time streaming
- `autoSummarize`: Auto-summarize on text change
- `resizable`: Allow component resizing
- `allowCopy`: Enable copy to clipboard
- `allowDownload`: Enable download as file

### AITranslator
Language translation component with support for multiple languages and real-time translation.

```tsx
<AITranslator
  onTranslate={handleTranslate}
  sourceLanguage="en"
  targetLanguage="es"
  placeholder="Enter text to translate..."
  width="600px"
  height="300px"
  autoTranslate={false}
  streaming={true}
  showControls={true}
  allowCopy={true}
  allowDownload={true}
/>
```

**Props:**
- `sourceLanguage`: Source language code (e.g., "en", "es", "fr")
- `targetLanguage`: Target language code
- `autoTranslate`: Automatically translate on text change
- `streaming`: Enable streaming translation
- `showControls`: Display language selection controls

### AIRewriter
Text rewriting component for content improvement and style changes.

```tsx
<AIRewriter
  onRewrite={handleRewrite}
  tone="formal"
  format="as-is"
  length="as-is"
  placeholder="Enter text to rewrite..."
  width="100%"
  resizable={true}
  streaming={true}
  allowCopy={true}
  allowDownload={true}
/>
```

**Props:**
- `tone`: "formal" | "casual" | "professional" | "creative"
- `format`: "as-is" | "plain-text" | "markdown"
- `length`: "as-is" | "shorter" | "longer"
- `streaming`: Enable real-time rewriting

### AILanguageDetector
Automatic language detection component with confidence scoring.

```tsx
<AILanguageDetector
  onDetect={handleLanguageDetection}
  placeholder="Enter text to detect language..."
  autoDetect={true}
  showConfidence={true}
  allowCopy={true}
  minTextLength={10}
/>
```

**Props:**
- `autoDetect`: Automatically detect on text change
- `showConfidence`: Display confidence percentage
- `minTextLength`: Minimum text length for detection

### LoadingSpinner
A customizable loading indicator component.

```tsx
<LoadingSpinner 
  size="large" 
  text="Processing your request..." 
  overlay={true}
  color="primary"
/>
```

**Props:**
- `size`: "small" | "medium" | "large"
- `text`: Optional loading text
- `overlay`: Show as overlay
- `color`: Spinner color theme

## Hooks

### useAI
A custom hook for AI interactions.

```tsx
```typescript
import { useAI } from 'ai-ui-components';

function MyComponent() {
  const { sendPrompt, isLoading, response, error } = useAI();
  
  const handleSubmit = async (prompt: string) => {
    await sendPrompt(prompt);
  };
  
  // ... rest of component
}
```

### useDebounce
A hook for debouncing values.

```tsx
```typescript
import { useDebounce } from 'ai-ui-components';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // ... rest of component
}
```

### useLocalStorage
A hook for localStorage with React state sync.

```tsx
```typescript
import { useLocalStorage } from 'ai-ui-components';

function SettingsComponent() {
  const [settings, setSettings] = useLocalStorage('app-settings', {});
  
  // ... rest of component
}
```

## Development

### Prerequisites
- Node.js 20+
- npm 10+
- Chrome 138+ (for AI features)

### Setup
```bash
# Clone the repository
git clone https://github.com/yallaling/ai-ui-components.git
cd ai-ui-components

# Install dependencies
npm install

# Start Storybook
npm run storybook

# Run tests
npm test

# Build the library
npm run build
```

### Scripts
- `npm run build` - Build the library for production
- `npm run dev` - Build in watch mode
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Lint the code
- `npm run format` - Format the code
- `npm run storybook` - Start Storybook
- `npm run build-storybook` - Build Storybook for deployment

## Project Structure

```
src/
├── components/          # React components
│   ├── Button/
│   ├── AIChat/
│   ├── AIPrompt/
│   └── LoadingSpinner/
├── hooks/              # Custom React hooks
│   ├── useAI.ts
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── utils/              # Utility functions
│   ├── dom.ts
│   ├── string.ts
│   └── validation.ts
├── types/              # TypeScript type definitions
│   ├── common.ts
│   └── components.ts
└── index.ts            # Main entry point

stories/                # Storybook stories
.storybook/            # Storybook configuration
dist/                  # Build output
```

## Browser Support

> ⚠️ **Important**: This library requires **Chrome 138+** to access the experimental Chrome AI APIs.

### Chrome AI API Compatibility:
- **Chrome 138+**: ✅ Full support for all AI components
- **Chrome 137 and below**: ❌ AI features not available
- **Other browsers**: ❌ Chrome AI APIs are Chrome-exclusive

### General Browser Support (for non-AI components):
- Chrome 88+
- Firefox 88+
- Safari 14+
- Edge 88+

### Enabling Chrome AI APIs:
1. Use Chrome 138 or later
2. Go to `chrome://flags/`
3. Enable "Prompt API for Gemini Nano" and "Summarization API"
4. Restart Chrome
5. Check availability in your app with:
```tsx
// Check if Chrome AI APIs are available
const isAIAvailable = 'ai' in globalThis && 'languageModel' in globalThis.ai;
```

## 📚 Storybook Documentation

Interactive component documentation and examples are available in Storybook:

- **Local development**: `npm run storybook` → http://localhost:6006
- **Online documentation**: https://yallaling.github.io/ai-ui-components/

### Storybook Stories Include:
- **Component Playground**: Interactive props controls
- **Real Chrome AI Integration**: Live AI feature testing (requires Chrome 138+)
- **Responsive Examples**: Mobile and desktop layouts  
- **Accessibility Testing**: WCAG compliance validation
- **Code Examples**: Copy-paste ready implementations

## 🔧 Chrome AI Setup Guide

To use the AI components, you need to enable Chrome's experimental AI features:

### Step 1: Update Chrome
- Download Chrome 138+ from https://www.google.com/chrome/
- Or use Chrome Canary for the latest features

### Step 2: Enable Flags
1. Go to `chrome://flags/`
2. Search for and enable:
   - **"Prompt API for Gemini Nano"** → Enabled
   - **"Summarization API"** → Enabled  
   - **"Translation API"** → Enabled
   - **"Language Detection API"** → Enabled
3. Click "Relaunch" to restart Chrome

### Step 3: Verify Setup
```tsx
import { useAI } from '@yallaling/ai-ui-components';

function AIStatusChecker() {
  const { isAIAvailable, capabilities } = useAI();
  
  if (!isAIAvailable) {
    return (
      <div>
        <h3>Chrome AI Not Available</h3>
        <p>Please update to Chrome 138+ and enable AI flags</p>
      </div>
    );
  }
  
  return (
    <div>
      <h3>Chrome AI Ready! ✅</h3>
      <p>Available capabilities: {capabilities.join(', ')}</p>
    </div>
  );
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and releases.
