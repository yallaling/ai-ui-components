import type { Meta, StoryObj } from '@storybook/react-vite';
import AIPrompt from '../src/components/AIPrompt/AIPrompt';

const meta: Meta<typeof AIPrompt> = {
  title: 'Components/AIPrompt',
  component: AIPrompt,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    maxLength: {
      control: { type: 'number' },
    },
    showCounter: {
      control: { type: 'boolean' },
    },
    isLoading: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockSubmit = (prompt: string) => {
  console.log('Prompt submitted:', prompt);
};

export const Default: Story = {
  args: {
    onSubmit: mockSubmit,
    placeholder: 'Enter your AI prompt...',
    maxLength: 500,
    showCounter: true,
    aiModel: 'language',
  },
};

export const WithoutCounter: Story = {
  args: {
    onSubmit: mockSubmit,
    placeholder: 'Enter your prompt...',
    showCounter: false,
  },
};

export const Loading: Story = {
  args: {
    onSubmit: mockSubmit,
    placeholder: 'Processing...',
    isLoading: true,
  },
};

export const ShortLimit: Story = {
  args: {
    onSubmit: mockSubmit,
    placeholder: 'Short message only...',
    maxLength: 100,
    showCounter: true,
  },
};

export const WithTemplates: Story = {
  args: {
    onSubmit: mockSubmit,
    placeholder: 'Select a template or write your own...',
    showTemplates: true,
    showCounter: true,
  },
};

export const WithAIAssistance: Story = {
  args: {
    onSubmit: mockSubmit,
    placeholder: 'Write a prompt and use AI to improve it...',
    showAIAssistance: true,
    showCounter: true,
    aiModel: 'rewriter',
  },
};

export const WithExecution: Story = {
  args: {
    onSubmit: mockSubmit,
    placeholder: 'Enter a prompt to execute with AI...',
    showExecution: true,
    showCounter: true,
    temperature: 0.7,
    topK: 40,
    streaming: false,
  },
};

export const WithStreamingExecution: Story = {
  args: {
    onSubmit: mockSubmit,
    placeholder: 'Enter a prompt for streaming AI response...',
    showExecution: true,
    streaming: true,
    showCounter: true,
    temperature: 0.8,
    topK: 20,
    initialPrompts: [
      {
        role: 'system',
        content:
          'You are a helpful AI assistant. Provide clear and concise responses.',
      },
    ],
  },
};

export const FullFeatured: Story = {
  args: {
    onSubmit: mockSubmit,
    placeholder: 'Full-featured AI prompt with all options...',
    showTemplates: true,
    showAIAssistance: true,
    showExecution: true,
    streaming: true,
    enableAutoComplete: true,
    showCounter: true,
    maxLength: 2000,
    temperature: 0.7,
    topK: 40,
    aiModel: 'language',
  },
};

// NEW: Enhanced Examples
export const WriterAssistant: Story = {
  args: {
    onSubmit: mockSubmit,
    placeholder: 'Describe what you want to write...',
    showAIAssistance: true,
    showExecution: true,
    aiModel: 'writer',
    temperature: 0.8,
    topK: 30,
    showCounter: true,
    maxLength: 1500,
    initialPrompts: [
      {
        role: 'system',
        content: 'You are a creative writing assistant. Help users craft engaging content.',
      },
    ],
  },
};

export const RewriterAssistant: Story = {
  args: {
    onSubmit: mockSubmit,
    placeholder: 'Paste text you want to rewrite...',
    showAIAssistance: true,
    showExecution: true,
    aiModel: 'rewriter',
    temperature: 0.6,
    topK: 25,
    showCounter: true,
    maxLength: 2500,
    streaming: true,
  },
};

export const QuickPrompt: Story = {
  args: {
    onSubmit: mockSubmit,
    placeholder: 'Quick AI prompt...',
    maxLength: 200,
    showCounter: true,
    showExecution: true,
    streaming: false,
    temperature: 0.7,
  },
};

export const TemplateAssisted: Story = {
  args: {
    onSubmit: mockSubmit,
    placeholder: 'Choose a template or write your own...',
    showTemplates: true,
    enableAutoComplete: true,
    showCounter: true,
    maxLength: 1000,
  },
};

export const StreamingChat: Story = {
  args: {
    onSubmit: mockSubmit,
    placeholder: 'Chat with AI (streaming responses)...',
    showExecution: true,
    streaming: true,
    temperature: 0.8,
    topK: 40,
    showCounter: true,
    maxLength: 1500,
    initialPrompts: [
      {
        role: 'system',
        content: 'You are a helpful and friendly AI assistant.',
      },
    ],
  },
};

export const ControlsOnlyMode: Story = {
  args: {
    onSubmit: mockSubmit,
    controlsOnly: true,
    externalPrompt: 'This is an external prompt managed by the parent component.',
    showExecution: true,
    streaming: true,
    temperature: 0.7,
    topK: 30,
    aiModel: 'language',
  },
};

export const HighCreativity: Story = {
  args: {
    onSubmit: mockSubmit,
    placeholder: 'Creative writing prompt (high temperature)...',
    showExecution: true,
    streaming: true,
    temperature: 0.9,
    topK: 50,
    showCounter: true,
    maxLength: 2000,
    aiModel: 'writer',
  },
};

export const PreciseMode: Story = {
  args: {
    onSubmit: mockSubmit,
    placeholder: 'Precise AI prompt (low temperature)...',
    showExecution: true,
    streaming: false,
    temperature: 0.1,
    topK: 10,
    showCounter: true,
    maxLength: 1000,
    aiModel: 'language',
  },
};
