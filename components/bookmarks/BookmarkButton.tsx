"use client";

/**
 * BookmarkButton — universal save/unsave toggle for any content item.
 *
 * Variants:
 *  - "icon" — small square icon button (search results, lists)
 *  - "icon-label" — pill button with text label (detail pages)
 *  - "card-corner" — absolute-positioned on card covers
 *
 * Handles sign-in redirect, optimistic UI, toast feedback.
 */
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { saveBookmark, removeBookmark, type BookmarkCreateInput } from '@/lib/bookmarks';
import { track, EVENTS } from '@/lib/analytics/track';
import { toast } from '@/lib/toast';

interface BookmarkButtonProps {
  item: BookmarkCreateInput;
  variant?: 'icon' | 'icon-label' | 'card-corner';
  initialState?: { isSaved: boolean; bookmarkId: string | null };
  onToggle?: (newState: { isSaved: boolean; bookmarkId: string | null }) => void;
}

/** Outline bookmark glyph */
function BookmarkOutline({ className = '' }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

/** Filled bookmark glyph */
function BookmarkFilled({ className = '' }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default function BookmarkButton({
  item,
  variant = 'icon',
  initialState,
  onToggle,
}: BookmarkButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialState?.isSaved ?? false);
  const [bookmarkId, setBookmarkId] = useState<string | null>(initialState?.bookmarkId ?? null);
  const [animating, setAnimating] = useState(false);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Not signed in → redirect to sign-in
    if (!user) {
      toast.info('Sign in to save items');
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(window.location.pathname)}&reason=save`);
      return;
    }

    // Optimistic UI + API call
    if (isSaved && bookmarkId) {
      // Remove
      setIsSaved(false);
      setBookmarkId(null);
      const success = removeBookmark(user.id, bookmarkId);
      if (success) {
        toast.success('Removed from library');
        track(EVENTS.BOOKMARK_REMOVED, { item_type: item.itemType, item_id: item.itemId });
      } else {
        // Revert on error
        setIsSaved(true);
        setBookmarkId(bookmarkId);
        toast.error("Couldn't remove — try again");
      }
      onToggle?.({ isSaved: false, bookmarkId: null });
    } else {
      // Save
      setIsSaved(true);
      setAnimating(true);
      setTimeout(() => setAnimating(false), 200);

      const { bookmark, wasAlreadySaved } = saveBookmark(user.id, item);
      setBookmarkId(bookmark.id);

      if (wasAlreadySaved) {
        // Already saved (idempotent)
        toast.info('Already in your library');
      } else {
        toast.success('Saved to your library');
        track(EVENTS.BOOKMARK_ADDED, { item_type: item.itemType, item_id: item.itemId, source_page: window.location.pathname });
      }
      onToggle?.({ isSaved: true, bookmarkId: bookmark.id });
    }
  }, [user, isSaved, bookmarkId, item, router, onToggle]);

  // ── Variant: icon (default) ──
  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`
          w-8 h-8 flex items-center justify-center rounded-sharp
          transition-all duration-150 cursor-pointer
          ${isSaved
            ? 'text-accent hover:bg-accent/10'
            : 'text-ink hover:bg-cream-muted'
          }
          ${animating ? 'animate-bookmark-pop' : ''}
        `}
        aria-label={isSaved ? 'Remove from saved items' : 'Save this item'}
        aria-pressed={isSaved}
        title={isSaved ? 'Saved — click to remove' : 'Save'}
      >
        {isSaved ? <BookmarkFilled /> : <BookmarkOutline />}
      </button>
    );
  }

  // ── Variant: icon-label ──
  if (variant === 'icon-label') {
    return (
      <button
        onClick={handleClick}
        className={`
          inline-flex items-center gap-2
          px-3 py-2 rounded-pill
          border-2 border-ink
          font-body text-[13px] font-semibold
          shadow-hard-sm
          transition-all duration-150 cursor-pointer
          ${isSaved
            ? 'bg-accent text-ink hover:bg-ink hover:text-cream shadow-hard-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]'
            : 'bg-cream text-ink hover:shadow-[6px_6px_0_#111111] hover:-translate-y-[1px]'
          }
          ${animating ? 'animate-bookmark-pop' : ''}
        `}
        aria-label={isSaved ? 'Remove from saved items' : 'Save this item'}
        aria-pressed={isSaved}
      >
        {isSaved ? <BookmarkFilled className="text-ink" /> : <BookmarkOutline className="text-ink" />}
        {isSaved ? 'Saved ✓' : 'Save'}
      </button>
    );
  }

  // ── Variant: card-corner ──
  return (
    <button
      onClick={handleClick}
      className={`
        absolute top-3 right-3 z-10
        w-8 h-8 flex items-center justify-center rounded-full
        transition-all duration-150 cursor-pointer
        ${isSaved
          ? 'bg-accent/90 text-ink'
          : 'bg-cream/90 text-ink hover:bg-cream-muted'
        }
        ${animating ? 'animate-bookmark-pop' : ''}
      `}
      aria-label={isSaved ? 'Remove from saved items' : 'Save this item'}
      aria-pressed={isSaved}
      title={isSaved ? 'Saved — click to remove' : 'Save'}
    >
      {isSaved ? <BookmarkFilled className="w-4 h-4" /> : <BookmarkOutline className="w-4 h-4" />}
    </button>
  );
}
