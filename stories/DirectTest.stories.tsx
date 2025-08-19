import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

// Direct test component for debugging
const DirectComponentTest = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [status, setStatus] = React.useState('Starting...');
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const loadAndTest = async () => {
      try {
        setStatus('Checking Chrome AI availability...');
        
        // Use the same detection as the working AIWriter component
        const writerSupported = 'Writer' in self;
        const summarizerSupported = 'Summarizer' in self;
        const translatorSupported = 'Translator' in self;
        const languageDetectorSupported = 'LanguageDetector' in self;
        const rewriterSupported = 'Rewriter' in self;
        
        console.log('Chrome AI API Support:', {
          Writer: writerSupported,
          Summarizer: summarizerSupported,
          Translator: translatorSupported,
          LanguageDetector: languageDetectorSupported,
          Rewriter: rewriterSupported
        });
        
        if (!writerSupported && !summarizerSupported) {
          setStatus('❌ Chrome AI APIs not available. Writer and Summarizer not found in self object.');
          return;
        }
        
        setStatus(`✅ Chrome AI APIs detected! Available: ${[
          writerSupported ? 'Writer' : null,
          summarizerSupported ? 'Summarizer' : null,
          translatorSupported ? 'Translator' : null,
          languageDetectorSupported ? 'LanguageDetector' : null,
          rewriterSupported ? 'Rewriter' : null
        ].filter(Boolean).join(', ')}`);
        
        // Create a simple test div to verify DOM manipulation works
        if (containerRef.current) {
          const testDiv = document.createElement('div');
          testDiv.innerHTML = `
            <div style="border: 2px solid green; padding: 15px; margin: 10px 0; background: #f0f8f0;">
              <h4>✅ Chrome AI APIs Available</h4>
              <p>Found Chrome AI APIs: ${[
                writerSupported ? 'Writer' : null,
                summarizerSupported ? 'Summarizer' : null,
                translatorSupported ? 'Translator' : null,
                languageDetectorSupported ? 'LanguageDetector' : null,
                rewriterSupported ? 'Rewriter' : null
              ].filter(Boolean).join(', ')}</p>
            </div>
          `;
          containerRef.current.appendChild(testDiv);
        }
        
        // Create a very simple test first
        if (containerRef.current) {
          // Create a simple test div to verify DOM manipulation works
          const testDiv = document.createElement('div');
          testDiv.innerHTML = `
            <div style="border: 2px solid green; padding: 15px; margin: 10px 0; background: #f0f8f0;">
              <h4>✅ Basic DOM Test</h4>
              <p>This confirms basic DOM manipulation works in Storybook</p>
            </div>
          `;
          containerRef.current.appendChild(testDiv);
        }
        
        setStatus('✅ Basic DOM test complete. Now testing components...');
        
        // Load the LOCAL components first with fallback
        try {
          setStatus('Loading local components...');
          await import('../packages/components/src/components/ai-writer');
          await import('../packages/components/src/components/ai-summarizer');
          setStatus('✅ LOCAL components loaded successfully!');
        } catch (localError) {
          console.log('Local components failed, trying published...', localError);
          setStatus('Local failed, trying published...');
          try {
            await import('@yallaling/web-ai-components');
            setStatus('✅ Published components loaded.');
          } catch (publishedError) {
            console.error('Both local and published failed:', localError, publishedError);
            setStatus('❌ Both local and published components failed to load');
            return;
          }
        }
        
        setStatus('✅ Components loaded. Creating element...');
        
        // Wait a bit for registration
        setTimeout(() => {
          if (containerRef.current) {
            // Check if elements are available
            const hasAiWriter = customElements.get('ai-writer-element');
            const hasAiSummarizer = customElements.get('ai-summarizer-element');
            
            console.log('Available custom elements:', {
              'ai-writer-element': hasAiWriter ? 'registered' : 'not found',
              'ai-summarizer-element': hasAiSummarizer ? 'registered' : 'not found'
            });
            
            if (!hasAiWriter && !hasAiSummarizer) {
              setStatus('⚠️ No AI components found in custom element registry');
              return;
            }
            
            // Use innerHTML approach to test if it's a React wrapper issue
            containerRef.current.innerHTML = `
              <div style="margin-bottom: 20px;">
                <h4>AI Writer Test ${hasAiWriter ? '✅' : '❌'}</h4>
                ${hasAiWriter ? `
                  <ai-writer-element 
                    prompt="Write a test message" 
                    tone="casual" 
                    length="short">
                  </ai-writer-element>
                ` : '<p>❌ ai-writer-element not available</p>'}
              </div>
              
              <div style="margin-bottom: 20px;">
                <h4>AI Summarizer Test ${hasAiSummarizer ? '✅' : '❌'}</h4>
                ${hasAiSummarizer ? `
                  <ai-summarizer-element 
                    text="This is a test text to be summarized by the AI component." 
                    type="tldr" 
                    length="short">
                  </ai-summarizer-element>
                ` : '<p>❌ ai-summarizer-element not available</p>'}
              </div>
            `;
            
            setStatus('✅ Elements added via innerHTML. Checking render...');
            
            // Check if elements have rendered after a delay
            setTimeout(() => {
              const elements = containerRef.current?.querySelectorAll('ai-writer-element, ai-summarizer-element');
              if (elements) {
                let hasWorkingComponent = false;
                elements.forEach((element: any) => {
                  console.log(`${element.tagName} element:`, element);
                  console.log(`${element.tagName} shadow root:`, element.shadowRoot);
                  if (element.shadowRoot && element.shadowRoot.innerHTML.length > 0) {
                    hasWorkingComponent = true;
                    console.log(`${element.tagName} shadow DOM content:`, element.shadowRoot.innerHTML);
                  }
                });
                
                if (hasWorkingComponent) {
                  setStatus('✅ Components rendered successfully with shadow DOM!');
                } else {
                  setStatus('⚠️ Components created but no shadow DOM content found.');
                }
              }
              setIsLoaded(true);
            }, 2000);
          }
        }, 500);
        
      } catch (error) {
        console.error('Failed to load components:', error);
        setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    
    loadAndTest();
  }, []);

  return (
    <div>
      <h3>Direct Component Test (HTML Approach)</h3>
      <p>Testing components with direct HTML injection instead of React createElement</p>
      
      <div style={{ 
        padding: '10px', 
        backgroundColor: '#e8f4f8', 
        marginBottom: '20px',
        borderRadius: '4px'
      }}>
        <strong>Status:</strong> {status}
      </div>
      
      <div 
        ref={containerRef}
        style={{
          border: '2px solid #007acc',
          padding: '20px',
          minHeight: '400px',
          backgroundColor: '#f9f9f9'
        }}
      />
      
      {isLoaded && (
        <div style={{ marginTop: '10px', color: 'green' }}>
          ✅ Component test completed - check above for rendered content and console for details
        </div>
      )}
    </div>
  );
};

const meta: Meta<typeof DirectComponentTest> = {
  title: 'Debug/Direct Component Test',
  component: DirectComponentTest,
};

export default meta;

type Story = StoryObj<typeof DirectComponentTest>;

export const TestAIWriter: Story = {};
