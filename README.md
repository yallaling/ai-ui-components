# AI UI Components

A comprehensive TypeScript React component library for Web AI integration, built with modern tools, security-first practices, and **universal compatibility across all frameworks**.

> ⚠️ **Browser Compatibility**: This library works with modern browsers that support Web AI APIs. Tested with latest browser versions with AI capabilities enabled.

## 🆕 Latest Features (v2.2.0)

### 🌍 **Universal Components Architecture**
- **Framework-Agnostic**: Components work in React, Vue, Angular, Svelte, and vanilla JavaScript
- **Zero Framework Lock-in**: Same components, same API, any framework
- **Universal Web Components**: Built with Lit Elements for maximum compatibility

### � **Enhanced CI/CD & Development**
- **GitHub Actions**: Automated testing, building, and Storybook deployment
- **Fixed Package Resolution**: Resolved monorepo build issues in CI/CD environments
- **Improved ESLint**: Better TypeScript and React compatibility
- **Storybook Deployment**: Automatic deployment to GitHub Pages

### 📦 **Three Package Architecture**

| Package | Purpose | Framework Support |
|---------|---------|------------------|
| `@yallaling/web-ai-core` | Core AI logic & utilities | ✅ Framework-agnostic |
| `@yallaling/web-ai-components` | Universal web components | ✅ React, Vue, Angular, Svelte, Vanilla JS |
| `@yallaling/ai-ui-components` | React-specific components | ✅ React only |

## ✨ Component Features

- �📏 **Dynamic Sizing** - Customizable width/height with `resizable` option
- 📝 **Rich Markdown Output** - Beautiful ReactMarkdown rendering for AI results  
- 📋 **Copy & Download** - One-click copy to clipboard and download as `.md` files
- 🍞 **Toast Notifications** - Success feedback for user actions
- 📱 **Responsive Design** - Components adapt to all screen sizes
- ♿ **Accessibility** - WCAG compliant with proper ARIA labels
- 🌍 **Universal Compatibility** - Same components work across all frameworks

## 🚀 Framework-Agnostic Features

- 🎯 **Modern Build Setup** - TypeScript, Rollup, and tree-shaking support
- 📚 **Storybook Integration** - Component documentation and testing
- 🧪 **Testing Ready** - Jest and React Testing Library setup
- 🎨 **Code Quality** - ESLint and Prettier configuration
- 📦 **NPM Ready** - Optimized for npm publishing with proper entry points
- 🔄 **CI/CD Ready** - GitHub Actions workflow included
- 🌲 **Tree Shakeable** - Supports both CommonJS and ES modules

## 📦 Installation

### React-Only Installation
```bash
npm install @yallaling/ai-ui-components
```

### Universal Components (All Frameworks)
```bash
# Core utilities
npm install @yallaling/web-ai-core

# Universal web components (works everywhere)
npm install @yallaling/web-ai-components
```

### Framework-Specific Examples
```bash
# React project
npm install @yallaling/ai-ui-components

# Vue/Angular/Svelte/Vanilla JS project
npm install @yallaling/web-ai-components @yallaling/web-ai-core
```

## 🚀 Usage

### React Components (React Projects)

```tsx
import React, { useState } from 'react';
import { 
  AITranslator, 
  AISummarizer, 
  AILanguageDetector,
  AIWriter,
  AIRewriter 
} from '@yallaling/ai-ui-components';

function App() {
  return (
    <div>
      <AITranslator
        width="100%"
        height="400px"
        resizable
        defaultSourceLanguage="en"
        defaultTargetLanguage="es"
      />
      
      <AISummarizer
        width="100%"
        height="300px"
        defaultMaxWords={100}
      />
      
      <AILanguageDetector
        width="100%"
        height="200px"
      />
    </div>
  );
}
```

### Universal Web Components (Any Framework)

#### Vanilla JavaScript
```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import '@yallaling/web-ai-components';
  </script>
</head>
<body>
  <ai-translator-element
    width="100%"
    height="400px"
    resizable="true"
    default-source-language="en"
    default-target-language="es">
  </ai-translator-element>
  
  <ai-summarizer-element
    width="100%"
    height="300px"
    default-max-words="100">
  </ai-summarizer-element>
  
  <ai-language-detector-element
    width="100%"
    height="200px">
  </ai-language-detector-element>
</body>
</html>
```

#### Vue 3
```vue
<template>
  <div>
    <ai-translator-element
      width="100%"
      height="400px"
      :resizable="true"
      default-source-language="en"
      default-target-language="es"
      @translation-complete="handleTranslation"
    />
    
    <ai-summarizer-element
      width="100%"
      height="300px"
      :default-max-words="100"
      @summary-complete="handleSummary"
    />
  </div>
</template>

<script setup>
import '@yallaling/web-ai-components';

const handleTranslation = (event) => {
  console.log('Translation result:', event.detail);
};

const handleSummary = (event) => {
  console.log('Summary result:', event.detail);
};
</script>
```

#### Angular
```typescript
// app.component.ts
import { Component, AfterViewInit } from '@angular/core';
import '@yallaling/web-ai-components';

@Component({
  selector: 'app-root',
  template: `
    <ai-translator-element
      width="100%"
      height="400px"
      [attr.resizable]="true"
      default-source-language="en"
      default-target-language="es"
      (translation-complete)="onTranslation($event)">
    </ai-translator-element>
    
    <ai-summarizer-element
      width="100%"
      height="300px"
      [attr.default-max-words]="100"
      (summary-complete)="onSummary($event)">
    </ai-summarizer-element>
  `
})
export class AppComponent {
  onTranslation(event: CustomEvent) {
    console.log('Translation:', event.detail);
  }
  
  onSummary(event: CustomEvent) {
    console.log('Summary:', event.detail);
  }
}
```

#### Svelte
```svelte
<script>
  import '@yallaling/web-ai-components';
  
  function handleTranslation(event) {
    console.log('Translation result:', event.detail);
  }
  
  function handleSummary(event) {
    console.log('Summary result:', event.detail);
  }
</script>

<ai-translator-element
  width="100%"
  height="400px"
  resizable="true"
  default-source-language="en"
  default-target-language="es"
  on:translation-complete={handleTranslation}
/>

<ai-summarizer-element
  width="100%"
  height="300px"
  default-max-words="100"
  on:summary-complete={handleSummary}
/>
```

## React Legacy Example (Chat Components)

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

## 🧩 Available Components

### Universal AI Components (All Frameworks)

| Component | React | Universal Element | Description |
|-----------|--------|-------------------|-------------|
| Translator | `<AITranslator />` | `<ai-translator-element>` | Translate text between languages |
| Summarizer | `<AISummarizer />` | `<ai-summarizer-element>` | Summarize long text content |
| Language Detector | `<AILanguageDetector />` | `<ai-language-detector-element>` | Detect language of input text |
| Writer | `<AIWriter />` | `<ai-writer-element>` | AI-powered content writing assistant |
| Rewriter | `<AIRewriter />` | `<ai-rewriter-element>` | Rewrite and improve existing text |

### React-Only Components

| Component | Element | Description |
|-----------|---------|-------------|
| Chat Interface | `<AIChat />` | Complete chat interface with message history |
| AI Prompt | `<AIPrompt />` | Simple AI prompt input/output component |
| Button | `<Button />` | Versatile button with multiple variants |
| Loading Spinner | `<LoadingSpinner />` | Animated loading indicator |

## 🔧 Component Props & Features

### Universal AI Component Features
All universal AI components support these common props:

- `width` - Component width (string, e.g., "100%", "400px")
- `height` - Component height (string, e.g., "300px", "auto")
- `resizable` - Enable drag-to-resize functionality (boolean)
- `theme` - Light/dark theme support
- **Markdown Rendering** - Rich output formatting
- **Copy to Clipboard** - One-click copying
- **Download Results** - Save as `.md` files
- **Toast Notifications** - User feedback
- **Accessibility** - WCAG compliant

### AITranslator / ai-translator-element

```tsx
// React
<AITranslator
  width="100%"
  height="400px"
  resizable
  defaultSourceLanguage="en"
  defaultTargetLanguage="es"
  onTranslationComplete={(result) => console.log(result)}
/>

// Universal
<ai-translator-element
  width="100%"
  height="400px"
  resizable="true"
  default-source-language="en"
  default-target-language="es"
  @translation-complete="handleTranslation"
></ai-translator-element>
```

**Props:**
- `defaultSourceLanguage`: Default source language code (e.g., "en", "es", "fr")
- `defaultTargetLanguage`: Default target language code
- `onTranslationComplete` / `@translation-complete`: Callback when translation finishes

### AISummarizer / ai-summarizer-element

```tsx
// React
<AISummarizer
  width="100%"
  height="300px"
  defaultMaxWords={100}
  defaultSummaryType="bullet-points"
  onSummaryComplete={(result) => console.log(result)}
/>

// Universal
<ai-summarizer-element
  width="100%"
  height="300px"
  default-max-words="100"
  default-summary-type="bullet-points"
  @summary-complete="handleSummary"
></ai-summarizer-element>
```

**Props:**
- `defaultMaxWords`: Maximum words in summary (number)
- `defaultSummaryType`: "paragraph" | "bullet-points" | "key-insights"
- `onSummaryComplete` / `@summary-complete`: Callback when summary finishes

### AILanguageDetector / ai-language-detector-element

```tsx
// React
<AILanguageDetector
  width="100%"
  height="200px"
  onDetectionComplete={(result) => console.log(result)}
/>

// Universal
<ai-language-detector-element
  width="100%"
  height="200px"
  @detection-complete="handleDetection"
></ai-language-detector-element>
```

**Props:**
- `onDetectionComplete` / `@detection-complete`: Callback when detection finishes

### AIWriter / ai-writer-element

```tsx
// React
<AIWriter
  width="100%"
  height="400px"
  defaultWritingStyle="professional"
  defaultContentType="blog-post"
  onWritingComplete={(result) => console.log(result)}
/>

// Universal
<ai-writer-element
  width="100%"
  height="400px"
  default-writing-style="professional"
  default-content-type="blog-post"
  @writing-complete="handleWriting"
></ai-writer-element>
```

**Props:**
- `defaultWritingStyle`: "professional" | "casual" | "creative" | "technical"
- `defaultContentType`: "blog-post" | "email" | "article" | "social-media"
- `onWritingComplete` / `@writing-complete`: Callback when writing finishes

### AIRewriter / ai-rewriter-element

```tsx
// React
<AIRewriter
  width="100%"
  height="400px"
  defaultRewriteStyle="improve-clarity"
  onRewriteComplete={(result) => console.log(result)}
/>

// Universal
<ai-rewriter-element
  width="100%"
  height="400px"
  default-rewrite-style="improve-clarity"
  @rewrite-complete="handleRewrite"
></ai-rewriter-element>
```

**Props:**
- `defaultRewriteStyle`: "improve-clarity" | "make-shorter" | "make-longer" | "simplify"
- `onRewriteComplete` / `@rewrite-complete`: Callback when rewriting finishes

## Legacy React Components

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

## 🛠️ Development

### Prerequisites
- Node.js 20+
- npm 10+
- Chrome 138+ (for Web AI features)

### Setup
```bash
# Clone the repository
git clone https://github.com/yallaling/ai-ui-components.git
cd ai-ui-components

# Install dependencies
npm install

# Start development
npm run storybook  # Starts on http://localhost:6006

# Run tests
npm test

# Build all packages
npm run build
```

### 🏗️ Monorepo Structure

This project uses a monorepo structure with multiple packages:

```
├── packages/
│   ├── core/                 # @yallaling/web-ai-core
│   ├── components/           # @yallaling/web-ai-components
│   └── react/                # React-specific components
├── src/                      # Main React library
├── stories/                  # Storybook documentation
└── .github/workflows/        # CI/CD automation
```

### 🔄 CI/CD Pipeline

**Automated GitHub Actions:**
- ✅ **Build & Test**: Runs on every PR and push
- ✅ **Storybook Deployment**: Auto-deploys to GitHub Pages
- ✅ **Package Publishing**: Automated npm publishing
- ✅ **Cross-Platform Testing**: Tests on multiple Node versions

**Workflows:**
- `.github/workflows/ci.yml` - Build, test, and deploy pipeline
- Automatic Storybook deployment to `https://yallaling.github.io/ai-ui-components/`

### Scripts
- `npm run build` - Build all packages for production
- `npm run dev` - Build in watch mode
- `npm test` - Run tests with coverage
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint all code
- `npm run format` - Format all code
- `npm run storybook` - Start Storybook (port 6006)
- `npm run build-storybook` - Build Storybook for deployment

### 📦 Publishing

**Automated Publishing:**
```bash
# Bump version and publish
npm version patch  # or minor, major
git push origin main --tags
# GitHub Actions automatically publishes to npm
```

**Manual Publishing:**
```bash
npm run build
npm publish
```

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
