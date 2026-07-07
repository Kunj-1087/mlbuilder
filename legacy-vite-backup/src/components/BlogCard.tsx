import BookmarkButton from '@/components/bookmarks/BookmarkButton';

interface BlogCardProps {
  coverColor: string;
  coverTextColor: string;
  coverTitle: string;
  coverKeywords?: string;
  coverTag?: string;
  categories: string[];
  title: string;
  excerpt: string;
  footerTag: string;
  slug: string;
  onTagClick?: (tag: string) => void;
}

export default function BlogCard({
  coverColor,
  coverTextColor,
  coverTitle,
  coverKeywords,
  coverTag,
  categories,
  title,
  excerpt,
  footerTag,
  slug,
  onTagClick,
}: BlogCardProps) {
  return (
    <div
      className="
        border-2 border-ink rounded-sharp shadow-hard
        transition-all duration-150
        hover:shadow-hard-lg hover:-translate-y-[2px]
        overflow-hidden
      "
    >
      {/* ── Cover area ── */}
      <div className={`${coverColor} ${coverTextColor} relative`} style={{ minHeight: '240px' }}>
        {/* Bookmark button */}
        <BookmarkButton
          item={{
            itemType: 'blog',
            itemId: slug,
            itemTitle: title,
            itemExcerpt: excerpt,
            itemUrl: `/blog`,
            itemCoverColor: coverColor,
            itemCoverEmoji: null,
            itemCategory: footerTag,
          }}
          variant="card-corner"
        />
        <div className="flex flex-col items-center justify-center p-6 text-center" style={{ minHeight: '240px' }}>
          {/* Cover title */}
          <h3 className="font-display text-[28px] leading-tight mb-3">
            {coverTitle}
          </h3>

          {/* Keywords strip */}
          {coverKeywords && (
            <p className="font-body text-xs opacity-70 tracking-wide">
              {coverKeywords}
            </p>
          )}

          {/* Pill tag */}
          {coverTag && (
            <div className="mt-auto pt-4">
              <span
                className={`
                  inline-block px-3 py-1 rounded-pill
                  border ${coverTextColor === 'text-ink' ? 'border-ink' : 'border-cream/40'}
                  ${coverTextColor === 'text-ink' ? 'bg-ink/10' : 'bg-cream/10'}
                  font-body text-[12px] font-semibold tracking-wide
                `}
              >
                {coverTag}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="bg-cream p-6">
        {/* Category tags */}
        <p className="font-body text-[12px] font-semibold tracking-[0.08em] uppercase text-ink mb-3">
          {categories.join(' • ')}
        </p>

        {/* Post title */}
        <h4 className="font-display text-[22px] text-ink leading-[1.1] mb-2 line-clamp-2">
          {title}
        </h4>

        {/* Excerpt */}
        <p className="font-script text-muted text-base leading-relaxed line-clamp-3">
          {excerpt}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between mt-4">
          {/* Pill category tag — wired as filter button */}
          <button
            onClick={() => onTagClick?.(footerTag)}
            className="px-3 py-1 rounded-pill border-2 border-ink bg-cream font-body text-[12px] font-semibold text-ink hover:bg-accent hover:text-ink transition-colors cursor-pointer"
          >
            {footerTag}
          </button>

          {/* Read link */}
          <span className="font-body text-[14px] font-semibold text-accent hover:text-ink transition-colors cursor-pointer">
            Read →
          </span>
        </div>
      </div>
    </div>
  );
}
