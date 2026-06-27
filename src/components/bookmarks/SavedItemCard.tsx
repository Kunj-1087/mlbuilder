/**
 * SavedItemCard — renders a single saved/bookmarked item on the /account/saved page.
 *
 * Features: colored cover, bookmark button, note editor, relative time.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import BookmarkButton from './BookmarkButton';
import { updateBookmarkNote, type Bookmark, type BookmarkCreateInput } from '@/lib/bookmarks';
import { relativeTime } from '@/lib/utils/relativeTime';
import { toast } from '@/lib/toast';

const COVER_BG: Record<string, string> = {
  navy: 'bg-cover-navy',
  black: 'bg-cover-black',
  teal: 'bg-cover-teal',
  beige: 'bg-cover-beige',
  maroon: 'bg-cover-maroon',
  olive: 'bg-cover-olive',
};

interface SavedItemCardProps {
  bookmark: Bookmark;
  onRemove: (bookmarkId: string) => void;
  onNoteUpdate: (bookmarkId: string, note: string | null) => void;
}

export default function SavedItemCard({ bookmark, onRemove, onNoteUpdate }: SavedItemCardProps) {
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(bookmark.note || '');

  const bgClass = bookmark.itemCoverColor
    ? (COVER_BG[bookmark.itemCoverColor.replace('bg-cover-', '')] || 'bg-cover-navy')
    : 'bg-accent';

  const textColor = bookmark.itemCoverColor === 'beige' ? 'text-ink' : 'text-cream';

  const itemInput: BookmarkCreateInput = {
    itemType: bookmark.itemType,
    itemId: bookmark.itemId,
    itemTitle: bookmark.itemTitle,
    itemExcerpt: bookmark.itemExcerpt,
    itemUrl: bookmark.itemUrl,
    itemCoverColor: bookmark.itemCoverColor,
    itemCoverEmoji: bookmark.itemCoverEmoji,
    itemCategory: bookmark.itemCategory,
  };

  const handleSaveNote = () => {
    const trimmed = noteText.trim();
    const newNote = trimmed.length > 0 ? trimmed.slice(0, 500) : null;
    updateBookmarkNote('', bookmark.id, newNote);
    onNoteUpdate(bookmark.id, newNote);
    setEditingNote(false);
    toast.success(newNote ? 'Note saved' : 'Note removed');
  };

  const handleRemove = () => {
    onRemove(bookmark.id);
  };

  return (
    <div className="border-2 border-ink rounded-sharp bg-cream shadow-hard transition-all duration-150 hover:shadow-hard-lg hover:-translate-y-[2px] overflow-hidden">
      {/* ── Cover area ── */}
      <div className={`${bgClass} ${textColor} relative`} style={{ minHeight: '140px' }}>
        <div className="flex flex-col items-center justify-center p-4 text-center" style={{ minHeight: '140px' }}>
          {bookmark.itemCoverEmoji ? (
            <span className="text-4xl mb-2">{bookmark.itemCoverEmoji}</span>
          ) : (
            <span className="font-display text-3xl opacity-60">{bookmark.itemTitle.charAt(0)}</span>
          )}
          {bookmark.itemCategory && (
            <span className="mt-auto pt-2 px-2 py-0.5 rounded-pill border border-current/30 bg-current/10 font-body text-[11px] font-semibold tracking-wide uppercase">
              {bookmark.itemCategory}
            </span>
          )}
        </div>

        {/* Bookmark button */}
        <BookmarkButton
          item={itemInput}
          variant="card-corner"
          initialState={{ isSaved: true, bookmarkId: bookmark.id }}
          onToggle={(state) => {
            if (!state.isSaved) handleRemove();
          }}
        />
      </div>

      {/* ── Content area ── */}
      <div className="p-5">
        {/* Type tag */}
        <p className="font-body text-[11px] font-semibold tracking-[0.08em] uppercase text-muted mb-2">
          {bookmark.itemType.replace('-', ' ')}
        </p>

        {/* Title */}
        <Link to={bookmark.itemUrl} className="block group">
          <h4 className="font-display text-[18px] text-ink leading-[1.15] mb-1.5 line-clamp-2 group-hover:text-accent transition-colors">
            {bookmark.itemTitle}
          </h4>
        </Link>

        {/* Excerpt */}
        <p className="font-body text-muted text-[13px] leading-relaxed line-clamp-2 mb-3">
          {bookmark.itemExcerpt}
        </p>

        {/* Note section */}
        {editingNote ? (
          <div className="mb-3">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value.slice(0, 500))}
              className="w-full px-3 py-2 bg-cream border-2 border-ink rounded-sharp font-body text-[12px] text-ink resize-none focus:outline-none focus:border-accent transition-colors"
              rows={3}
              placeholder="Add a note..."
            />
            <div className="flex items-center justify-between mt-1.5">
              <span className="font-body text-[10px] text-muted">{noteText.length}/500</span>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingNote(false); setNoteText(bookmark.note || ''); }}
                  className="px-2 py-0.5 rounded-pill border-2 border-ink bg-cream font-body text-[11px] font-semibold text-ink cursor-pointer hover:bg-surface transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  className="px-2 py-0.5 rounded-pill border-2 border-ink bg-accent font-body text-[11px] font-semibold text-ink cursor-pointer hover:bg-ink hover:text-cream transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : bookmark.note ? (
          <div
            className="mb-3 px-3 py-2 bg-cream-muted border border-ink/20 rounded-sharp font-body text-[12px] text-ink italic cursor-pointer hover:border-ink/40 transition-colors"
            onClick={() => setEditingNote(true)}
          >
            {bookmark.note}
          </div>
        ) : (
          <button
            onClick={() => setEditingNote(true)}
            className="mb-3 font-body text-[12px] text-accent hover:text-ink transition-colors cursor-pointer"
          >
            + Add note
          </button>
        )}

        {/* Footer */}
        <p className="font-body text-[11px] text-muted">
          Saved {relativeTime(bookmark.createdAt)}
        </p>
      </div>
    </div>
  );
}
