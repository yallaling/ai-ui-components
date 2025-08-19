import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { UniversalComponentWrapper } from './UniversalComponentWrapper';

// Define meta information for the universal components story
const meta: Meta<typeof UniversalComponentWrapper> = {
  title: 'Universal Components/Framework Integration',
  component: UniversalComponentWrapper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Universal Chrome AI Components

These are framework-agnostic web components that work in React, Vue, Angular, Svelte, and vanilla JavaScript.

### Installation
\`\`\`bash
npm install @yallaling/web-ai-components
\`\`\`

### Available Components
- \`ai-translator-element\` - Universal translation component
- \`ai-summarizer-element\` - Text summarization component
- \`ai-language-detector-element\` - Language detection component
- \`ai-writer-element\` - Content generation component
- \`ai-rewriter-element\` - Text rewriting component
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof UniversalComponentWrapper>;

export const WriterUniversal: Story = {
  name: 'AI Writer (Universal)',
  args: {
    title: 'Universal AI Writer Web Component',
    description: 'Generate content with customizable tone and format - Click the "Write" button to see it in action!',
    componentTag: 'ai-writer-element',
    attributes: {
      'prompt': 'Write a product description for a smart fitness tracker',
      'context': 'Target audience: health-conscious professionals aged 25-45',
      'tone': 'professional',
      'format': 'paragraph',
      'length': 'medium'
    }
  }
};

export const SummarizerUniversal: Story = {
  name: 'AI Summarizer (Universal)',
  args: {
    title: 'Universal AI Summarizer Web Component',
    description: 'Summarize any text with configurable options - Click "Summarize" to see it in action!',
    componentTag: 'ai-summarizer-element',
    attributes: {
      'text': 'Artificial Intelligence (AI) has become one of the most transformative technologies of the 21st century, revolutionizing industries from healthcare to finance, transportation to entertainment. Machine learning algorithms can now process vast amounts of data to identify patterns, make predictions, and automate complex tasks that were once thought to require human intelligence.',
      'type': 'tldr',
      'format': 'markdown',
      'length': 'medium'
    }
  }
};

export const TranslatorUniversal: Story = {
  name: 'AI Translator (Universal)',
  args: {
    title: 'Universal AI Translator Web Component',
    description: 'This component works in any framework or vanilla HTML. Try changing the text and clicking "Translate"!',
    componentTag: 'ai-translator-element',
    attributes: {
      'source-language': 'en',
      'target-language': 'es',
      'text': 'Hello! Welcome to our universal AI translation component.',
      'auto-translate': 'true',
      'show-input': 'true',
      'show-controls': 'true',
      'show-output': 'true'
    }
  }
};

export const LanguageDetectorUniversal: Story = {
  name: 'AI Language Detector (Universal)',
  args: {
    title: 'Universal AI Language Detector Web Component',
    description: 'Detect the language of any text input. Click "Detect Language" to see the results!',
    componentTag: 'ai-language-detector-element',
    attributes: {
      'text': 'Bonjour! Comment allez-vous aujourd\'hui? J\'espère que vous passez une excellente journée.'
    }
  }
};

export const RewriterUniversal: Story = {
  name: 'AI Rewriter (Universal)',
  args: {
    title: 'Universal AI Rewriter Web Component',
    description: 'Rewrite text with different tones and styles. Click "Rewrite" to see the magic happen!',
    componentTag: 'ai-rewriter-element',
    attributes: {
      'text': 'The weather today is really good. I think we should go outside and enjoy the sunshine.',
      'context': 'Make this sound more professional and formal',
      'tone': 'professional',
      'format': 'paragraph',
      'length': 'medium'
    }
  }
};

// Framework Integration Examples
export const FrameworkExamples: Story = {
  name: 'Framework Integration Examples',
  args: {
    title: 'Cross-Framework Usage Examples',
    description: 'See how to use these components in different frameworks',
    componentTag: 'div',
    attributes: {}
  },
  render: () => React.createElement('div', {
    style: { maxWidth: '800px', fontFamily: 'monospace', background: '#f5f5f5', padding: '20px', borderRadius: '8px' }
  }, [
    React.createElement('h4', { key: 'react-title' }, 'React Usage:'),
    React.createElement('pre', {
      key: 'react-code',
      style: { background: '#fff', padding: '15px', borderRadius: '4px', margin: '10px 0' }
    }, `import { AISummarizer } from '@yallaling/ai-ui-components';

function App() {
  const handleResult = (result) => {
    console.log('Summary:', result);
  };

  return (
    <AISummarizer 
      text="Your text here..."
      onResult={handleResult} 
    />
  );
}`),

    React.createElement('h4', { key: 'vue-title' }, 'Vue Usage:'),
    React.createElement('pre', {
      key: 'vue-code',
      style: { background: '#fff', padding: '15px', borderRadius: '4px', margin: '10px 0' }
    }, `<template>
  <ai-summarizer-element 
    :text="textToSummarize"
    @summary-complete="handleResult"
  />
</template>

<script>
import '@yallaling/web-ai-components';

export default {
  methods: {
    handleResult(event) {
      console.log('Summary:', event.detail);
    }
  }
}
</script>`),

    React.createElement('h4', { key: 'angular-title' }, 'Angular Usage:'),
    React.createElement('pre', {
      key: 'angular-code',
      style: { background: '#fff', padding: '15px', borderRadius: '4px', margin: '10px 0' }
    }, `// In your component template
<ai-summarizer-element 
  [text]="textToSummarize"
  (summary-complete)="handleResult($event)">
</ai-summarizer-element>

// In your component
export class MyComponent {
  handleResult(event: CustomEvent) {
    console.log('Summary:', event.detail);
  }
}`),

    React.createElement('h4', { key: 'vanilla-title' }, 'Vanilla JavaScript:'),
    React.createElement('pre', {
      key: 'vanilla-code',
      style: { background: '#fff', padding: '15px', borderRadius: '4px', margin: '10px 0' }
    }, `<!-- In your HTML -->
<ai-summarizer-element id="summarizer"></ai-summarizer-element>

<script type="module">
import '@yallaling/web-ai-components';

const summarizer = document.getElementById('summarizer');
summarizer.text = 'Your text to summarize...';
summarizer.addEventListener('summary-complete', (event) => {
  console.log('Summary:', event.detail);
});
</script>`)
  ])
};
