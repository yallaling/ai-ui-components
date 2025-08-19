import React, { useRef, useEffect } from 'react';

interface SecureWebComponentProps {
  tagName: string;
  attributes?: Record<string, string>;
  children?: React.ReactNode;
}

/**
 * Secure Web Component wrapper that safely creates custom elements
 * without using innerHTML or dangerouslySetInnerHTML
 */
export const SecureWebComponent: React.FC<SecureWebComponentProps> = ({
  tagName,
  attributes = {},
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content safely
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    // Create the custom element safely
    const element = document.createElement(tagName);
    
    // Set attributes safely
    Object.entries(attributes).forEach(([key, value]) => {
      if (typeof value === 'string') {
        element.setAttribute(key, value);
      }
    });

    // Append the element
    containerRef.current.appendChild(element);

    // Cleanup function
    return () => {
      if (containerRef.current?.contains(element)) {
        containerRef.current.removeChild(element);
      }
    };
  }, [tagName, attributes]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
};

export default SecureWebComponent;
