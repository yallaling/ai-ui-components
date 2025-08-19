import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { SecureWebComponent } from './SecureWebComponent';

// Simple demo component to test universal web components
const UniversalComponentsDemo = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Import and test the universal components
    const loadComponents = async () => {
      try {
        await import('@yallaling/web-ai-components');
        setIsLoaded(true);
        console.log('✅ Universal Web AI Components loaded successfully!');
      } catch (err) {
        console.error('❌ Failed to load components:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    loadComponents();
  }, []);

  return React.createElement('div', {
    style: {
      maxWidth: '1000px',
      margin: '20px auto',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }
  }, [
    React.createElement('div', {
      key: 'header',
      style: {
        textAlign: 'center',
        marginBottom: '30px',
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '10px'
      }
    }, [
      React.createElement('h1', { key: 'title' }, '🎉 Universal Chrome AI Components'),
      React.createElement('p', { key: 'subtitle' }, 'Framework-agnostic AI components that work in React, Vue, Angular, Svelte, and vanilla JS')
    ]),

    // Status indicator
    React.createElement('div', {
      key: 'status',
      style: {
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '25px',
        background: isLoaded ? '#e8f5e8' : error ? '#fce8e6' : '#fff3cd',
        border: `1px solid ${isLoaded ? '#28a745' : error ? '#dc3545' : '#ffc107'}`,
        color: isLoaded ? '#155724' : error ? '#721c24' : '#856404'
      }
    }, [
      React.createElement('strong', { key: 'status-label' }, 'Status: '),
      React.createElement('span', { key: 'status-text' }, 
        isLoaded ? '✅ Components loaded successfully!' : 
        error ? `❌ Error: ${error}` : 
        '⏳ Loading components...'
      )
    ]),

    // Component showcase
    isLoaded ? React.createElement('div', {
      key: 'showcase',
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '25px'
      }
    }, [
      // Translator
      React.createElement('div', {
        key: 'translator',
        style: {
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          background: '#f8f9fa'
        }
      }, [
        React.createElement('h3', { key: 'title', style: { marginTop: '0' } }, '🔄 AI Translator'),
        React.createElement('p', { key: 'desc' }, 'Universal translation component with auto-detection'),
        React.createElement('div', {
          key: 'component'
        }, React.createElement(SecureWebComponent, { 
          tagName: 'ai-translator-element',
          key: 'translator-component'
        }))
      ]),

      // Summarizer
      React.createElement('div', {
        key: 'summarizer',
        style: {
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          background: '#f8f9fa'
        }
      }, [
        React.createElement('h3', { key: 'title', style: { marginTop: '0' } }, '📝 AI Summarizer'),
        React.createElement('p', { key: 'desc' }, 'Text summarization with configurable options'),
        React.createElement('div', {
          key: 'component'
        }, React.createElement(SecureWebComponent, { 
          tagName: 'ai-summarizer-element',
          key: 'summarizer-component'
        }))
      ]),

      // Language Detector
      React.createElement('div', {
        key: 'detector',
        style: {
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          background: '#f8f9fa'
        }
      }, [
        React.createElement('h3', { key: 'title', style: { marginTop: '0' } }, '🌐 Language Detector'),
        React.createElement('p', { key: 'desc' }, 'Detect language with confidence scoring'),
        React.createElement('div', {
          key: 'component'
        }, React.createElement(SecureWebComponent, { 
          tagName: 'ai-language-detector-element',
          key: 'detector-component'
        }))
      ]),

      // Writer
      React.createElement('div', {
        key: 'writer',
        style: {
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          background: '#f8f9fa'
        }
      }, [
        React.createElement('h3', { key: 'title', style: { marginTop: '0' } }, '✍️ AI Writer'),
        React.createElement('p', { key: 'desc' }, 'Generate content with customizable tone'),
        React.createElement('div', {
          key: 'component'
        }, React.createElement(SecureWebComponent, { 
          tagName: 'ai-writer-element',
          key: 'writer-component'
        }))
      ]),

      // Rewriter
      React.createElement('div', {
        key: 'rewriter',
        style: {
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          background: '#f8f9fa'
        }
      }, [
        React.createElement('h3', { key: 'title', style: { marginTop: '0' } }, '🔄 AI Rewriter'),
        React.createElement('p', { key: 'desc' }, 'Rewrite text with different styles'),
        React.createElement('div', {
          key: 'component'
        }, React.createElement(SecureWebComponent, { 
          tagName: 'ai-rewriter-element',
          key: 'rewriter-component'
        }))
      ])
    ]) : null,

    // Installation guide
    React.createElement('div', {
      key: 'installation',
      style: {
        marginTop: '40px',
        padding: '25px',
        background: '#e8f4fd',
        borderRadius: '8px',
        border: '1px solid #bee5eb'
      }
    }, [
      React.createElement('h3', { key: 'title' }, '📦 Installation & Usage'),
      React.createElement('div', { key: 'install-code' }, [
        React.createElement('pre', {
          key: 'install-command',
          style: {
            background: '#f8f9fa',
            padding: '15px',
            borderRadius: '5px',
            overflow: 'auto'
          }
        }, `npm install @yallaling/web-ai-components`),
        React.createElement('h4', { key: 'framework-title' }, 'Framework Examples:'),
        React.createElement('div', { key: 'framework-examples', style: { display: 'grid', gap: '15px' } }, [
          React.createElement('div', { key: 'react' }, [
            React.createElement('strong', { key: 'react-label' }, 'React:'),
            React.createElement('pre', {
              key: 'react-code',
              style: { background: '#f8f9fa', padding: '10px', borderRadius: '3px' }
            }, `import '@yallaling/web-ai-components';
<ai-translator-element />`)
          ]),
          React.createElement('div', { key: 'vue' }, [
            React.createElement('strong', { key: 'vue-label' }, 'Vue:'),
            React.createElement('pre', {
              key: 'vue-code',
              style: { background: '#f8f9fa', padding: '10px', borderRadius: '3px' }
            }, `<ai-translator-element />`)
          ]),
          React.createElement('div', { key: 'vanilla' }, [
            React.createElement('strong', { key: 'vanilla-label' }, 'Vanilla JS:'),
            React.createElement('pre', {
              key: 'vanilla-code',
              style: { background: '#f8f9fa', padding: '10px', borderRadius: '3px' }
            }, `<script type="module">
import '@yallaling/web-ai-components';
</script>
<ai-translator-element></ai-translator-element>`)
          ])
        ])
      ])
    ])
  ]);
};

const meta: Meta<typeof UniversalComponentsDemo> = {
  title: 'Universal Components/Live Demo',
  component: UniversalComponentsDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Live Universal Components Demo

This story demonstrates all 5 universal Web AI components working in real-time with secure practices. These components are framework-agnostic and work identically in:

- ⚛️ **React** 
- 🟢 **Vue 3**
- 🅰️ **Angular**
- 🔥 **Svelte**
- 🌐 **Vanilla JavaScript**

## Published Packages

- \`@yallaling/web-ai-core@2.0.0\` - Framework-agnostic AI logic
- \`@yallaling/web-ai-components@2.0.0\` - Universal web components  
- \`@yallaling/web-ai-components@2.0.0\` - React components (v1.x compatible)

## Features

✅ **Universal Compatibility** - Single codebase, all frameworks  
✅ **Browser AI Integration** - Built-in AI APIs  
✅ **TypeScript Support** - Full type definitions  
✅ **Security First** - No innerHTML, secure by design
✅ **Modern Standards** - Web Components, ES modules  
✅ **Event-Driven** - Standard DOM events  
✅ **Zero Dependencies** - No framework lock-in  
        `
      }
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof UniversalComponentsDemo>;

export const LiveDemo: Story = {
  name: 'All Components Live Demo',
  render: () => React.createElement(UniversalComponentsDemo)
};
