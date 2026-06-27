/**
 * Search modal state — React Context for shared open/close state
 * between the navbar trigger, keyboard shortcut handler, and modal.
 */
import { createContext, useContext, useState, useCallback, useRef, type ReactNode, type RefObject } from 'react';

interface SearchContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  /** Ref to the trigger button — modal calls triggerRef.current?.focus() on close */
  triggerRef: RefObject<HTMLButtonElement | null>;
  /** Open search modal with a pre-filled query */
  openWithQuery: (query: string) => void;
  /** Pre-filled query to set when modal opens */
  initialQuery: string | null;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const open = useCallback(() => {
    setInitialQuery(null);
    setIsOpen(true);
  }, []);
  const openWithQuery = useCallback((query: string) => {
    setInitialQuery(query);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
    setInitialQuery(null);
    // Return focus to the trigger button for accessibility
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <SearchContext.Provider value={{ isOpen, open, close, toggle, triggerRef, openWithQuery, initialQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within a SearchProvider');
  return ctx;
}
