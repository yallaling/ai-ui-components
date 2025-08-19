import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Simple test using our existing UniversalComponentWrapper
import { UniversalComponentWrapper } from './UniversalComponentWrapper';

const SimpleTest = () => {
  return (
    <div>
      <h2>Simple Universal Component Test</h2>
      <p>Testing our existing UniversalComponentWrapper with ai-writer-element</p>
      
      <div style={{ 
        border: '2px solid #007acc',
        padding: '20px',
        margin: '20px 0',
        backgroundColor: '#f9f9f9'
      }}>
        <h3>AI Writer Component:</h3>
        <UniversalComponentWrapper
          title="AI Writer Test"
          description="Testing AI Writer Component"
          componentTag="ai-writer-element"
          attributes={{
            prompt: "Write a simple hello world message",
            tone: "casual",
            length: "short"
          }}
        />
      </div>
      
      <div style={{ 
        border: '2px solid #28a745',
        padding: '20px',
        margin: '20px 0',
        backgroundColor: '#f8f9fa'
      }}>
        <h3>AI Summarizer Component:</h3>
        <UniversalComponentWrapper
          title="AI Summarizer Test"
          description="Testing AI Summarizer Component"
          componentTag="ai-summarizer-element"
          attributes={{
            text: "This is a long text that needs to be summarized. It contains multiple sentences and should be reduced to its key points by the AI summarizer component.",
            type: "tldr",
            length: "short"
          }}
        />
      </div>
      
      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '4px'
      }}>
        <p><strong>What to expect:</strong></p>
        <ul>
          <li>If components load: You should see interactive AI components with buttons and text areas</li>
          <li>If they don't load: You'll only see empty boxes or "Component not found" messages</li>
          <li>Check the browser console for any error messages</li>
        </ul>
      </div>
    </div>
  );
};

const meta: Meta<typeof SimpleTest> = {
  title: 'Tests/Simple Component Test',
  component: SimpleTest,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicComponentTest: Story = {};
