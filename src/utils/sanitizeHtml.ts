import DOMPurify from 'dompurify';

export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'b', 'i', 'strong', 'em', 'strike', 's', 'u',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
      'a', 'img', 'br', 'hr', 'span', 'div'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'style', 'width', 'height'
    ],
    ADD_ATTR: ['target'],
  });
}
