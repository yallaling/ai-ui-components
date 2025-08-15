# Chrome AI Components

A comprehensive TypeScript React component library that provides easy-to-use interfaces for Chrome's built-in AI APIs. This library wraps Chrome's experimental AI capabilities in production-ready React components with proper error handling, loading states, and accessibility features.

## ✨ Features

- 🤖 **Complete Chrome AI Integration** - Supports all Chrome AI APIs (Translation, Language Detection, Summarization, Writing, Rewriting)
- 📦 **TypeScript First** - Full TypeScript support with comprehensive type definitions
- ⚛️ **React 18 Ready** - Built with modern React patterns and hooks
- 🎨 **Customizable Styling** - CSS modules with dark mode support
- 📱 **Responsive Design** - Mobile-friendly components
- ♿ **Accessible** - WCAG compliant with proper ARIA attributes
- 🔄 **Streaming Support** - Real-time AI responses with streaming capabilities
- 🛠️ **Developer Friendly** - Comprehensive Storybook documentation
- 🚀 **Production Ready** - Proper error handling and fallbacks

## 🚀 Installation

```bash
npm install ai-ui-components
# or
yarn add ai-ui-components
# or
pnpm add ai-ui-components
```

## 📋 Prerequisites

This library requires Chrome 127+ with Chrome AI features enabled:

1. **Chrome Canary/Dev** (recommended for latest features)
2. **Enable AI Features**:
   - Navigate to `chrome://flags/`
   - Enable "Prompt API for Gemini Nano"
   - Enable "Language Model API"
   - Restart Chrome

## 🎯 Quick Start

```tsx
import { AITranslator, AIWriter, AISummarizer } from 'ai-ui-components';

function App() {
  return (
    <div>
      {/* Simple translation interface */}
      <AITranslator
        sourceLanguage="en"
        targetLanguage="es"
        onTranslationComplete={(translation) => console.log(translation)}
      />
      
      {/* AI-powered content generation */}
      <AIWriter
        tone="professional"
        format="markdown"
        onContentGenerated={(content) => console.log(content)}
      />
      
      {/* Text summarization */}
      <AISummarizer
        type="key-points"
        format="markdown"
        onSummaryGenerated={(summary) => console.log(summary)}
      />
    </div>
  );
}
```

## 🧩 Components

### AITranslator
Translate text between languages using Chrome's built-in translation API.

```tsx
<AITranslator
  sourceLanguage="en"
  targetLanguage="fr"
  allowLanguageSwap={true}
  showProgress={true}
  onTranslationComplete={(translation) => {
    console.log('Translated:', translation);
  }}
/>
```

**Key Features:**
- 100+ language pairs support
- Language detection integration
- Real-time translation
- Progress indicators
- Language swap functionality

### AILanguageDetector
Automatically detect the language of text input.

```tsx
<AILanguageDetector
  showConfidence={true}
  minConfidence={0.7}
  onLanguageDetected={(result) => {
    console.log(`Detected: ${result.language} (${result.confidence})`);
  }}
/>
```

**Key Features:**
- Real-time language detection
- Confidence scoring
- Multiple language support
- Debounced input processing

### AISummarizer
Generate summaries from text using various formats and types.

```tsx
<AISummarizer
  type="key-points"
  format="markdown"
  length="medium"
  allowStreaming={true}
  onSummaryGenerated={(summary) => {
    console.log('Summary:', summary);
  }}
/>
```

**Key Features:**
- Multiple summary types (key-points, headline, tl;dr)
- Format options (plain, markdown)
- Streaming support
- Context-aware summarization

### AIWriter
Generate content with customizable tone, format, and length.

```tsx
<AIWriter
  tone="creative"
  format="markdown"
  length="long"
  allowStreaming={true}
  showControls={true}
  onContentGenerated={(content) => {
    console.log('Generated:', content);
  }}
/>
```

**Key Features:**
- Multiple tones (formal, casual, creative, professional)
- Output formats (plain, markdown, HTML)
- Length control
- Real-time streaming
- Template system

### AIRewriter
Improve and rewrite existing text while maintaining meaning.

```tsx
<AIRewriter
  tone="professional"
  format="plain"
  length="medium"
  allowStreaming={true}
  onContentRewritten={(content) => {
    console.log('Rewritten:', content);
  }}
/>
```

**Key Features:**
- Context-aware rewriting
- Tone adjustment
- Length modification
- Content swapping
- Iterative improvement

### AIPrompt (Enhanced)
Advanced prompt interface with AI assistance and templates.

```tsx
<AIPrompt
  showTemplates={true}
  enableAutoComplete={true}
  showAIAssistance={true}
  aiModel="rewriter"
  onSubmit={(prompt) => console.log('Submitted:', prompt)}
  onPromptImproved={(improved) => console.log('Improved:', improved)}
/>
```

**Key Features:**
- Prompt templates
- Auto-completion
- AI-powered prompt improvement
- Character limits
- Template library

## 🎨 Styling

All components come with default styling that can be customized:

```css
/* Override component styles */
.ai-translator {
  --primary-color: #your-brand-color;
  --border-radius: 8px;
  --font-family: 'Your Font', sans-serif;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .ai-translator {
    --background-color: #1f2937;
    --text-color: #f9fafb;
  }
}
```

## 🔧 TypeScript Support

The library includes comprehensive TypeScript definitions:

```tsx
import type {
  AITranslatorProps,
  AIWriterProps,
  AISummarizerProps,
  TranslationResult,
  LanguageDetectionResult,
  SummaryResult,
  // Chrome AI API types
  AITranslatorAPI,
  AIWriterAPI,
  AISummarizerAPI,
  WindowAI
} from 'ai-ui-components';
```

## 📖 API Reference

### Common Props

All components share these common props:

```tsx
interface BaseComponentProps {
  className?: string;
  'data-testid'?: string;
  disabled?: boolean;
  onError?: (error: string) => void;
}
```

### Event Handlers

```tsx
// Translation events
onTranslationComplete?: (translation: string) => void;
onTranslationProgress?: (progress: number) => void;

// Language detection events
onLanguageDetected?: (result: LanguageDetectionResult) => void;

// Content generation events
onContentGenerated?: (content: string) => void;
onStreamingChunk?: (chunk: string) => void;
onProgressUpdate?: (progress: number) => void;
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run Storybook
npm run storybook

# Build library
npm run build

# Run tests
npm test

# Type checking
npm run type-check
```

## 📚 Storybook

Explore components and their variations:

```bash
npm run storybook
```

Visit the [Storybook documentation](./storybook-static/index.html) for interactive examples.

## 🌐 Browser Support

- **Chrome 127+** (required for AI APIs)
- **Chrome Canary/Dev** (recommended)
- **Future Chrome-based browsers** with AI support

## ⚠️ Important Notes

1. **Experimental APIs**: Chrome AI APIs are experimental and may change
2. **Internet Connection**: Some AI features require internet connectivity
3. **Model Downloads**: First use may trigger model downloads
4. **Rate Limiting**: APIs may have usage limits
5. **Privacy**: Text processing may involve cloud services

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guidelines](./CONTRIBUTING.md).

```bash
# Fork the repository
git clone https://github.com/your-username/ai-ui-components.git

# Create a feature branch
git checkout -b feature/your-feature

# Make changes and commit
git commit -m "Add your feature"

# Push and create PR
git push origin feature/your-feature
```

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Chrome DevRel team for AI API documentation
- React team for excellent TypeScript support
- Storybook team for component development tools

## 🔗 Links

- [Chrome AI APIs Documentation](https://developer.chrome.com/docs/ai/)
- [Component Demo](https://your-demo-url.com)
- [NPM Package](https://www.npmjs.com/package/ai-ui-components)
- [GitHub Repository](https://github.com/your-username/ai-ui-components)

---

Built with ❤️ for the future of AI-powered web interfaces.
