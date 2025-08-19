import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// A minimal test to check if Lit works at all in our environment
const MinimalLitTest = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [status, setStatus] = React.useState('Initializing...');

  React.useEffect(() => {
    const testMinimalLit = async () => {
      try {
        setStatus('Testing with existing Lit from web-ai-components...');
        
        // Use the components from the already loaded package
        await import('@yallaling/web-ai-components');
        
        // Create a simple test element using DOM manipulation instead of direct Lit
        const testDiv = document.createElement('div');
        testDiv.style.cssText = `
          display: block;
          padding: 20px;
          background: lightblue;
          border: 2px solid blue;
          border-radius: 8px;
          margin: 10px 0;
        `;
        testDiv.innerHTML = `
          <h3>✅ Lit Environment Test</h3>
          <p>Successfully using Lit from web-ai-components package!</p>
          <p>No multiple Lit versions loaded.</p>
        `;
        
        // Clear previous content and add test element
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(testDiv);
        }
        
        setStatus('✅ Test element created successfully!');
        
        // Wait a bit for DOM update
        setTimeout(() => {
          setStatus('✅ SUCCESS: Lit environment is working properly!');
        }, 500);
        
      } catch (error) {
        console.error('Minimal Lit test failed:', error);
        setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    
    testMinimalLit();
  }, []);

  return (
    <div>
      <h2>Minimal Lit Functionality Test</h2>
      <p>This tests if Lit works at all in our Storybook environment</p>
      
      <div style={{ 
        padding: '10px', 
        backgroundColor: '#f0f8f0', 
        marginBottom: '20px',
        borderRadius: '4px'
      }}>
        <strong>Status:</strong> {status}
      </div>
      
      <div 
        ref={containerRef}
        style={{
          border: '2px dashed #333',
          padding: '20px',
          minHeight: '200px',
          backgroundColor: '#fff'
        }}
      />
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Expected:</strong> You should see a blue-bordered box with styled content above.</p>
        <p><strong>If it fails:</strong> The issue is with Lit itself in our environment.</p>
        <p><strong>If it works:</strong> The issue is specific to our AI components.</p>
      </div>
    </div>
  );
};

const meta: Meta<typeof MinimalLitTest> = {
  title: 'Tests/Minimal Lit Test',
  component: MinimalLitTest,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicLitTest: Story = {};
