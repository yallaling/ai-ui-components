import { BaseComponentProps } from '../../types/common';

export type SummaryType = 'key-points' | 'tldr' | 'teaser' | 'headline';
export type SummaryFormat = 'markdown' | 'plain-text';
export type SummaryLength = 'short' | 'medium' | 'long';

export interface AISummarizerProps extends BaseComponentProps {
  /**
   * Text to summarize (can be provided externally)
   */
  text?: string;
  /**
   * External data to summarize (accepts any type - will be converted to string)
   */
  data?: any;
  /**
   * Type of summary to generate
   */
  type?: SummaryType;
  /**
   * Output format
   */
  format?: SummaryFormat;
  /**
   * Summary length
   */
  length?: SummaryLength;
  /**
   * Additional context for better summarization
   */
  context?: string;
  /**
   * Auto-summarize when text/data changes
   */
  autoSummarize?: boolean;
  /**
   * Show input text area (optional UI)
   */
  showInput?: boolean;
  /**
   * Show summarization controls
   */
  showControls?: boolean;
  /**
   * Enable streaming mode
   */
  streaming?: boolean;
  /**
   * Maximum text length for input
   */
  maxLength?: number;
  /**
   * Placeholder text for input
   */
  placeholder?: string;
  /**
   * Show output area
   */
  showOutput?: boolean;
  /**
   * Show advanced options
   */
  showOptions?: boolean;
  /**
   * Controls only mode (no input/output)
   */
  controlsOnly?: boolean;
  /**
   * External text input (for programmatic use)
   */
  externalText?: string;
  /**
   * Component width
   */
  width?: string | number;
  /**
   * Component height
   */
  height?: string | number;
  /**
   * Make component resizable
   */
  resizable?: boolean;
  /**
   * Allow copy functionality
   */
  allowCopy?: boolean;
  /**
   * Allow download functionality
   */
  allowDownload?: boolean;
  /**
   * Download filename
   */
  downloadFileName?: string;
  /**
   * Callback when summarization is complete
   */
  onSummarize?: (summary: string) => void;
  /**
   * Callback for summarization errors
   */
  onError?: (error: string) => void;
  /**
   * Callback for download progress
   */
  onProgress?: (loaded: number, total: number) => void;
  /**
   * Callback for streaming chunks
   */
  onStreamingChunk?: (chunk: string) => void;
  /**
   * Function to trigger summarization externally
   */
  onSummarizerReady?: (
    summarizeFunction: (data?: any) => Promise<void>
  ) => void;
}
