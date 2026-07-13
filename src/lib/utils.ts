/**
 * Utility to format image URLs.
 * If the path is an absolute URL (like Cloudinary), it returns it as is.
 * Otherwise, it prepends the API base URL.
 */
export const getImageUrl = (path: string | undefined | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
};
