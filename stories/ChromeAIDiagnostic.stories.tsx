import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const ChromeAIDiagnostic = () => {
  const [diagnostics, setDiagnostics] = React.useState<Record<string, any>>({});
  
  React.useEffect(() => {
    const checkChromeAI = async () => {
      const results: Record<string, any> = {};
      
      // Basic Chrome AI availability - use same detection as working components
      results.windowAI = 'ai' in window;
      results.selfWriter = 'Writer' in self;
      results.selfSummarizer = 'Summarizer' in self;
      results.selfTranslator = 'Translator' in self;
      results.selfLanguageDetector = 'LanguageDetector' in self;
      results.selfRewriter = 'Rewriter' in self;
      results.userAgent = navigator.userAgent;
      results.isChrome = navigator.userAgent.includes('Chrome');
      
      // If window.ai exists, check what's available
      if ('ai' in window) {
        const ai = (window as any).ai;
        results.aiObject = ai;
        results.aiKeys = Object.keys(ai || {});
        
        // Check specific AI capabilities
        try {
          results.canCreateTextSession = typeof ai?.languageModel?.create === 'function';
          results.canCreateSummarizer = typeof ai?.summarizer?.create === 'function';
          results.canCreateWriter = typeof ai?.writer?.create === 'function';
          results.canCreateRewriter = typeof ai?.rewriter?.create === 'function';
          results.canCreateTranslator = typeof ai?.translator?.create === 'function';
          results.canDetectLanguage = typeof ai?.languageDetector?.create === 'function';
        } catch (error) {
          results.capabilityCheckError = error;
        }
      }
      
      // Check if Chrome AI APIs are available on self (the working method)
      if ('Writer' in self) {
        try {
          results.writerAvailabilityCheck = 'Available for testing';
          // Test actual availability like your working code
          const testAvailability = await (self as any).Writer.availability({
            tone: 'casual',
            format: 'plain-text',
            length: 'medium'
          });
          results.writerAvailabilityResult = testAvailability;
        } catch (error) {
          results.writerAvailabilityError = error;
        }
      }
      
      if ('Summarizer' in self) {
        try {
          results.summarizerAvailabilityCheck = 'Available for testing';
          const testAvailability = await (self as any).Summarizer.availability();
          results.summarizerAvailabilityResult = testAvailability;
        } catch (error) {
          results.summarizerAvailabilityError = error;
        }
      }
      
      // Check Chrome version
      const chromeMatch = navigator.userAgent.match(/Chrome\/(\d+)/);
      results.chromeVersion = chromeMatch ? parseInt(chromeMatch[1]) : null;
      
      setDiagnostics(results);
    };
    
    checkChromeAI();
  }, []);
  
  const renderValue = (key: string, value: any): string => {
    if (typeof value === 'boolean') return value ? '✅ Yes' : '❌ No';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };
  
  return (
    <div>
      <h2>Chrome AI Diagnostic</h2>
      <p>This tool checks what Chrome AI features are available in your browser.</p>
      
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h3>🔧 How to Enable Chrome AI:</h3>
        <ol>
          <li><strong>Use Chrome Canary or Chrome Dev</strong> (version 127+)</li>
          <li><strong>Enable AI features:</strong>
            <ul>
              <li>Go to <code>chrome://flags/#optimization-guide-on-device-model</code></li>
              <li>Set to <strong>"Enabled BypassPerfRequirement"</strong></li>
              <li>Go to <code>chrome://flags/#prompt-api-for-gemini-nano</code></li>
              <li>Set to <strong>"Enabled"</strong></li>
              <li>Restart Chrome</li>
            </ul>
          </li>
          <li><strong>Download the AI model:</strong>
            <ul>
              <li>Go to <code>chrome://components/</code></li>
              <li>Find "Optimization Guide On Device Model"</li>
              <li>Click "Check for update" to download Gemini Nano</li>
            </ul>
          </li>
        </ol>
      </div>
      
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '15px',
        fontFamily: 'monospace',
        fontSize: '12px',
        backgroundColor: '#f8f9fa'
      }}>
        <h3>Diagnostic Results:</h3>
        {Object.entries(diagnostics).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '8px' }}>
            <strong>{key}:</strong> {renderValue(key, value)}
          </div>
        ))}
      </div>
      
      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: (diagnostics.selfWriter || diagnostics.selfSummarizer) ? '#d4edda' : '#f8d7da',
        border: `1px solid ${(diagnostics.selfWriter || diagnostics.selfSummarizer) ? '#c3e6cb' : '#f5c6cb'}`,
        borderRadius: '4px'
      }}>
        <h3>{(diagnostics.selfWriter || diagnostics.selfSummarizer) ? '✅ Chrome AI Available!' : '❌ Chrome AI Not Available'}</h3>
        {(diagnostics.selfWriter || diagnostics.selfSummarizer) ? (
          <div>
            <p>Chrome AI is detected using the correct method! The universal components should work.</p>
            <p><strong>Available APIs:</strong></p>
            <ul>
              {diagnostics.selfWriter && <li>✅ Writer API</li>}
              {diagnostics.selfSummarizer && <li>✅ Summarizer API</li>}
              {diagnostics.selfTranslator && <li>✅ Translator API</li>}
              {diagnostics.selfLanguageDetector && <li>✅ Language Detector API</li>}
              {diagnostics.selfRewriter && <li>✅ Rewriter API</li>}
            </ul>
            {diagnostics.writerAvailabilityResult && (
              <p><strong>Writer Status:</strong> {diagnostics.writerAvailabilityResult}</p>
            )}
            {diagnostics.summarizerAvailabilityResult && (
              <p><strong>Summarizer Status:</strong> {diagnostics.summarizerAvailabilityResult}</p>
            )}
          </div>
        ) : (
          <p>Chrome AI is not available. Please follow the setup instructions above to enable it.</p>
        )}
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Note:</strong> Chrome AI is experimental and requires specific Chrome versions and flags to be enabled.</p>
        <p><strong>Alternative:</strong> Our components will fallback to mock responses if AI isn't available (for development).</p>
      </div>
    </div>
  );
};

const meta: Meta<typeof ChromeAIDiagnostic> = {
  title: 'Tests/Chrome AI Diagnostic',
  component: ChromeAIDiagnostic,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DiagnosticTool: Story = {};
