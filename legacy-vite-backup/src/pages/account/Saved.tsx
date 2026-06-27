/**
 * Saved Items Dashboard — /account/saved
 *
 * Protected route showing all bookmarked items with
 * client-side filter, search, and sort.
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import SeoHead from '@/components/seo/SeoHead';
import AuthGuard from '@/components/AuthGuard';
import { track, EVENTS } from '@/lib/analytics/track';
import AccountSubNav from '@/components/account/AccountSubNav';
import SavedItemCard from '@/components/bookmarks/SavedItemCard';
import PillButton from '@/components/PillButton';
import { getUserBookmarks, getBookmarkCount, getRecentBookmarkCount, getDistinctCategoryCount, removeBookmark, type BookmarkItemType } from '@/lib/bookmarks';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/lib/toast';

const TYPE_FILTERS: { label: string; type: BookmarkItemType | 'all' }[] = [
  { label: 'All', type: 'all' },
  { label: 'Blog', type: 'blog' },
  { label: 'Automation', type: 'automation' },
  { label: 'Research', type: 'research' },
  { label: 'Tools', type: 'tools' },
  { label: 'Free PDFs', type: 'lead-magnet' },
];

type SortOption = 'newest' | 'oldest' | 'az';

function SavedContent() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<BookmarkItemType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [renderKey, setRenderKey] = useState(0);

  const forceRender = useCallback(() => setRenderKey((k) => k + 1), []);

  if (!user) return null;

  // Track saved items viewed on mount
  useEffect(() => {
    track(EVENTS.SAVED_ITEMS_VIEWED, { total_bookmarks: getBookmarkCount(user.id) });
  }, [user.id]);

  const bookmarks = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    void renderKey; // Force recalculation on bookmark changes
    return getUserBookmarks(user.id, {
      type: activeFilter === 'all' ? undefined : activeFilter,
      search: searchQuery || undefined,
    });
  }, [user.id, activeFilter, searchQuery, renderKey]);

  // Sort
  const sortedBookmarks = useMemo(() => {
    const sorted = [...bookmarks];
    if (sort === 'oldest') sorted.reverse();
    if (sort === 'az') sorted.sort((a, b) => a.itemTitle.localeCompare(b.itemTitle));
    return sorted;
  }, [bookmarks, sort]);

  const totalCount = getBookmarkCount(user.id);
  const thisWeekCount = getRecentBookmarkCount(user.id);
  const categoryCount = getDistinctCategoryCount(user.id);

  const handleRemove = (bookmarkId: string) => {
    removeBookmark(user.id, bookmarkId);
    toast.success('Removed from library');
    forceRender();
  };

  const handleNoteUpdate = () => {
    forceRender();
  };

  // ── True empty state (no bookmarks at all) ──
  if (totalCount === 0 && activeFilter === 'all' && !searchQuery) {
    return (
      <div className="border-2 border-ink rounded-sharp bg-cream shadow-hard p-12 md:p-16 text-center">
        <div className="flex justify-center mb-6">
          <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h2 className="font-display text-3xl text-ink mb-3">NOTHING SAVED YET.</h2>
        <p className="font-script text-muted text-xl mb-8 max-w-md mx-auto">
          Click the bookmark icon on any post, tool, or guide to start your library.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <PillButton to="/blog" variant="primary" size="md">
            Browse Blog →
          </PillButton>
          <PillButton to="/free" variant="secondary" size="md">
            Explore Free Resources
          </PillButton>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Stats row */}
      <div className="flex flex-wrap gap-x-12 gap-y-4 mb-8">
        <div>
          <div className="font-display text-[52px] leading-none text-accent">{totalCount}</div>
          <div className="font-body text-[14px] text-ink mt-1">Total saved</div>
        </div>
        <div>
          <div className="font-display text-[52px] leading-none text-accent">{thisWeekCount}</div>
          <div className="font-body text-[14px] text-ink mt-1">This week</div>
        </div>
        <div>
          <div className="font-display text-[52px] leading-none text-accent">{categoryCount}</div>
          <div className="font-body text-[14px] text-ink mt-1">Categories</div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-[2px] bg-ink mb-6" />

      {/* Filter pills */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {TYPE_FILTERS.map((filter) => (
          <button
            key={filter.type}
            onClick={() => { setActiveFilter(filter.type); setSearchQuery(''); }}
            className={`
              px-3 py-1.5 rounded-pill border-2 border-ink
              font-body text-[12px] font-semibold
              transition-all duration-100 cursor-pointer whitespace-nowrap
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

      {/* Search + Sort row */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 max-w-[480px] relative">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.5" />
            <path d="M16 16L20 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your saved items..."
            className="w-full pl-9 pr-3 py-2 bg-cream border-2 border-ink rounded-sharp font-body text-[14px] text-ink placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="px-3 py-2 bg-cream border-2 border-ink rounded-sharp font-body text-[13px] font-semibold text-ink cursor-pointer focus:outline-none"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="az">A–Z</option>
        </select>
      </div>

      {/* Items grid or empty state */}
      {sortedBookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBookmarks.map((bookmark) => (
            <SavedItemCard
              key={bookmark.id}
              bookmark={bookmark}
              onRemove={handleRemove}
              onNoteUpdate={handleNoteUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="font-display text-2xl text-ink mb-2">NOTHING MATCHES.</h3>
          <p className="font-script text-muted text-lg mb-4">
            Try a different filter or search term.
          </p>
          <button
            onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
            className="px-4 py-1.5 rounded-pill border-2 border-ink bg-cream font-body text-[12px] font-semibold text-ink hover:bg-surface transition-colors cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}

export default function SavedPage() {
  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <SeoHead
          title="Saved Items"
          description="Your bookmarked content across MLBuilder — blog posts, tools, research, and free resources."
          path="/account/saved"
          noindex
        />

        {/* Hero */}
        <section className="mb-0">
          <p className="font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-ink mb-4">
            § MLBUILDER / MY ACCOUNT / SAVED
          </p>

          <h1 className="font-display text-[60px] sm:text-7xl md:text-8xl lg:text-9xl xl:text-[140px] leading-[0.95] tracking-tight mb-4">
            <span className="block">
              <span className="text-ink">YOUR</span>{' '}
              <span className="text-accent">LIBRARY.</span>
            </span>
          </h1>

          <p className="font-script text-ink text-[22px] sm:text-2xl md:text-[26px] leading-snug max-w-xl mb-0">
            Everything you've bookmarked, in one place.
          </p>

          <div className="h-[2px] bg-ink mt-12" />
        </section>

        {/* Sub-nav */}
        <AccountSubNav />

        {/* Saved items content */}
        <SavedContent />
      </div>
    </AuthGuard>
  );
}
