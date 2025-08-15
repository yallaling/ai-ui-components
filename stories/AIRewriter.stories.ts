import type { Meta, StoryObj } from '@storybook/react-vite';
import AIRewriter from '../src/components/AIRewriter/AIRewriter';

const meta: Meta<typeof AIRewriter> = {
  title: 'AI Components/AIRewriter',
  component: AIRewriter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "AIRewriter component for improving and rewriting text using Chrome's built-in AI Rewriter API. Supports different tones, formats, and lengths with real-time streaming capabilities.",
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onContentRewritten: { action: 'content-rewritten' },
    onError: { action: 'error' },
    onProgressUpdate: { action: 'progress-update' },
    onStreamingChunk: { action: 'streaming-chunk' },
    tone: {
      control: 'select',
      options: ['as-is', 'more-formal', 'more-casual'],
      description: 'The tone of the rewritten content',
    },
    format: {
      control: 'select',
      options: ['plain-text'],
      description: 'The format of the rewritten content',
    },
    length: {
      control: 'select',
      options: ['shorter', 'as-is', 'longer'],
      description: 'The relative length of the rewritten content',
    },
    outputLanguage: {
      control: 'select',
      options: ['en'],
      description:
        'The output language for the rewritten content (currently only English is supported)',
    },
    expectedInputLanguages: {
      control: 'object',
      description: 'Array of expected input languages',
    },
    expectedContextLanguages: {
      control: 'object',
      description: 'Array of expected context languages',
    },
    allowStreaming: {
      control: 'boolean',
      description: 'Enable real-time streaming of rewriting process',
    },
    controlsOnly: {
      control: 'boolean',
      description:
        'Hide input fields and only show controls/actions (use externalText)',
    },
    externalText: {
      control: 'text',
      description: 'External text to rewrite when controlsOnly is enabled',
    },
    showControls: {
      control: 'boolean',
      description: 'Show tone, format, and length controls',
    },
    autoHeight: {
      control: 'boolean',
      description: 'Automatically adjust textarea height',
    },
    maxHeight: {
      control: 'number',
      description: 'Maximum height for textareas in pixels',
    },
    initialText: {
      control: 'text',
      description: 'Initial text to populate the input area',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text to rewrite...',
    tone: 'more-casual',
    format: 'plain-text',
    length: 'as-is',
    showControls: true,
    allowStreaming: true,
    autoHeight: true,
    maxHeight: 400,
    initialText:
      'This product is really good and I think many people will like it because it has nice features.',
  },
};

export const FormalRewrite: Story = {
  args: {
    placeholder: 'Enter casual text to make more formal...',
    tone: 'more-formal',
    format: 'plain-text',
    length: 'as-is',
    showControls: true,
    allowStreaming: false,
    initialText:
      'Hey, just wanted to let you know that the meeting got moved to tomorrow at 3pm. Hope that works for everyone!',
  },
};

export const CreativeRewrite: Story = {
  args: {
    placeholder: 'Enter text to make more creative...',
    tone: 'more-casual',
    format: 'plain-text',
    length: 'longer',
    showControls: true,
    allowStreaming: true,
    initialText:
      'The sun was bright and the day was nice. We went for a walk in the park.',
  },
};

export const ProfessionalEmail: Story = {
  args: {
    placeholder: 'Enter email draft to improve...',
    tone: 'more-formal',
    format: 'plain-text',
    length: 'as-is',
    showControls: true,
    allowStreaming: false,
    initialText: 'Hi John, Can you send me the report? I need it soon. Thanks.',
  },
};

export const MarkdownRewrite: Story = {
  args: {
    placeholder: 'Enter text to rewrite as plain text...',
    tone: 'more-casual',
    format: 'plain-text',
    length: 'as-is',
    showControls: true,
    allowStreaming: true,
    initialText:
      'Our new product has three main features: easy setup, fast performance, and great support. Users love how simple it is to get started.',
  },
};

export const HTMLRewrite: Story = {
  args: {
    placeholder: 'Enter text to rewrite as plain text...',
    tone: 'more-formal',
    format: 'plain-text',
    length: 'as-is',
    showControls: true,
    allowStreaming: false,
    initialText:
      'Welcome to our company. We provide excellent services to our customers. Contact us for more information.',
  },
};

export const ShorterVersion: Story = {
  args: {
    placeholder: 'Enter text to make more concise...',
    tone: 'more-casual',
    format: 'plain-text',
    length: 'shorter',
    showControls: true,
    allowStreaming: true,
    initialText:
      'I wanted to take this opportunity to reach out to you and let you know that we have been working very hard on developing a new product that we believe will be of great interest to you and your organization. This product has been designed with your specific needs in mind and incorporates many features that we think you will find valuable.',
  },
};

export const LongerVersion: Story = {
  args: {
    placeholder: 'Enter text to expand...',
    tone: 'more-formal',
    format: 'plain-text',
    length: 'longer',
    showControls: true,
    allowStreaming: false,
    initialText: 'Good product. Works well.',
  },
};

export const MinimalInterface: Story = {
  args: {
    placeholder: 'Enter text to rewrite...',
    tone: 'more-casual',
    format: 'plain-text',
    length: 'as-is',
    showControls: false,
    allowStreaming: true,
    autoHeight: false,
    initialText: 'Quick brown fox jumps over lazy dog.',
  },
};

export const WithCallbacks: Story = {
  args: {
    placeholder: 'Enter text to rewrite with detailed logging...',
    tone: 'more-casual',
    format: 'plain-text',
    length: 'as-is',
    showControls: true,
    allowStreaming: true,
    initialText: 'AI technology is changing how we work and live.',
    onContentRewritten: (content: string) => {
      console.log('Content rewritten:', content);
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

export const EnhancedWithContext: Story = {
  args: {
    placeholder: 'Enter text to rewrite with context...',
    tone: 'more-formal',
    format: 'plain-text',
    length: 'as-is',
    sharedContext:
      'This is for a professional business email to a client about project updates.',
    outputLanguage: 'en',
    expectedInputLanguages: ['en'],
    expectedContextLanguages: ['en'],
    showControls: true,
    allowStreaming: true,
    initialText:
      'Project going well. Will finish soon. Let me know if questions.',
  },
};

export const MultilingualRewrite: Story = {
  args: {
    placeholder: 'Enter text to rewrite with formal tone...',
    tone: 'more-formal',
    format: 'plain-text',
    length: 'as-is',
    sharedContext: 'Formal business communication',
    outputLanguage: 'en',
    expectedInputLanguages: ['en'],
    expectedContextLanguages: ['en'],
    showControls: true,
    allowStreaming: false,
    initialText:
      'Thank you for your interest in our product. We will contact you soon.',
  },
};

export const ControlsOnly: Story = {
  args: {
    controlsOnly: true,
    externalText:
      'Hey there! This product is super awesome and you should totally buy it right now because it will change your life and make everything better. Trust me on this one!',
    tone: 'more-formal',
    format: 'plain-text',
    length: 'as-is',
    sharedContext: 'Professional marketing copy',
    outputLanguage: 'en',
    expectedInputLanguages: ['en'],
    expectedContextLanguages: ['en'],
    showControls: true,
    allowStreaming: true,
    placeholder: 'This input is hidden in controls-only mode',
  },
};

// NEW: Custom Sizing Examples
export const CustomWidth: Story = {
  args: {
    placeholder: 'Enter text to rewrite with custom width...',
    width: '750px',
    tone: 'more-casual',
    format: 'plain-text',
    length: 'as-is',
    showControls: true,
    allowStreaming: true,
    initialText: 'This is a formal business document that needs to be more casual.',
  },
};

export const CustomHeight: Story = {
  args: {
    placeholder: 'Enter text to rewrite with custom height...',
    height: '550px',
    tone: 'more-formal',
    format: 'plain-text',
    length: 'longer',
    showControls: true,
    allowStreaming: true,
    initialText: 'Hey! Cool stuff happening here!',
  },
};

export const ResizableRewriter: Story = {
  args: {
    placeholder: 'Try resizing this rewriter component...',
    width: '650px',
    height: '450px',
    resizable: true,
    tone: 'as-is',
    format: 'plain-text',
    length: 'as-is',
    showControls: true,
    allowStreaming: true,
    initialText: 'The quick brown fox jumps over the lazy dog.',
  },
};

export const StyledRewriter: Story = {
  args: {
    placeholder: 'Enter text to rewrite with custom styling...',
    width: '100%',
    style: {
      border: '3px solid #10b981',
      borderRadius: '15px',
      backgroundColor: '#f0fdf4',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
    tone: 'more-casual',
    format: 'plain-text',
    length: 'as-is',
    showControls: true,
    allowStreaming: true,
    initialText: 'We regret to inform you that your application has been denied.',
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'rewritten-text.md',
  },
};

export const DarkTheme: Story = {
  args: {
    placeholder: 'Dark theme rewriter...',
    width: '700px',
    height: '400px',
    resizable: true,
    style: {
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      borderRadius: '12px',
      border: '1px solid #374151',
      color: '#f9fafb',
    },
    tone: 'more-formal',
    format: 'plain-text',
    length: 'as-is',
    showControls: true,
    allowStreaming: true,
    initialText: 'lol this is so funny 😂😂😂',
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'dark-theme-rewrite.md',
  },
};

export const CompactRewriter: Story = {
  args: {
    placeholder: 'Compact rewriter...',
    width: '450px',
    height: '280px',
    tone: 'more-casual',
    format: 'plain-text',
    length: 'shorter',
    showControls: false,
    allowStreaming: true,
    style: {
      fontSize: '14px',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
    },
    initialText: 'This is a very long sentence that could be made much shorter.',
  },
};

export const GradientStyle: Story = {
  args: {
    placeholder: 'Gradient styled rewriter...',
    width: '800px',
    height: '500px',
    resizable: true,
    style: {
      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
      borderRadius: '20px',
      padding: '12px',
      border: 'none',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    },
    tone: 'more-formal',
    format: 'plain-text',
    length: 'longer',
    showControls: true,
    allowStreaming: true,
    initialText: 'ur product rocks!!!',
    allowCopy: true,
    allowDownload: true,
    downloadFileName: 'gradient-rewrite.md',
  },
};
