/**
 * Canonical URL helper for MLBuilder.
 *
 * Returns absolute canonical URLs with proper normalization.
 * All canonical URLs are absolute (include the domain) for safety.
 */

const BASE_URL = import.meta.env.VITE_SITE_URL || 'https://mlbuilder.in';

/**
 * Returns a normalized absolute canonical URL for the given path.
 * - Strips trailing slashes (except root)
 * - Lowercases
 * - Strips query params and hash
 */
export function getCanonicalUrl(path: string): string {
  let normalized = path.split('?')[0].split('#')[0];
  // Lowercase
  normalized = normalized.toLowerCase();
  // Strip trailing slash (except for root)
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  return `${BASE_URL}${normalized}`;
}

export { BASE_URL };
