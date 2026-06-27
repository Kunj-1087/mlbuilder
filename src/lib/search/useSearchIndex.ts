/**
 * Custom hook for the search index.
 *
 * Builds the unified search index from all content sources and caches
 * it in module-level state for the rest of the session. Since the index
 * is built synchronously from client-side data, there's no async loading.
 */
import { useState } from 'react';
import { buildSearchIndex } from './searchIndex';
import type { SearchableItem } from './fuseConfig';

// Module-level cache — built once per session
let cachedIndex: SearchableItem[] | null = null;

export function useSearchIndex() {
  const [index] = useState<SearchableItem[] | null>(() => {
    if (cachedIndex) return cachedIndex;
    // Build synchronously on first render
    try {
      const items = buildSearchIndex();
      cachedIndex = items;
      return items;
    } catch {
      return null;
    }
  });

  return { index, isLoading: false, error: null };
}
