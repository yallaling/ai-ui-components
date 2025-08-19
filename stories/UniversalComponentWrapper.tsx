import React from 'react';

// Simple wrapper component that loads and displays universal web components
export const UniversalComponentWrapper = ({ 
  title, 
  description, 
  componentTag,
  attributes = {}
}: { 
  title: string; 
  description: string; 
  componentTag: string;
  attributes?: Record<string, string>;
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const elementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const loadComponents = async () => {
      try {
        // Try local components first since they might be more reliable
        try {
          await import('../packages/components/src/components/ai-translator');
          await import('../packages/components/src/components/ai-summarizer');
          await import('../packages/components/src/components/ai-language-detector');
          await import('../packages/components/src/components/ai-writer');
          await import('../packages/components/src/components/ai-rewriter');
          console.log('✅ Local universal components loaded successfully');
        } catch (localError) {
          console.log('Local components failed, trying published package...');
          await import('@yallaling/web-ai-components');
          console.log('✅ Published components loaded successfully');
        }
        
        setIsLoaded(true);
        setError(null);
      } catch (err) {
        console.error('Failed to load both published and local components:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };
    
    loadComponents();
  }, []);

  React.useEffect(() => {
    if (isLoaded && elementRef.current) {
      // Clear previous content
      elementRef.current.innerHTML = '';
      
      // Create the web component element
      const element = document.createElement(componentTag) as any;
      
      // Set all attributes BEFORE adding to DOM
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });

      // Add to DOM to trigger connectedCallback
      elementRef.current.appendChild(element);

      // Force Lit element lifecycle after DOM connection
      setTimeout(() => {
        // Manually trigger Lit element initialization if needed
        if (element && typeof element.connectedCallback === 'function') {
          element.connectedCallback();
        }
        
        // Force shadow DOM creation for Lit elements
        if (element && typeof element.createRenderRoot === 'function' && !element.shadowRoot) {
          element.createRenderRoot();
        }
        
        // Trigger requestUpdate to ensure rendering
        if (element && typeof element.requestUpdate === 'function') {
          element.requestUpdate();
        }

        // Force update cycle
        if (element && typeof element.updateComplete !== 'undefined') {
          element.updateComplete.then(() => {
            console.log(`${componentTag} update completed`);
            if (element.shadowRoot) {
              console.log(`${componentTag} shadow DOM created successfully:`, element.shadowRoot.innerHTML.length > 0);
            }
          });
        }

        // Debug: Check element state after all operations
        setTimeout(() => {
          console.log(`${componentTag} final state:`, {
            connected: element.isConnected,
            shadowRoot: !!element.shadowRoot,
            hasRendered: element.shadowRoot?.innerHTML?.length > 0
          });
        }, 1000);

      }, 100);

      // Add event listeners for debugging
      element.addEventListener('error', (e: any) => {
        console.log(`${componentTag} error:`, e.detail);
      });
      
      // Component-specific event listeners
      if (componentTag === 'ai-writer-element') {
        element.addEventListener('writing-complete', (e: any) => {
          console.log('Writing completed:', e.detail);
        });
        element.addEventListener('ai-error', (e: any) => {
          console.log('AI Writer error:', e.detail);
        });
      } else if (componentTag === 'ai-summarizer-element') {
        element.addEventListener('summary-complete', (e: any) => {
          console.log('Summary completed:', e.detail);
        });
        element.addEventListener('ai-error', (e: any) => {
          console.log('AI Summarizer error:', e.detail);
        });
      } else if (componentTag === 'ai-translator-element') {
        element.addEventListener('translation-complete', (e: any) => {
          console.log('Translation completed:', e.detail);
        });
        element.addEventListener('ai-error', (e: any) => {
          console.log('AI Translator error:', e.detail);
        });
      } else if (componentTag === 'ai-language-detector-element') {
        element.addEventListener('detection-complete', (e: any) => {
          console.log('Language detection completed:', e.detail);
        });
        element.addEventListener('ai-error', (e: any) => {
          console.log('AI Language Detector error:', e.detail);
        });
      } else if (componentTag === 'ai-rewriter-element') {
        element.addEventListener('rewrite-complete', (e: any) => {
          console.log('Rewrite completed:', e.detail);
        });
        element.addEventListener('ai-error', (e: any) => {
          console.log('AI Rewriter error:', e.detail);
        });
      }
    }
  }, [isLoaded, componentTag, attributes]);

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h3>{title}</h3>
      <p>{description}</p>
      
      {error && (
        <div style={{ 
          background: '#fee', 
          border: '1px solid #fcc', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '10px',
          color: '#c33'
        }}>
          Error loading components: {error}
          <details style={{ marginTop: '8px' }}>
            <summary>Troubleshooting</summary>
            <p>Make sure Chrome AI APIs are available and components are properly installed.</p>
          </details>
        </div>
      )}
      
      {!isLoaded && !error && (
        <div style={{ 
          background: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          Loading universal components...
        </div>
      )}
      
      {isLoaded && (
        <div 
          ref={elementRef}
          style={{
            minHeight: '400px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '20px',
            background: '#ffffff',
            marginBottom: '16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        />
      )}
      
      {isLoaded && (
        <div style={{ 
          fontSize: '12px', 
          color: '#666', 
          marginTop: '8px',
          padding: '8px',
          background: '#f0f8ff',
          borderRadius: '4px'
        }}>
          ✅ Component loaded: <code>{componentTag}</code>
          <br />
          📝 Check browser console for event logs
        </div>
      )}
    </div>
  );
};
