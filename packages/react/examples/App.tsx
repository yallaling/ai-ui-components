import React, { useState } from 'react';
import { 
  AITranslator, 
  AISummarizer, 
  AIRewriter,
  AILanguageDetector,
  AIWriter,
  LoadingSpinner,
  Button
} from '../src';

/**
 * Example React app demonstrating the universal Chrome AI components
 */
function App() {
  const [translatedText, setTranslatedText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState('');

  const handleTranslation = (result: string) => {
    setTranslatedText(result);
    setIsLoading(false);
  };

  const handleSummarization = (result: string) => {
    setSummary(result);
    setIsLoading(false);
  };

  const handleError = (error: string) => {
    console.error('AI Error:', error);
    setIsLoading(false);
  };

  return (
    <div className="app">
      <h1>Chrome AI Universal Components - React Example</h1>
      
      {/* Basic Translation */}
      <section className="demo-section">
        <h2>AI Translator</h2>
        <AITranslator
          sourceLanguage="en"
          targetLanguage="es"
          text="Hello, this is a test of the Chrome AI translation capabilities!"
          autoTranslate={true}
          streaming={false}
          onTranslate={handleTranslation}
          onError={handleError}
          showInput={true}
          showControls={true}
          showOutput={true}
        />
        
        {translatedText && (
          <div className="result">
            <h3>Translation Result:</h3>
            <p>{translatedText}</p>
          </div>
        )}
      </section>

      {/* Data-driven Translation */}
      <section className="demo-section">
        <h2>Data-driven Translation</h2>
        <div>
          <textarea
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="Enter data to translate..."
            rows={3}
            cols={50}
          />
        </div>
        
        <AITranslator
          sourceLanguage="en"
          targetLanguage="fr"
          data={data}
          autoTranslate={true}
          controlsOnly={false}
          onTranslate={(result) => console.log('Data translation:', result)}
          onError={handleError}
        />
      </section>

      {/* AI Summarizer */}
      <section className="demo-section">
        <h2>AI Summarizer</h2>
        <AISummarizer
          type="key-points"
          format="markdown"
          length="medium"
          text="Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. The term may also be applied to any machine that exhibits traits associated with a human mind such as learning and problem-solving. The ideal characteristic of artificial intelligence is its ability to rationalize and take actions that have the best chance of achieving a specific goal. Machine learning is a subset of artificial intelligence that refers to the process by which computers develop pattern recognition, or the ability to continuously learn from and make predictions based on data, then make adjustments without being specifically programmed to do so."
          autoSummarize={true}
          onSummarize={handleSummarization}
          onError={handleError}
          showInput={true}
          showControls={true}
          showOutput={true}
        />
        
        {summary && (
          <div className="result">
            <h3>Summary Result:</h3>
            <div dangerouslySetInnerHTML={{ __html: summary }} />
          </div>
        )}
      </section>

      {/* AI Rewriter */}
      <section className="demo-section">
        <h2>AI Rewriter</h2>
        <AIRewriter
          tone="more-formal"
          length="as-is"
          text="Hey there! This is just a quick note to let you know that our new AI features are pretty cool and we think you'll really like them!"
          autoRewrite={true}
          onContentRewritten={(content) => console.log('Rewritten:', content)}
          onError={handleError}
          showInput={true}
          showControls={true}
          showOutput={true}
        />
      </section>

      {/* AI Language Detector */}
      <section className="demo-section">
        <h2>AI Language Detector</h2>
        <AILanguageDetector
          text="Bonjour! Comment allez-vous aujourd'hui?"
          autoDetect={true}
          confidenceThreshold={0.7}
          onDetect={(detections) => console.log('Detected languages:', detections)}
          onError={handleError}
          showConfidence={true}
          maxSuggestions={3}
        />
      </section>

      {/* AI Writer */}
      <section className="demo-section">
        <h2>AI Writer</h2>
        <AIWriter
          tone="casual"
          format="markdown"
          length="medium"
          prompt="Write a brief introduction to Chrome AI APIs"
          autoGenerate={true}
          onContentGenerated={(content) => console.log('Generated content:', content)}
          onError={handleError}
          showInput={true}
          showControls={true}
          showOutput={true}
        />
      </section>

      {/* Button Examples */}
      <section className="demo-section">
        <h2>UI Components</h2>
        <div className="button-group">
          <Button variant="primary" size="large" onClick={() => alert('Primary clicked!')}>
            Primary Button
          </Button>
          <Button variant="secondary" size="medium" onClick={() => alert('Secondary clicked!')}>
            Secondary Button
          </Button>
          <Button variant="outline" size="small" disabled>
            Disabled Button
          </Button>
        </div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <section className="demo-section">
          <LoadingSpinner
            size="large"
            message="Processing with Chrome AI..."
            showMessage={true}
          />
        </section>
      )}

      {/* Programmatic Control Example */}
      <section className="demo-section">
        <h2>Programmatic Control</h2>
        <ProgrammaticExample />
      </section>
    </div>
  );
}

/**
 * Example of programmatic control over AI components
 */
function ProgrammaticExample() {
  const [translateFunction, setTranslateFunction] = useState<((data?: any) => Promise<void>) | null>(null);
  const [summarizeFunction, setSummarizeFunction] = useState<((data?: any) => Promise<void>) | null>(null);

  const handleTranslate = async () => {
    if (translateFunction) {
      await translateFunction('This is programmatically triggered translation!');
    }
  };

  const handleSummarize = async () => {
    if (summarizeFunction) {
      await summarizeFunction('This is a long text that will be summarized programmatically using the Chrome AI summarization API. It demonstrates how you can trigger AI operations from your application code.');
    }
  };

  return (
    <div>
      <AITranslator
        sourceLanguage="en"
        targetLanguage="de"
        controlsOnly={true}
        onTranslatorReady={(translateFn) => setTranslateFunction(() => translateFn)}
        onTranslate={(result) => console.log('Programmatic translation:', result)}
      />
      
      <AISummarizer
        type="tldr"
        length="short"
        controlsOnly={true}
        onSummarizerReady={(summarizeFn) => setSummarizeFunction(() => summarizeFn)}
        onSummarize={(result) => console.log('Programmatic summary:', result)}
      />
      
      <div className="controls">
        <button onClick={handleTranslate} disabled={!translateFunction}>
          Trigger Translation
        </button>
        <button onClick={handleSummarize} disabled={!summarizeFunction}>
          Trigger Summarization
        </button>
      </div>
    </div>
  );
}

export default App;
