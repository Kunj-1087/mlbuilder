/**
 * Lightweight search analytics — logs queries and clicks to localStorage.
 *
 * When a real backend is available, replace the localStorage calls with
 * fetch() to POST /api/search/log. The SearchLog Prisma model is ready.
 *
 * TODO: Build /admin/search-insights dashboard later to surface
 *       zero-result queries and popular searches.
 */
import { useRef, useCallback } from 'react';

const LOG_KEY = 'mlbuilder_search_logs';
const RATE_LIMIT_MS = 2000; // 1 log per 2 seconds per session

interface SearchLogEntry {
  query: string;
  resultsCount: number;
  hadClick: boolean;
  timestamp: number;
}

function getLogs(): SearchLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLogs(logs: SearchLogEntry[]) {
  if (typeof window === 'undefined') return;
  // Keep only last 100 entries to avoid bloat
  const trimmed = logs.slice(-100);
  try {
    localStorage.setItem(LOG_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

export function useSearchAnalytics() {
  const lastLogTime = useRef(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logSearch = useCallback((query: string, resultsCount: number) => {
    const now = Date.now();
    if (now - lastLogTime.current < RATE_LIMIT_MS) return;

    // Debounce: wait 500ms after user stops typing
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const entry: SearchLogEntry = {
        query: query.toLowerCase().trim(),
        resultsCount,
        hadClick: false,
        timestamp: Date.now(),
      };
      const logs = getLogs();
      logs.push(entry);
      saveLogs(logs);
      lastLogTime.current = Date.now();
    }, 500);
  }, []);

  const logClick = useCallback((query: string) => {
    const logs = getLogs();
    // Mark the most recent log with matching query as having a click
    for (let i = logs.length - 1; i >= 0; i--) {
      if (logs[i].query === query.toLowerCase().trim() && !logs[i].hadClick) {
        logs[i].hadClick = true;
        saveLogs(logs);
        break;
      }
    }
  }, []);

  return { logSearch, logClick };
}
