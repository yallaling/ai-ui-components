import type { Meta, StoryObj } from '@storybook/react-vite';
import AIWriter from '../src/components/AIWriter/AIWriter';

const meta: Meta<typeof AIWriter> = {
  title: 'AI Components/AIWriter',
  component: AIWriter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "AIWriter component for generating content using Chrome's built-in AI Writer API. Supports different tones, formats, and lengths with real-time streaming capabilities.",
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onContentGenerated: { action: 'content-generated' },
    onError: { action: 'error' },
    onProgressUpdate: { action: 'progress-update' },
    onStreamingChunk: { action: 'streaming-chunk' },
    tone: {
      control: 'select',
      options: ['formal', 'casual'],
      description: 'The tone of the generated content',
    },
    format: {
      control: 'select',
      options: ['plain-text', 'markdown'],
      description: 'The format of the generated content',
    },
    length: {
      control: 'select',
      options: ['short', 'medium', 'long'],
      description: 'The length of the generated content',
    },
    allowStreaming: {
      control: 'boolean',
      description: 'Enable real-time streaming of content generation',
    },
    showControls: {
      control: 'boolean',
      description: 'Show tone, format, and length controls',
    },
    controlsOnly: {
      control: 'boolean',
      description:
        'Hide input fields and only show controls/actions (use externalPrompt)',
    },
    externalPrompt: {
      control: 'text',
      description: 'External prompt to use when controlsOnly is enabled',
    },
    autoHeight: {
      control: 'boolean',
      description: 'Automatically adjust textarea height',
    },
    maxHeight: {
      control: 'number',
      description: 'Maximum height for textareas in pixels',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Write a blog post about sustainable technology...',
    tone: 'casual',
    format: 'plain-text',
    length: 'medium',
    showControls: true,
    allowStreaming: true,
    autoHeight: true,
    maxHeight: 400,
  },
};

export const FormalTone: Story = {
  args: {
    placeholder: 'Write a business proposal for renewable energy solutions...',
    tone: 'formal',
    format: 'plain-text',
    length: 'long',
    showControls: true,
    allowStreaming: false,
  },
};

export const CreativeWriting: Story = {
  args: {
    placeholder: 'Write a short story about a robot learning to paint...',
    tone: 'casual',
    format: 'plain-text',
    length: 'medium',
    showControls: true,
    allowStreaming: true,
  },
};

export const MarkdownOutput: Story = {
  args: {
    placeholder: 'Create a README for a new open source project...',
    tone: 'formal',
    format: 'markdown',
    length: 'medium',
    showControls: true,
    allowStreaming: true,
  },
};

export const HTMLOutput: Story = {
  args: {
    placeholder: 'Write a product description for an e-commerce website...',
    tone: 'casual',
    format: 'markdown',
    length: 'short',
    showControls: true,
    allowStreaming: false,
  },
};

export const MinimalInterface: Story = {
  args: {
    placeholder: 'Enter your writing prompt...',
    tone: 'casual',
    format: 'plain-text',
    length: 'medium',
    showControls: false,
    allowStreaming: true,
    autoHeight: false,
  },
};

export const StreamingDisabled: Story = {
  args: {
    placeholder: 'Write an email to announce a new product launch...',
    tone: 'formal',
    format: 'plain-text',
    length: 'medium',
    showControls: true,
    allowStreaming: false,
  },
};

export const WithCallbacks: Story = {
  args: {
    placeholder: 'Generate a social media post about climate change...',
    tone: 'casual',
    format: 'plain-text',
    length: 'short',
    showControls: true,
    allowStreaming: true,
    onContentGenerated: (content: string) => {
      console.log('Content generated:', content);
    },
    onError: (error: string) => {
      console.error('Error occurred:', error);
    },
    onProgressUpdate: (progress: number) => {
      console.log('Progress:', progress + '%');
    },
    onStreamingChunk: (chunk: string) => {
      console.log('Streaming chunk:', chunk);
    },
  },
};

export const ControlsOnly: Story = {
  args: {
    controlsOnly: true,
    externalPrompt:
      'Write a compelling product description for a smart water bottle that tracks hydration levels and reminds users to drink water.',
    tone: 'formal',
    format: 'markdown',
    length: 'medium',
    showControls: true,
    allowStreaming: true,
    placeholder: 'This input is hidden in controls-only mode',
  },
};

// NEW: Custom Sizing Examples
export const CustomWidth: Story = {
  args: {
    placeholder: 'Write content with custom width...',
    width: '800px',
    tone: 'casual',
    format: 'markdown',
    length: 'medium',
    showControls: true,
    allowStreaming: true,
  },
};

export const CustomHeight: Story = {
  args: {
    placeholder: 'Write content with custom height...',
    height: '600px',
    tone: 'casual',
    format: 'markdown',
    length: 'medium',
    showControls: true,
    allowStreaming: true,
  },
};

export const CustomDimensions: Story = {
  args: {
    placeholder: 'Write content with custom width and height...',
    width: '900px',
    height: '500px',
    tone: 'formal',
    format: 'markdown',
    length: 'long',
    showControls: true,
    allowStreaming: true,
  },
};

export const ResizableComponent: Story = {
  args: {
    placeholder: 'Try resizing this component by dragging the bottom-right corner...',
    width: '600px',
    height: '400px',
    resizable: true,
    tone: 'casual',
    format: 'markdown',
    length: 'medium',
    showControls: true,
    allowStreaming: true,
  },
};

export const CustomStyling: Story = {
  args: {
    placeholder: 'Write content with custom styling...',
    width: '100%',
    style: {
      border: '2px solid #3b82f6',
      borderRadius: '12px',
      backgroundColor: '#f8fafc',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    tone: 'casual',
    format: 'markdown',
    length: 'medium',
    showControls: true,
    allowStreaming: true,
  },
};

export const ColorfulTheme: Story = {
  args: {
    placeholder: 'Write content with colorful theme...',
    width: '700px',
    height: '450px',
    resizable: true,
    style: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      padding: '8px',
      border: 'none',
    },
    tone: 'casual',
    format: 'markdown',
    length: 'medium',
    showControls: true,
    allowStreaming: true,
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'colorful-content.md',
  },
};

export const CompactMode: Story = {
  args: {
    placeholder: 'Compact writer for small spaces...',
    width: '400px',
    height: '300px',
    tone: 'casual',
    format: 'plain-text',
    length: 'short',
    showControls: false,
    allowStreaming: true,
    style: {
      fontSize: '14px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
    },
  },
};

export const FullScreenMode: Story = {
  args: {
    placeholder: 'Full-screen writing experience...',
    width: '100vw',
    height: '80vh',
    resizable: false,
    tone: 'formal',
    format: 'markdown',
    length: 'long',
    showControls: true,
    allowStreaming: true,
    style: {
      border: 'none',
      borderRadius: '0',
      margin: '-16px',
    },
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'fullscreen-content.md',
  },
};
