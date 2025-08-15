import type { Meta, StoryObj } from '@storybook/react-vite';
import AIChat from '../src/components/AIChat/AIChat';

// Mock function for story actions
const mockFn = () => {
  console.log('Message sent');
};

const meta: Meta<typeof AIChat> = {
  title: 'Components/AIChat',
  component: AIChat,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onSendMessage: mockFn,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMessages = [
  {
    id: '1',
    text: 'Hello! How can I help you today?',
    sender: 'ai' as const,
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: '2',
    text: 'I need help with creating a React component.',
    sender: 'user' as const,
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: '3',
    text: 'I\'d be happy to help you create a React component! What kind of component are you looking to build?',
    sender: 'ai' as const,
    timestamp: new Date(Date.now() - 180000),
  },
];

export const Default: Story = {
  args: {
    messages: sampleMessages,
    placeholder: 'Type your message...',
  },
};

export const Loading: Story = {
  args: {
    messages: sampleMessages,
    isLoading: true,
    placeholder: 'Type your message...',
  },
};

export const Empty: Story = {
  args: {
    messages: [],
    placeholder: 'Start a conversation...',
  },
};

// NEW: Custom Sizing Examples
export const CustomMaxHeight: Story = {
  args: {
    messages: sampleMessages,
    maxHeight: '300px',
    placeholder: 'Type your message...',
  },
};

export const TallChat: Story = {
  args: {
    messages: sampleMessages,
    maxHeight: '600px',
    placeholder: 'Type your message...',
  },
};

export const CompactChat: Story = {
  args: {
    messages: sampleMessages.slice(0, 2),
    maxHeight: '250px',
    placeholder: 'Quick message...',
  },
};

export const LoadingWithMessages: Story = {
  args: {
    messages: sampleMessages,
    isLoading: true,
    maxHeight: '400px',
    placeholder: 'AI is thinking...',
  },
};

export const EmptyWithCustomPlaceholder: Story = {
  args: {
    messages: [],
    placeholder: 'Ask me anything about React development...',
    maxHeight: '350px',
  },
};
