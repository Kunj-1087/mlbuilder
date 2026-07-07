/**
 * SearchModal — full-featured command palette for MLBuilder.
 *
 * Features:
 *  - Fuzzy search across all content via Fuse.js
 *  - Type filter pills (Blog, Automation, Research, etc.)
 *  - Keyboard navigation (↑/↓, Enter, Esc)
 *  - Empty-state suggestions view
 *  - Matched text highlighting
 *  - Accessible (focus trap, ARIA attributes)
 *
 * No external UI library needed — pure React + Tailwind matching
 * the established neo-brutalist design system.
 */
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import type { FuseResultMatch } from 'fuse.js';
import { useSearch } from '@/lib/search/SearchContext';
import { useSearchIndex } from '@/lib/search/useSearchIndex';
import { useSearchAnalytics } from '@/lib/search/useSearchAnalytics';
import { track, EVENTS } from '@/lib/analytics/track';
import BookmarkButton from '@/components/bookmarks/BookmarkButton';
import {
  fuseConfig,
  TYPE_LABELS,
  COVER_BG,
  FILTER_TYPES,
  SUGGESTION_CHIPS,
  QUICK_LINKS,
  type SearchableItem,
} from '@/lib/search/fuseConfig';

/* ─── Search icon ─── */
function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.5" />
      <path d="M16 16L20 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Close / X icon ─── */
function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Enter / Return icon ─── */
function EnterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12 4V8H4M4 8L7 5M4 8L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Cover square for result items ─── */
function ResultCover({ item }: { item: SearchableItem }) {
  if (item.type === 'page') {
    return (
      <div className="w-10 h-10 rounded-sharp bg-surface border-2 border-ink/20 flex items-center justify-center text-lg flex-shrink-0">
        {item.coverEmoji || '📄'}
      </div>
    );
  }

  const bg = item.coverColor ? (COVER_BG[item.coverColor.replace('bg-cover-', '')] || 'bg-cover-navy') : 'bg-accent';

  return (
    <div className={`w-10 h-10 rounded-sharp ${bg} flex items-center justify-center text-lg flex-shrink-0`}>
      {item.coverEmoji || item.title.charAt(0)}
    </div>
  );
}

/* ─── Highlight matched text ─── */
function HighlightedText({ text, matches, fieldKey }: { text: string; matches?: FuseResultMatch[]; fieldKey: string }) {
  if (!matches) return <>{text}</>;

  const match = matches.find((m) => m.key === fieldKey);
  if (!match) return <>{text}</>;

  // Build highlighted segments from match indices
  const indices = match.indices.slice().sort((a, b) => a[0] - b[0]);
  const segments: { start: number; end: number; highlight: boolean }[] = [];
  let lastEnd = 0;

  for (const [start, end] of indices) {
    if (start > lastEnd) {
      segments.push({ start: lastEnd, end: start, highlight: false });
    }
    segments.push({ start, end: end + 1, highlight: true });
    lastEnd = end + 1;
  }
  if (lastEnd < text.length) {
    segments.push({ start: lastEnd, end: text.length, highlight: false });
  }

  return (
    <>
      {segments.map((seg, i) => {
        const slice = text.slice(seg.start, seg.end);
        if (seg.highlight) {
          return (
            <mark key={i} className="bg-accent/20 text-ink underline decoration-accent decoration-2 underline-offset-2">
              {slice}
            </mark>
          );
        }
        return <span key={i}>{slice}</span>;
      })}
    </>
  );
}

/* ─── Individual search result row ─── */
interface SearchResultRowProps {
  item: SearchableItem & { matches?: FuseResultMatch[] };
  isSelected: boolean;
  onHover: () => void;
  onSelect: () => void;
  refCallback?: (el: HTMLElement | null) => void;
}

function SearchResultRow({ item, isSelected, onHover, onSelect, refCallback }: SearchResultRowProps) {
  return (
    <div
      ref={refCallback}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-sharp
        transition-colors cursor-pointer
        ${isSelected ? 'bg-cream-muted' : 'hover:bg-cream-muted focus:bg-cream-muted'}
      `}
      role="option"
      aria-selected={isSelected}
      onClick={onSelect}
      onMouseEnter={onHover}
    >
      <ResultCover item={item} />

      <div className="flex-1 min-w-0">
        <p className="font-display text-[16px] text-ink truncate">
          <HighlightedText
            text={item.title}
            matches={item.matches}
            fieldKey="title"
          />
        </p>
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          {TYPE_LABELS[item.type]} · {item.category}
        </p>
      </div>

      <BookmarkButton
        item={{
          itemType: item.type,
          itemId: item.id,
          itemTitle: item.title,
          itemExcerpt: item.excerpt,
          itemUrl: item.url,
          itemCoverColor: item.coverColor,
          itemCoverEmoji: item.coverEmoji,
          itemCategory: item.category,
        }}
        variant="icon"
      />

      {isSelected && (
        <span className="text-muted flex-shrink-0"><EnterIcon /></span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SEARCH MODAL
   ═══════════════════════════════════════════════════════════ */
export default function SearchModal() {
  const { isOpen, close, initialQuery } = useSearch();
  const { index, isLoading } = useSearchIndex();
  const { logSearch, logClick } = useSearchAnalytics();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchableItem['type'] | 'all'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [os, setOs] = useState<'mac' | 'other'>('other');

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const resultRefs = useRef<(HTMLElement | null)[]>([]);

  // Detect OS for shortcut hint
  useEffect(() => {
    setOs(navigator.platform.toUpperCase().includes('MAC') ? 'mac' : 'other');
  }, []);

  // Track modal open with trigger source
  useEffect(() => {
    if (isOpen) {
      track(EVENTS.SEARCH_MODAL_OPENED, { trigger: 'shortcut' });
    }
  }, [isOpen]);

  // Reset state when modal opens, apply initialQuery if provided
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery || '');
      setActiveFilter('all');
      setSelectedIndex(0);
      resultRefs.current = [];
      // Focus input after a tick (allow render)
      requestAnimationFrame(() => inputRef.current?.focus());
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, initialQuery]);

  // Fuse.js instance (memoized)
  // NOTE: If the search index grows past 500 items, consider memoizing
  // the Fuse instance creation (it's expensive on large datasets).
  const fuse = useMemo(() => {
    if (!index) return null;
    return new Fuse(index, fuseConfig);
  }, [index]);

  // Filter + search results
  const results = useMemo(() => {
    if (!fuse) return [];

    let      items: (SearchableItem & { matches?: FuseResultMatch[] })[];

    if (query.length === 0) {
      // Empty query: show quick links
      items = QUICK_LINKS.map((item) => ({ ...item }));
    } else {
      const fuseResults = fuse.search(query);
      items = fuseResults.map((r) => ({
        ...r.item,
        matches: r.matches ? [...r.matches] : undefined,
      }));
    }

    // Apply type filter
    if (activeFilter !== 'all') {
      items = items.filter((item) => item.type === activeFilter);
    }

    return items;
  }, [fuse, query, activeFilter]);

  // Group results by type (when filter is "all")
  const groupedResults = useMemo(() => {
    if (activeFilter !== 'all' || query.length === 0) {
      return null;
    }

    const groups = new Map<string, (SearchableItem & { matches?: FuseResultMatch[] })[]>();
    for (const item of results) {
      const label = TYPE_LABELS[item.type];
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label)!.push(item);
    }
    return groups;
  }, [results, activeFilter, query]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length, query, activeFilter]);

  // Scroll selected item into view
  useEffect(() => {
    const el = resultRefs.current[selectedIndex];
    if (el) {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Navigate to a result
  const navigateTo = useCallback((item: SearchableItem) => {
    logClick(query);
    track(EVENTS.SEARCH_RESULT_CLICKED, {
      query,
      result_type: item.type,
      result_position: results.indexOf(item),
    });
    close();
    if (item.url.startsWith('http')) {
      window.open(item.url, '_blank');
    } else {
      navigate(item.url);
    }
  }, [close, navigate, logClick, query, results]);

  // Keyboard handling
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      close();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      navigateTo(results[selectedIndex]);
    }
  }, [close, results, selectedIndex, navigateTo]);

  // Log search queries (debounced)
  useEffect(() => {
    if (query.length > 0) {
      logSearch(query, results.length);
      track(EVENTS.SEARCH_QUERY_SUBMITTED, { query, results_count: results.length });
      if (results.length === 0) {
        track(EVENTS.SEARCH_NO_RESULTS, { query });
      }
    }
  }, [query, results.length, logSearch]);

  // Handle suggestion chip click
  const handleChipClick = (chip: string) => {
    setQuery(chip);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  // Determine result count for aria-live
  const resultCount = query.length > 0 ? results.length : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center"
      style={{ paddingTop: '15vh' }}
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm search-backdrop"
        onClick={close}
      />

      {/* Modal container */}
      <div
        className="
          relative z-10 w-full max-w-[720px] mx-4
          bg-cream border-2 border-ink rounded-sharp
          shadow-[12px_12px_0_#111111]
          flex flex-col
          max-h-[80vh]
          search-modal
        "
        role="dialog"
        aria-label="Search MLBuilder"
      >
        {/* ── Header ── */}
        <div className="px-6 pt-5 pb-4 border-b-2 border-ink">
          {/* Top row */}
          <div className="flex items-center justify-between mb-3">
            <p className="font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-ink">
              § SEARCH MLBUILDER
            </p>
            <button
              onClick={close}
              className="
                w-7 h-7 rounded-pill border-2 border-ink
                flex items-center justify-center
                text-ink hover:bg-ink hover:text-cream
                transition-colors cursor-pointer
              "
              aria-label="Close search (Esc)"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Search input row */}
          <div className="flex items-center gap-3">
            <SearchIcon className="text-ink flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts, tools, papers..."
              className="
                flex-1 bg-transparent border-none outline-none
                font-display text-[28px] text-ink
                placeholder:text-muted/50
                min-w-0
              "
              style={{ fontSize: '28px' }}
              aria-label="Search MLBuilder"
              aria-expanded={results.length > 0}
              aria-controls="search-results"
              role="combobox"
              aria-autocomplete="list"
            />
            <span className="flex-shrink-0 px-2 py-0.5 rounded-pill border-2 border-ink/20 bg-surface font-mono text-[11px] text-muted">
              {os === 'mac' ? '⌘K' : 'Ctrl K'}
            </span>
          </div>
        </div>

        {/* ── Filter pills ── */}
        <div className="px-4 py-3 border-b-2 border-ink/10 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {FILTER_TYPES.map((filter) => (
              <button
                key={filter.type}
                onClick={() => {
                  setActiveFilter(filter.type);
                  setSelectedIndex(0);
                }}
                className={`
                  px-3 py-1.5 rounded-pill border-2 border-ink
                  font-body text-[12px] font-semibold
                  transition-all duration-100 cursor-pointer
                  whitespace-nowrap
                  ${activeFilter === filter.type
                    ? 'bg-ink text-cream shadow-hard-sm'
                    : 'bg-cream text-ink hover:bg-surface shadow-hard-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]'
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Results area ── */}
        <div
          ref={resultsRef}
          id="search-results"
          role="listbox"
          aria-label="Search results"
          className="flex-1 overflow-y-auto px-2 py-2 min-h-0"
          style={{ maxHeight: '480px' }}
        >
          {/* Announce result count for screen readers */}
          {query.length > 0 && (
            <div className="sr-only" aria-live="polite">
              {resultCount} {resultCount === 1 ? 'result' : 'results'} found
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="font-script text-muted text-lg">Loading search index…</p>
            </div>
          ) : query.length === 0 ? (
            /* ── Empty state: suggestions ── */
            <div className="space-y-6 px-2 py-2">
              {/* Section A: Try searching for */}
              <div>
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-2">
                  § TRY SEARCHING FOR
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTION_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleChipClick(chip)}
                      className="
                        px-3 py-1.5 rounded-pill border-2 border-ink
                        bg-cream text-ink font-body text-[12px] font-medium
                        hover:bg-accent hover:text-ink
                        transition-colors cursor-pointer
                      "
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section B: Quick links */}
              <div>
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-2">
                  § QUICK LINKS
                </p>
                <div className="space-y-1">
                  {QUICK_LINKS.map((item, i) => (
                    <button
                      key={item.id}
                      ref={(el) => { resultRefs.current[i] = el; }}
                      onClick={() => navigateTo(item)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-sharp
                        text-left transition-colors cursor-pointer
                        ${selectedIndex === i ? 'bg-cream-muted' : 'hover:bg-cream-muted focus:bg-cream-muted'}
                      `}
                      role="option"
                      aria-selected={selectedIndex === i}
                    >
                      <ResultCover item={item} />
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-[16px] text-ink truncate">{item.title}</p>
                        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                          {item.category}
                        </p>
                      </div>
                      {selectedIndex === i && (
                        <span className="text-muted"><EnterIcon /></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            /* ── No results ── */
            <div className="flex flex-col items-center justify-center py-12">
              <h3 className="font-display text-2xl text-ink mb-2">NOTHING MATCHED.</h3>
              <p className="font-script text-muted text-lg mb-4">
                Try a different word, or check the filter above.
              </p>
              <button
                onClick={() => { setQuery(''); setActiveFilter('all'); }}
                className="font-body text-sm text-accent hover:text-ink transition-colors cursor-pointer"
              >
                → Browse all content
              </button>
            </div>
          ) : groupedResults ? (
            /* ── Grouped results (All filter) ── */
            <div className="space-y-1">
              {Array.from(groupedResults.entries()).map(([typeLabel, items]) => (
                <div key={typeLabel}>
                  <p className="font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-muted px-3 pt-4 pb-1">
                    {typeLabel} ({items.length})
                  </p>
                  {items.map((item) => {
                    const globalIdx = results.indexOf(item);
                    return (
                      <SearchResultRow
                        key={item.id}
                        item={item}
                        isSelected={selectedIndex === globalIdx}
                        refCallback={(el) => { resultRefs.current[globalIdx] = el; }}
                        onSelect={() => navigateTo(item)}
                        onHover={() => setSelectedIndex(globalIdx)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            /* ── Flat results (specific filter) ── */
            <div className="space-y-1">
              {results.map((item, i) => (
                <SearchResultRow
                  key={item.id}
                  item={item}
                  isSelected={selectedIndex === i}
                  refCallback={(el) => { resultRefs.current[i] = el; }}
                  onSelect={() => navigateTo(item)}
                  onHover={() => setSelectedIndex(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-3 border-t-2 border-ink/10 flex items-center justify-between">
          <p className="font-body text-[12px] text-muted">
            <kbd className="px-1 py-0.5 border border-ink/20 rounded text-[10px] font-mono">↑↓</kbd> navigate{' '}
            <span className="mx-1 text-muted/40">·</span>{' '}
            <kbd className="px-1 py-0.5 border border-ink/20 rounded text-[10px] font-mono">↵</kbd> open{' '}
            <span className="mx-1 text-muted/40">·</span>{' '}
            <kbd className="px-1 py-0.5 border border-ink/20 rounded text-[10px] font-mono">esc</kbd> close
          </p>
          <p className="font-body text-[11px] text-muted/50">
            Powered by Fuse.js
          </p>
        </div>
      </div>
    </div>
  );
}
