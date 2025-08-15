import React from 'react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import './AIResultDisplay.css';

export interface AIResultDisplayProps {
  content: string;
  allowCopy?: boolean;
  allowDownload?: boolean;
  downloadFileName?: string;
  className?: string;
}

export default function AIResultDisplay({
  content,
  allowCopy = true,
  allowDownload = true,
  downloadFileName = 'ai-content.md',
  className = '',
}: AIResultDisplayProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success('Content copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFileName;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Content downloaded!');
  };

  if (!content) {
    return null;
  }

  return (
    <div className={`ai-result-display ${className}`}>
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Generated Content
        </h3>
        <div className="ml-auto flex gap-2">
          {allowCopy && (
            <button
              onClick={handleCopy}
              className="ai-result-display__button ai-result-display__button--secondary"
            >
              Copy
            </button>
          )}
          {allowDownload && (
            <button
              onClick={handleDownload}
              className="ai-result-display__button ai-result-display__button--primary"
            >
              Download
            </button>
          )}
        </div>
      </div>

      <div className="ai-content-wrapper custom-scrollbar">
        <div className="blog-prose prose prose-blue max-w-none text-base leading-7">
          <ReactMarkdown
            components={{
              pre: ({ node: _node, ...props }) => (
                <div className="overflow-auto w-full my-4 bg-gray-900 text-gray-100 p-4 rounded-lg">
                  <pre {...props} />
                </div>
              ),
              code: ({ node: _node, ...props }) => (
                <code
                  className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm"
                  {...props}
                />
              ),
              h1: ({ node: _node, ...props }) => (
                <h1
                  className="text-2xl font-bold text-gray-900 mb-4 mt-6 pb-2 border-b border-gray-200"
                  {...props}
                />
              ),
              h2: ({ node: _node, ...props }) => (
                <h2
                  className="text-xl font-semibold text-gray-800 mb-3 mt-5"
                  {...props}
                />
              ),
              h3: ({ node: _node, ...props }) => (
                <h3
                  className="text-lg font-medium text-gray-800 mb-2 mt-4"
                  {...props}
                />
              ),
              p: ({ node: _node, ...props }) => (
                <p className="text-gray-700 mb-4 leading-relaxed" {...props} />
              ),
              li: ({ node: _node, ...props }) => (
                <li className="text-gray-700 mb-1" {...props} />
              ),
              ul: ({ node: _node, ...props }) => (
                <ul
                  className="list-disc list-inside text-gray-700 mb-4 space-y-1"
                  {...props}
                />
              ),
              ol: ({ node: _node, ...props }) => (
                <ol
                  className="list-decimal list-inside text-gray-700 mb-4 space-y-1"
                  {...props}
                />
              ),
              blockquote: ({ node: _node, ...props }) => (
                <blockquote
                  className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4"
                  {...props}
                />
              ),
              a: ({ node: _node, ...props }) => (
                <a
                  className="text-blue-600 underline hover:text-blue-800"
                  {...props}
                />
              ),
              em: ({ node: _node, ...props }) => (
                <em className="italic text-gray-600" {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
