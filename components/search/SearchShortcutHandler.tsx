"use client";

/**
 * SearchShortcutHandler — listens for keyboard shortcuts to open search.
 *
 * Shortcuts:
 *  - ⌘+K (Mac) or Ctrl+K (Windows/Linux) → opens SearchModal
 *  - `/` key when NOT focused inside an input/textarea → opens SearchModal
 *  - Esc when modal is open → closes (handled by the modal itself)
 *
 * Mount alongside SearchModal in the root layout.
 */
import { useEffect } from 'react';
import { useSearch } from '@/lib/search/SearchContext';

export default function SearchShortcutHandler() {
  const { open } = useSearch();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Skip if inside an input, textarea, or contenteditable
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isEditing = tag === 'input' || tag === 'textarea' || tag === 'select'
        || (e.target as HTMLElement)?.isContentEditable;

      // ⌘+K or Ctrl+K → always open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        open();
        return;
      }

      // "/" key → open only when not typing in an input
      if (e.key === '/' && !isEditing) {
        e.preventDefault();
        open();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // This component renders nothing — it's a keyboard listener only
  return null;
}
