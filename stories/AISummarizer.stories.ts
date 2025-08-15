import type { Meta, StoryObj } from '@storybook/react-vite';
import AISummarizer from '../src/components/AISummarizer/AISummarizer';

// Manual spy function factory for Storybook actions
const createSpyFn = (name: string) => {
  const fn = (...args: any[]) => {
    console.log(`[Storybook Action] ${name}:`, args);
  };
  fn.mock = { calls: [] as any[][] };
  return fn;
};

const meta: Meta<typeof AISummarizer> = {
  title: 'AI Components/AISummarizer',
  component: AISummarizer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A text summarization component using Chrome\'s built-in AI summarization API. Supports multiple summary types, formats, and lengths.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    onSummarize: createSpyFn('onSummarize'),
    onError: createSpyFn('onError'),
    onProgress: createSpyFn('onProgress'),
    onStreamingChunk: createSpyFn('onStreamingChunk'),
    onSummarizerReady: createSpyFn('onSummarizerReady'),
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['tldr', 'key-points', 'teaser', 'headline'],
      description: 'Type of summary to generate',
    },
    format: {
      control: { type: 'select' },
      options: ['plain-text', 'markdown'],
      description: 'Output format',
    },
    length: {
      control: { type: 'select' },
      options: ['short', 'medium', 'long'],
      description: 'Summary length',
    },
    autoSummarize: {
      control: { type: 'boolean' },
      description: 'Auto-summarize when text changes',
    },
    streaming: {
      control: { type: 'boolean' },
      description: 'Enable streaming mode',
    },
    showOptions: {
      control: { type: 'boolean' },
      description: 'Show summary options panel',
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

const sampleText = `Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. The term may also be applied to any machine that exhibits traits associated with a human mind such as learning and problem-solving.

The ideal characteristic of artificial intelligence is its ability to rationalize and take actions that have the best chance of achieving a specific goal. A subset of artificial intelligence is machine learning, which refers to the concept that computer programs can automatically learn from and adapt to new data without being assisted by humans.

Deep learning enables this automatic learning through the absorption of huge amounts of unstructured data such as text, images, or video. AI is being used in many industries including healthcare, finance, transportation, and entertainment. As AI technology continues to advance, it promises to revolutionize how we work, communicate, and solve complex problems.`;

export const Default: Story = {
  args: {
    text: sampleText,
    type: 'tldr',
    format: 'plain-text',
    length: 'medium',
    showControls: true,
    showOptions: true,
  },
};

export const KeyPoints: Story = {
  args: {
    text: sampleText,
    type: 'key-points',
    format: 'markdown',
    length: 'medium',
    showControls: true,
    showOptions: true,
  },
};

export const Headline: Story = {
  args: {
    text: sampleText,
    type: 'headline',
    format: 'plain-text',
    length: 'short',
    showControls: true,
    showOptions: true,
  },
};

export const AutoSummarize: Story = {
  args: {
    text: 'This text will be automatically summarized when it changes.',
    type: 'tldr',
    format: 'plain-text',
    length: 'short',
    autoSummarize: true,
    showControls: true,
    showOptions: true,
  },
};

export const WithContext: Story = {
  args: {
    text: sampleText,
    context: 'This is an educational article about artificial intelligence for beginners.',
    type: 'teaser',
    format: 'markdown',
    length: 'medium',
    showControls: true,
    showOptions: true,
  },
};

export const Streaming: Story = {
  args: {
    text: sampleText,
    type: 'tldr',
    format: 'plain-text',
    length: 'long',
    streaming: true,
    showControls: true,
    showOptions: true,
  },
};

export const ExternalData: Story = {
  args: {
    data: {
      title: "AI Research Paper",
      content: sampleText,
      metadata: {
        author: "John Doe",
        published: "2024-01-15"
      }
    },
    type: 'key-points',
    format: 'markdown',
    length: 'medium',
    showControls: true,
    showOptions: true,
  },
};

export const HeadlessMode: Story = {
  args: {
    data: sampleText,
    type: 'tldr',
    format: 'plain-text',
    length: 'short',
    showInput: false,
    showControls: false,
    showOutput: true,
    autoSummarize: true,
  },
};

export const InputOnlyMode: Story = {
  args: {
    text: sampleText,
    type: 'headline',
    format: 'plain-text',
    length: 'short',
    showInput: true,
    showControls: true,
    showOutput: false,
  },
};

export const ArrayData: Story = {
  args: {
    data: [
      "First paragraph of important information.",
      "Second paragraph with additional details.",
      "Third paragraph with concluding thoughts."
    ],
    type: 'tldr',
    format: 'plain-text',
    length: 'medium',
    showControls: true,
    showOptions: true,
  },
};

export const ControlsOnly: Story = {
  args: {
    controlsOnly: true,
    externalText: sampleText,
    type: 'tldr',
    format: 'plain-text',
    length: 'medium',
    showControls: true,
    showOptions: true,
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
    text: sampleText,
    width: '800px',
    type: 'key-points',
    format: 'markdown',
    length: 'medium',
    showControls: true,
    showOptions: true,
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'summary-points.md',
  },
};

export const CustomHeight: Story = {
  args: {
    text: sampleText,
    height: '600px',
    type: 'tldr',
    format: 'markdown',
    length: 'long',
    showControls: true,
    showOptions: true,
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'detailed-summary.md',
  },
};

export const ResizableSummarizer: Story = {
  args: {
    text: sampleText,
    width: '700px',
    height: '500px',
    resizable: true,
    type: 'teaser',
    format: 'markdown',
    length: 'medium',
    showControls: true,
    showOptions: true,
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'teaser-summary.md',
  },
};

export const BlueTheme: Story = {
  args: {
    text: sampleText,
    width: '100%',
    style: {
      border: '2px solid #3b82f6',
      borderRadius: '16px',
      backgroundColor: '#eff6ff',
      boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1)',
    },
    type: 'key-points',
    format: 'markdown',
    length: 'medium',
    showControls: true,
    showOptions: true,
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'blue-theme-summary.md',
  },
};

export const GreenGradient: Story = {
  args: {
    text: sampleText,
    width: '750px',
    height: '450px',
    resizable: true,
    style: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      borderRadius: '20px',
      padding: '12px',
      border: 'none',
      color: 'white',
    },
    type: 'headline',
    format: 'markdown',
    length: 'short',
    showControls: true,
    showOptions: true,
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'green-headline.md',
  },
};

export const CompactSummarizer: Story = {
  args: {
    text: "This is a shorter text for compact summarization. It contains some key information that needs to be condensed.",
    width: '400px',
    height: '300px',
    type: 'tldr',
    format: 'plain-text',
    length: 'short',
    showControls: false,
    showOptions: false,
    style: {
      fontSize: '14px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
    },
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'compact-summary.md',
  },
};

export const DarkMode: Story = {
  args: {
    text: sampleText,
    width: '800px',
    height: '550px',
    resizable: true,
    style: {
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      borderRadius: '12px',
      border: '1px solid #374151',
      color: '#f9fafb',
    },
    type: 'key-points',
    format: 'markdown',
    length: 'long',
    showControls: true,
    showOptions: true,
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'dark-mode-summary.md',
  },
};

export const PurpleAccent: Story = {
  args: {
    text: sampleText,
    width: '650px',
    height: '400px',
    resizable: true,
    style: {
      border: '3px solid #8b5cf6',
      borderRadius: '18px',
      backgroundColor: '#faf5ff',
      boxShadow: '0 8px 25px -5px rgba(139, 92, 246, 0.3)',
    },
    type: 'teaser',
    format: 'markdown',
    length: 'medium',
    showControls: true,
    showOptions: true,
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'purple-teaser.md',
  },
};
