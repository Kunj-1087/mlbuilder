"use client";

import { useState, useEffect } from 'react';
import type { SearchableItem } from './fuseConfig';

// Module-level cache — built once per session
let cachedIndex: SearchableItem[] | null = null;

export function useSearchIndex() {
  const [index, setIndex] = useState<SearchableItem[] | null>(cachedIndex);
  const [isLoading, setIsLoading] = useState(!cachedIndex);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cachedIndex) return;

    setIsLoading(true);
    fetch('/api/search/index')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch search index');
        }
        return res.json();
      })
      .then((data) => {
        cachedIndex = data;
        setIndex(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Error loading search index:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { index, isLoading, error };
}
