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
              pre: ({ node, ...props }) => (
                <div className="overflow-auto w-full my-4 bg-gray-900 text-gray-100 p-4 rounded-lg">
                  <pre {...props} />
                </div>
              ),
              code: ({ node, ...props }) => (
                <code
                  className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm"
                  {...props}
                />
              ),
              h1: ({ node, ...props }) => (
                <h1
                  className="text-3xl font-bold mt-8 mb-4 text-gray-900 border-b border-gray-200 pb-2"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-2xl font-bold mt-6 mb-3 text-gray-900"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-xl font-bold mt-5 mb-2 text-gray-900"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p className="mb-4 leading-relaxed text-gray-700" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  className="mb-4 ml-6 list-disc space-y-1 text-gray-700"
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  className="mb-4 ml-6 list-decimal space-y-1 text-gray-700"
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li className="leading-relaxed" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-blue-500 pl-4 italic my-4 bg-blue-50 py-2 text-gray-800"
                  {...props}
                />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-semibold text-gray-900" {...props} />
              ),
              em: ({ node, ...props }) => (
                <em className="italic text-gray-800" {...props} />
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
