import type { Meta, StoryObj } from '@storybook/react-vite';
import LoadingSpinner from '../src/components/LoadingSpinner/LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    color: {
      control: { type: 'color' },
    },
    overlay: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const WithText: Story = {
  args: {
    size: 'medium',
    text: 'Loading...',
  },
};

export const CustomColor: Story = {
  args: {
    size: 'medium',
    color: '#ff6b6b',
    text: 'Processing...',
  },
};

export const Overlay: Story = {
  args: {
    size: 'large',
    text: 'Please wait...',
    overlay: true,
  },
  parameters: {
    layout: 'fullscreen',
  },
};
