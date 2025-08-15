import type { Meta, StoryObj } from '@storybook/react-vite';
import AITranslator from '../src/components/AITranslator/AITranslator';

// Manual spy function factory for Storybook actions
const createSpyFn = (name: string) => {
  const fn = (...args: any[]) => {
    console.log(`[Storybook Action] ${name}:`, args);
  };
  fn.mock = { calls: [] as any[][] };
  return fn;
};

const meta: Meta<typeof AITranslator> = {
  title: 'AI Components/AITranslator',
  component: AITranslator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A translation component using Chrome\'s built-in AI translation API. Supports multiple languages with progress monitoring and error handling.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    onTranslate: createSpyFn('onTranslate'),
    onError: createSpyFn('onError'),
    onProgress: createSpyFn('onProgress'),
    onTranslatorReady: createSpyFn('onTranslatorReady'),
  },
  argTypes: {
    sourceLanguage: {
      control: { type: 'select' },
      options: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
      description: 'Source language code',
    },
    targetLanguage: {
      control: { type: 'select' },
      options: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
      description: 'Target language code',
    },
    autoTranslate: {
      control: { type: 'boolean' },
      description: 'Automatically translate when text changes',
    },
    streaming: {
      control: { type: 'boolean' },
      description: 'Enable streaming translation',
    },
    showControls: {
      control: { type: 'boolean' },
      description: 'Show translation controls',
    },
    controlsOnly: {
      control: { type: 'boolean' },
      description: 'Controls-only mode for external data integration',
    },
    externalText: {
      control: { type: 'text' },
      description: 'External text data when using controls-only mode',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sourceLanguage: 'en',
    targetLanguage: 'es',
    text: 'Hello, how are you today?',
    showControls: true,
  },
};

export const AutoTranslate: Story = {
  args: {
    sourceLanguage: 'en',
    targetLanguage: 'fr',
    text: 'This text will be automatically translated.',
    autoTranslate: true,
    showControls: true,
  },
};

export const WithoutControls: Story = {
  args: {
    sourceLanguage: 'en',
    targetLanguage: 'de',
    text: 'Simple translation without controls',
    showControls: false,
  },
};

export const LongText: Story = {
  args: {
    sourceLanguage: 'en',
    targetLanguage: 'ja',
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    showControls: true,
    maxLength: 1000,
  },
};

export const ExternalData: Story = {
  args: {
    sourceLanguage: 'en',
    targetLanguage: 'es',
    data: {
      message: "Hello, how are you today?",
      context: "greeting"
    },
    showControls: true,
    showInput: true,
    showOutput: true,
  },
};

export const HeadlessMode: Story = {
  args: {
    sourceLanguage: 'en',
    targetLanguage: 'fr',
    data: "This is a headless translation component.",
    showInput: false,
    showControls: false,
    showOutput: true,
    autoTranslate: true,
  },
};

export const InputOnlyMode: Story = {
  args: {
    sourceLanguage: 'en',
    targetLanguage: 'de',
    text: "Input only mode - translation output is hidden",
    showInput: true,
    showControls: true,
    showOutput: false,
  },
};

export const ArrayData: Story = {
  args: {
    sourceLanguage: 'en',
    targetLanguage: 'it',
    data: [
      "First sentence to translate.",
      "Second sentence to translate.",
      "Third sentence to translate."
    ],
    showControls: true,
    showInput: true,
    showOutput: true,
  },
};

export const Streaming: Story = {
  args: {
    sourceLanguage: 'en',
    targetLanguage: 'zh',
    text: 'This example demonstrates streaming translation for real-time results.',
    streaming: true,
    showControls: true,
  },
};

export const ControlsOnly: Story = {
  args: {
    controlsOnly: true,
    externalText: 'Hello, how are you today? This text is provided externally.',
    sourceLanguage: 'en',
    targetLanguage: 'es',
    showControls: true,
    showOutput: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Controls-only mode for external data integration. The component shows only controls and output, using external text data passed via props. Perfect for integration with other components or data sources.',
      },
    },
  },
};

// NEW: Custom Sizing Examples
export const CustomWidth: Story = {
  args: {
    text: 'Welcome to our application! We hope you enjoy using our translation service.',
    sourceLanguage: 'en',
    targetLanguage: 'fr',
    width: '750px',
    showControls: true,
    showInput: true,
    showOutput: true,
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'french-translation.md',
  },
};

export const CustomHeight: Story = {
  args: {
    text: 'Technology is advancing rapidly in the modern world. Artificial intelligence is becoming more sophisticated.',
    sourceLanguage: 'en',
    targetLanguage: 'de',
    height: '550px',
    showControls: true,
    showInput: true,
    showOutput: true,
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'german-translation.md',
  },
};

export const ResizableTranslator: Story = {
  args: {
    text: 'The weather is beautiful today. Would you like to go for a walk in the park?',
    sourceLanguage: 'en',
    targetLanguage: 'it',
    width: '650px',
    height: '450px',
    resizable: true,
    showControls: true,
    showInput: true,
    showOutput: true,
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'italian-translation.md',
  },
};

export const BlueGradient: Story = {
  args: {
    text: 'Good morning! I hope you have a wonderful day ahead of you.',
    sourceLanguage: 'en',
    targetLanguage: 'ja',
    width: '700px',
    height: '400px',
    resizable: true,
    style: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      borderRadius: '16px',
      padding: '12px',
      border: 'none',
      color: 'white',
    },
    showControls: true,
    showInput: true,
    showOutput: true,
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'japanese-translation.md',
  },
};

export const RedAccent: Story = {
  args: {
    text: '¡Hola! ¿Cómo estás? Espero que tengas un buen día.',
    sourceLanguage: 'es',
    targetLanguage: 'en',
    width: '100%',
    style: {
      border: '3px solid #ef4444',
      borderRadius: '12px',
      backgroundColor: '#fef2f2',
      boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.1)',
    },
    showControls: true,
    showInput: true,
    showOutput: true,
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'spanish-to-english.md',
  },
};

export const CompactTranslator: Story = {
  args: {
    text: 'Hello',
    sourceLanguage: 'en',
    targetLanguage: 'ko',
    width: '400px',
    height: '280px',
    showControls: false,
    showInput: true,
    showOutput: true,
    style: {
      fontSize: '14px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
    },
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'korean-translation.md',
  },
};

export const DarkTheme: Story = {
  args: {
    text: 'The future of artificial intelligence looks very promising for humanity.',
    sourceLanguage: 'en',
    targetLanguage: 'ru',
    width: '800px',
    height: '500px',
    resizable: true,
    style: {
      background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
      borderRadius: '12px',
      border: '1px solid #4b5563',
      color: '#f9fafb',
    },
    showControls: true,
    showInput: true,
    showOutput: true,
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'russian-translation.md',
  },
};

export const PurpleStyle: Story = {
  args: {
    text: 'Bonjour! Comment allez-vous? J\'espère que vous passez une excellente journée.',
    sourceLanguage: 'fr',
    targetLanguage: 'en',
    width: '600px',
    height: '420px',
    resizable: true,
    style: {
      border: '2px solid #8b5cf6',
      borderRadius: '20px',
      backgroundColor: '#faf5ff',
      boxShadow: '0 8px 25px -5px rgba(139, 92, 246, 0.25)',
    },
    showControls: true,
    showInput: true,
    showOutput: true,
    streaming: true,
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'french-to-english.md',
  },
};
