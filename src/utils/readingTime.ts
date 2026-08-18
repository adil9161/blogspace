/**
 * Estimates reading time in minutes based on average 200 words per minute
 */
export function calculateReadingTime(textOrHtml: string): number {
  if (!textOrHtml) return 1;
  
  // Strip HTML tags to get raw text
  const text = textOrHtml.replace(/<[^>]*>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return Math.max(1, minutes);
}

export function getWordCount(textOrHtml: string): number {
  if (!textOrHtml) return 0;
  const text = textOrHtml.replace(/<[^>]*>/g, ' ');
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function getCharacterCount(textOrHtml: string): number {
  if (!textOrHtml) return 0;
  const text = textOrHtml.replace(/<[^>]*>/g, '');
  return text.length;
}
