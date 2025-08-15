import type { Meta, StoryObj } from '@storybook/react-vite';
import AILanguageDetector from '../src/components/AILanguageDetector/AILanguageDetector';

const meta: Meta<typeof AILanguageDetector> = {
  title: 'AI Components/AILanguageDetector',
  component: AILanguageDetector,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A language detection component using Chrome\'s built-in AI language detection API. Automatically identifies languages in text with confidence scores.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    onDetect: (detections: any[]) => console.log('Detected languages:', detections),
    onError: (error: string) => console.error('Detection error:', error),
    onProgress: (loaded: number, total: number) => console.log('Progress:', loaded, '/', total),
  },
  argTypes: {
    confidenceThreshold: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Minimum confidence threshold for detection',
    },
    autoDetect: {
      control: { type: 'boolean' },
      description: 'Automatically detect language when text changes',
    },
    showConfidence: {
      control: { type: 'boolean' },
      description: 'Show confidence scores in results',
    },
    maxSuggestions: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Maximum number of language suggestions',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Hello, how are you today?',
    showControls: true,
    showConfidence: true,
    confidenceThreshold: 0.5,
  },
};

export const AutoDetect: Story = {
  args: {
    text: 'Bonjour, comment allez-vous aujourd\'hui?',
    autoDetect: true,
    showControls: true,
    showConfidence: true,
    confidenceThreshold: 0.3,
  },
};

export const MultipleLanguages: Story = {
  args: {
    text: 'This is English text mixed with español y auch etwas Deutsch.',
    showControls: true,
    showConfidence: true,
    maxSuggestions: 5,
    confidenceThreshold: 0.2,
  },
};

export const HighThreshold: Story = {
  args: {
    text: 'こんにちは、今日はいかがですか？',
    showControls: true,
    showConfidence: true,
    confidenceThreshold: 0.8,
    maxSuggestions: 3,
  },
};

export const WithoutConfidence: Story = {
  args: {
    text: 'Привет, как дела сегодня?',
    showControls: true,
    showConfidence: false,
    confidenceThreshold: 0.5,
  },
};

// NEW: Custom Sizing Examples
export const CustomWidth: Story = {
  args: {
    text: 'Guten Tag! Wie geht es Ihnen heute? Ich hoffe, Sie haben einen schönen Tag.',
    width: '700px',
    showControls: true,
    showConfidence: true,
    confidenceThreshold: 0.5,
    maxSuggestions: 3,
  },
};

export const CustomHeight: Story = {
  args: {
    text: 'Ciao! Come stai oggi? Spero che tu stia avendo una giornata meravigliosa.',
    height: '400px',
    showControls: true,
    showConfidence: true,
    confidenceThreshold: 0.4,
    maxSuggestions: 4,
  },
};

export const ResizableDetector: Story = {
  args: {
    text: 'أهلاً وسهلاً! كيف حالك اليوم؟ أتمنى أن تكون بخير.',
    width: '600px',
    height: '350px',
    showControls: true,
    showConfidence: true,
    confidenceThreshold: 0.6,
    autoDetect: true,
  },
};

export const BlueTheme: Story = {
  args: {
    text: 'Olá! Como você está hoje? Espero que esteja tendo um ótimo dia.',
    width: '100%',
    style: {
      border: '2px solid #2563eb',
      borderRadius: '12px',
      backgroundColor: '#eff6ff',
      boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.1)',
    },
    showControls: true,
    showConfidence: true,
    confidenceThreshold: 0.5,
    maxSuggestions: 3,
  },
};

export const GreenGradient: Story = {
  args: {
    text: 'நல்ல காலை! இன்று எப்படி இருக்கிறீர்கள்? உங்களுக்கு நல்ல நாள் இருக்கும் என்று நம்புகிறேன்.',
    width: '650px',
    height: '300px',
    style: {
      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      borderRadius: '16px',
      padding: '10px',
      border: 'none',
      color: 'white',
    },
    showControls: true,
    showConfidence: true,
    confidenceThreshold: 0.3,
    autoDetect: true,
  },
};

export const CompactDetector: Story = {
  args: {
    text: 'Zdravo!',
    width: '350px',
    height: '250px',
    showControls: false,
    showConfidence: true,
    confidenceThreshold: 0.7,
    style: {
      fontSize: '14px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
    },
  },
};

export const DarkMode: Story = {
  args: {
    text: 'မင်္ဂလာပါ! ဒီနေ့ ဘယ်လိုနေလဲ? ကောင်းတဲ့ နေ့တစ်နေ့ ဖြစ်မယ်လို့ မျှော်လင့်ပါတယ်။',
    width: '750px',
    height: '400px',
    style: {
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      borderRadius: '12px',
      border: '1px solid #374151',
      color: '#f9fafb',
    },
    showControls: true,
    showConfidence: true,
    confidenceThreshold: 0.4,
    maxSuggestions: 5,
    autoDetect: true,
  },
};

export const PurpleAccent: Story = {
  args: {
    text: 'გამარჯობა! როგორ ხართ დღეს? იმედი მაქვს, რომ კარგი დღე გაქვთ.',
    width: '600px',
    height: '380px',
    style: {
      border: '3px solid #7c3aed',
      borderRadius: '20px',
      backgroundColor: '#faf5ff',
      boxShadow: '0 8px 25px -5px rgba(124, 58, 237, 0.25)',
    },
    showControls: true,
    showConfidence: true,
    confidenceThreshold: 0.5,
    maxSuggestions: 4,
  },
};
