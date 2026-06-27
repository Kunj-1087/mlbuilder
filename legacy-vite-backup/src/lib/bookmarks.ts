/**
 * Client-side bookmark management service.
 *
 * Simulates a full backend (Prisma + API routes) using localStorage
 * so the demo flow works without a server. In production, replace
 * with real API calls:
 *
 *   GET    /api/bookmarks          — list user's bookmarks
 *   POST   /api/bookmarks          — save an item
 *   DELETE /api/bookmarks/:id      — remove a bookmark
 *   PATCH  /api/bookmarks/:id      — update note
 *   POST   /api/bookmarks/check    — bulk check saved status
 */

export type BookmarkItemType = 'blog' | 'automation' | 'research' | 'tools' | 'lead-magnet' | 'page';

export interface Bookmark {
  id: string;
  userId: string;
  itemType: BookmarkItemType;
  itemId: string;
  itemTitle: string;
  itemExcerpt: string;
  itemUrl: string;
  itemCoverColor: string | null;
  itemCoverEmoji: string | null;
  itemCategory: string | null;
  note: string | null;
  createdAt: string;
}

export interface BookmarkCreateInput {
  itemType: BookmarkItemType;
  itemId: string;
  itemTitle: string;
  itemExcerpt: string;
  itemUrl: string;
  itemCoverColor?: string | null;
  itemCoverEmoji?: string | null;
  itemCategory?: string | null;
}

// ── Storage ──

const BOOKMARKS_KEY = 'mlbuilder_bookmarks';

function getAllBookmarks(): Bookmark[] {
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveAllBookmarks(bookmarks: Bookmark[]) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

// ── Public API ──

/** Get all bookmarks for a user, sorted by createdAt desc */
export function getUserBookmarks(
  userId: string,
  filters?: { type?: BookmarkItemType; search?: string },
): Bookmark[] {
  let bookmarks = getAllBookmarks().filter((b) => b.userId === userId);

  // Sort by createdAt desc (newest first)
  bookmarks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (filters?.type) {
    bookmarks = bookmarks.filter((b) => b.itemType === filters.type);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    bookmarks = bookmarks.filter(
      (b) =>
        b.itemTitle.toLowerCase().includes(q) ||
        b.itemExcerpt.toLowerCase().includes(q) ||
        (b.note && b.note.toLowerCase().includes(q)),
    );
  }

  return bookmarks;
}

/** Save a bookmark (idempotent — returns existing if already saved) */
export function saveBookmark(userId: string, input: BookmarkCreateInput): { bookmark: Bookmark; wasAlreadySaved: boolean } {
  const bookmarks = getAllBookmarks();
  const existing = bookmarks.find(
    (b) => b.userId === userId && b.itemType === input.itemType && b.itemId === input.itemId,
  );

  if (existing) {
    return { bookmark: existing, wasAlreadySaved: true };
  }

  const bookmark: Bookmark = {
    id: crypto.randomUUID(),
    userId,
    itemType: input.itemType,
    itemId: input.itemId,
    itemTitle: input.itemTitle,
    itemExcerpt: input.itemExcerpt,
    itemUrl: input.itemUrl,
    itemCoverColor: input.itemCoverColor ?? null,
    itemCoverEmoji: input.itemCoverEmoji ?? null,
    itemCategory: input.itemCategory ?? null,
    note: null,
    createdAt: new Date().toISOString(),
  };

  bookmarks.push(bookmark);
  saveAllBookmarks(bookmarks);
  return { bookmark, wasAlreadySaved: false };
}

/** Remove a bookmark by id */
export function removeBookmark(userId: string, bookmarkId: string): boolean {
  const bookmarks = getAllBookmarks();
  const idx = bookmarks.findIndex((b) => b.id === bookmarkId && b.userId === userId);
  if (idx === -1) return false;

  bookmarks.splice(idx, 1);
  saveAllBookmarks(bookmarks);
  return true;
}

/** Update a bookmark's note */
export function updateBookmarkNote(userId: string, bookmarkId: string, note: string | null): Bookmark | null {
  const bookmarks = getAllBookmarks();
  const bookmark = bookmarks.find((b) => b.id === bookmarkId && b.userId === userId);
  if (!bookmark) return null;

  bookmark.note = note;
  saveAllBookmarks(bookmarks);
  return bookmark;
}

/** Bulk check which items are saved — returns a map of "itemType:itemId" → { isSaved, bookmarkId } */
export function checkBulkBookmarks(
  userId: string,
  items: Array<{ itemType: BookmarkItemType; itemId: string }>,
): Map<string, { isSaved: boolean; bookmarkId: string | null }> {
  const bookmarks = getAllBookmarks().filter((b) => b.userId === userId);
  const result = new Map<string, { isSaved: boolean; bookmarkId: string | null }>();

  for (const item of items) {
    const key = `${item.itemType}:${item.itemId}`;
    const found = bookmarks.find((b) => b.itemType === item.itemType && b.itemId === item.itemId);
    result.set(key, {
      isSaved: !!found,
      bookmarkId: found?.id ?? null,
    });
  }

  return result;
}

/** Get bookmark count for a user */
export function getBookmarkCount(userId: string): number {
  return getAllBookmarks().filter((b) => b.userId === userId).length;
}

/** Get bookmark count by type */
export function getBookmarkCountByType(userId: string): Record<BookmarkItemType, number> {
  const bookmarks = getAllBookmarks().filter((b) => b.userId === userId);
  const counts: Record<BookmarkItemType, number> = {
    blog: 0,
    automation: 0,
    research: 0,
    tools: 0,
    'lead-magnet': 0,
    page: 0,
  };
  for (const b of bookmarks) {
    counts[b.itemType]++;
  }
  return counts;
}

/** Get count of bookmarks created this week */
export function getRecentBookmarkCount(userId: string): number {
  const oneWeekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
  return getAllBookmarks().filter((b) => b.userId === userId && b.createdAt > oneWeekAgo).length;
}

/** Get count of distinct categories */
export function getDistinctCategoryCount(userId: string): number {
  const bookmarks = getAllBookmarks().filter((b) => b.userId === userId);
  const categories = new Set(bookmarks.map((b) => b.itemCategory).filter(Boolean));
  return categories.size;
}
