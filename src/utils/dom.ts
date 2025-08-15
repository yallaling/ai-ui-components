/**
 * DOM utility functions
 */

/**
 * Safely get element by ID
 */
export const getElementById = (id: string): HTMLElement | null => {
  if (typeof document === 'undefined') return null;
  return document.getElementById(id);
};

/**
 * Add class to element if it doesn't exist
 */
export const addClass = (element: HTMLElement, className: string): void => {
  if (!element.classList.contains(className)) {
    element.classList.add(className);
  }
};

/**
 * Remove class from element if it exists
 */
export const removeClass = (element: HTMLElement, className: string): void => {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  }
};

/**
 * Toggle class on element
 */
export const toggleClass = (element: HTMLElement, className: string): void => {
  element.classList.toggle(className);
};

/**
 * Check if element is visible in viewport
 */
export const isElementInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};
