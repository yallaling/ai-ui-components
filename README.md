# Chrome AI Components

A comprehensive TypeScript React component library for Chrome AI integration, built with modern tools and best practices.

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
npm install ai-ui-components
# or
yarn add ai-ui-components
```

## Usage

```tsx
import React from 'react';
```typescript
import { Button, AIChat, AIPrompt, LoadingSpinner } from 'ai-ui-components';

function App() {
  const handleSendMessage = (message: string) => {
    console.log('Message sent:', message);
  };

  return (
    <div>
      <Button variant="primary" size="large">
        Get Started
      </Button>
      
      <AIPrompt 
        onSubmit={handleSendMessage}
        placeholder="Enter your AI prompt..."
      />
      
      <LoadingSpinner size="medium" text="Processing..." />
    </div>
  );
}
```

### ✨ New Features Usage

```tsx
import { AIWriter, AISummarizer, Toaster } from 'ai-ui-components';

function AdvancedApp() {
  return (
    <div>
      {/* Resizable AI Writer with custom dimensions */}
      <AIWriter
        width="800px"
        height="600px"
        resizable={true}
        allowCopy={true}
        allowDownload={true}
        downloadFileName="my-content.md"
        placeholder="Write something amazing..."
      />
      
      {/* Responsive AI Summarizer */}
      <AISummarizer
        width="100%"
        style={{ minHeight: '300px' }}
        resizable={true}
        allowDownload={true}
        downloadFileName="summary.md"
      />
      
      {/* Required for toast notifications */}
      <Toaster position="top-right" />
    </div>
  );
}
```

## Components

### Button
A versatile button component with multiple variants and sizes.

```tsx
<Button variant="primary" size="medium" onClick={() => console.log('clicked')}>
  Click me
</Button>
```

### AIChat
A chat interface component for AI conversations.

```tsx
<AIChat 
  messages={messages}
  onSendMessage={handleSendMessage}
  isLoading={isLoading}
/>
```

### AIPrompt
A prompt input component for AI interactions.

```tsx
<AIPrompt 
  onSubmit={handlePromptSubmit}
  maxLength={500}
  showCounter={true}
/>
```

### LoadingSpinner
A loading indicator component.

```tsx
<LoadingSpinner 
  size="large" 
  text="Processing your request..." 
  overlay={true}
/>
```

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
- Node.js 16+
- npm 8+

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/ai-ui-components.git
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

- Chrome 88+
- Firefox 88+
- Safari 14+
- Edge 88+

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
