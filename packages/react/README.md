# @yallaling/ai-ui-components v2.0

React wrapper components for the universal Chrome AI Web Components. This package provides React-friendly components that maintain backward compatibility with the v1.x API while leveraging universal Web Components underneath.

## ✨ What's New in v2.0

- **Universal Compatibility**: Components now work in React, Vue, Angular, Svelte, and Vanilla JS
- **Zero Breaking Changes**: Existing React code continues to work
- **Smaller Bundle**: Leverages shared Web Components for smaller overall footprint
- **Better Performance**: Web Components provide better encapsulation and performance
- **Future-Proof**: Framework-agnostic architecture

## 🚀 Quick Start

### Installation

```bash
npm install @yallaling/ai-ui-components
```

### Basic Usage

```tsx
import React from 'react';
import { AITranslator, AISummarizer } from '@yallaling/ai-ui-components';

function App() {
  return (
    <div>
      <AITranslator
        sourceLanguage="en"
        targetLanguage="es"
        autoTranslate={true}
        onTranslate={(result) => console.log('Translation:', result)}
      />
      
      <AISummarizer
        type="key-points"
        length="medium"
        onSummarize={(summary) => console.log('Summary:', summary)}
      />
    </div>
  );
}
```

## 📚 Components

### AITranslator

Translates text using Chrome's built-in AI translation API.

```tsx
<AITranslator
  sourceLanguage="en"
  targetLanguage="es"
  text="Hello, world!"
  autoTranslate={true}
  streaming={false}
  onTranslate={(translatedText) => console.log(translatedText)}
  onError={(error) => console.error(error)}
/>
```

**Props:**
- `sourceLanguage` - Source language code (e.g., 'en', 'es', 'fr')
- `targetLanguage` - Target language code
- `text` - Text to translate
- `data` - External data to translate (any type)
- `autoTranslate` - Auto-translate when text changes
- `streaming` - Enable streaming translation
- `onTranslate` - Callback when translation completes
- `onError` - Callback for errors
- Plus all standard React props

### AISummarizer

Summarizes text using Chrome's built-in AI summarization API.

```tsx
<AISummarizer
  type="key-points"
  format="markdown"
  length="medium"
  text="Long text to summarize..."
  autoSummarize={true}
  onSummarize={(summary) => console.log(summary)}
/>
```

**Props:**
- `type` - Summary type: 'key-points' | 'tldr' | 'teaser' | 'headline'
- `format` - Output format: 'markdown' | 'plain-text'
- `length` - Summary length: 'short' | 'medium' | 'long'
- `text` - Text to summarize
- `data` - External data to summarize (any type)
- `autoSummarize` - Auto-summarize when text changes
- `onSummarize` - Callback when summarization completes
- Plus all standard React props

### LoadingSpinner

Simple loading spinner component.

```tsx
<LoadingSpinner
  size="medium"
  color="#007bff"
  message="Loading..."
  showMessage={true}
/>
```

## 🔄 Migration from v1.x

**Good news**: No changes required! Your existing code will continue to work:

```tsx
// v1.x code - still works in v2.x
import { AITranslator } from '@yallaling/ai-ui-components';

function MyComponent() {
  return (
    <AITranslator
      sourceLanguage="en"
      targetLanguage="es"
      onTranslate={(result) => console.log(result)}
    />
  );
}
```

## 🏗 Architecture

v2.0 uses a layered architecture:

```
React Components (this package)
       ↓
Universal Web Components (@yallaling/chrome-ai-components)
       ↓
Framework-agnostic Core Logic (@yallaling/chrome-ai-core)
       ↓
Chrome AI APIs
```

This means:
- **Smaller bundles** when using multiple AI components
- **Better performance** through Web Component encapsulation
- **Universal compatibility** - same components work in any framework
- **Future-proof** architecture

## 🌟 Advanced Usage

### External Data Integration

```tsx
function DataProcessor() {
  const [data, setData] = useState(null);
  
  return (
    <AITranslator
      data={data}  // Can be any type
      autoTranslate={true}
      onTranslate={(result) => {
        // Handle translation
      }}
    />
  );
}
```

### Programmatic Control

```tsx
function ControlledTranslator() {
  const [translateFunction, setTranslateFunction] = useState(null);
  
  return (
    <div>
      <AITranslator
        controlsOnly={true}
        onTranslatorReady={(translate) => setTranslateFunction(() => translate)}
      />
      
      <button onClick={() => translateFunction?.('Hello!')}>
        Translate "Hello!"
      </button>
    </div>
  );
}
```

### Event Handling

```tsx
<AITranslator
  onTranslate={(text) => console.log('Translated:', text)}
  onError={(error) => console.error('Error:', error)}
  onProgress={(loaded, total) => console.log(`Progress: ${loaded}/${total}`)}
/>
```

## 🔧 TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import { AITranslatorProps, AISummarizerProps } from '@yallaling/ai-ui-components';

const translatorConfig: AITranslatorProps = {
  sourceLanguage: 'en',
  targetLanguage: 'es',
  autoTranslate: true
};
```

## 🚀 Performance

- **Lazy Loading**: Web Components are only loaded when used
- **Shared Core**: Multiple components share the same core logic
- **Optimized Bundles**: Tree-shaking friendly exports
- **Memory Efficient**: Web Components handle their own lifecycle

## 🛠 Browser Requirements

- Chrome 127+ with AI flags enabled
- Modern browsers with Web Components support
- React 16.8+ (hooks support)

## 📦 Bundle Size

| Package | Size | Dependencies |
|---------|------|-------------|
| React Wrappers | ~5KB | React, Web Components |
| Web Components | ~25KB | Lit (shared) |
| Core Logic | ~15KB | Zero |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Add tests for new components
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Need help?** [Open an issue](https://github.com/yallaling/ai-ui-components/issues) or check the [documentation](https://github.com/yallaling/ai-ui-components).
