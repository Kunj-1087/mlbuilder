/**
 * LeadMagnetCoverArt — typographic "book cover" component.
 *
 * Used in:
 *  1. Catalogue grid cards (smaller, ~240px tall)
 *  2. Landing page right column (larger, ~480px tall)
 */

import { getCoverTextColor } from '@/lib/lead-magnet';

const COVER_BG: Record<string, string> = {
  navy: 'bg-cover-navy',
  black: 'bg-cover-black',
  teal: 'bg-cover-teal',
  beige: 'bg-cover-beige',
  maroon: 'bg-cover-maroon',
  olive: 'bg-cover-olive',
};

interface LeadMagnetCoverArtProps {
  title: string;
  coverColor: string;
  coverEmoji?: string | null;
  pageCount?: number | null;
  /** Size variant — 'card' for catalogue, 'detail' for landing page */
  variant?: 'card' | 'detail';
  /** Extra classes for rotation, shadow, etc. */
  className?: string;
}

export default function LeadMagnetCoverArt({
  title,
  coverColor,
  coverEmoji,
  pageCount,
  variant = 'card',
  className = '',
}: LeadMagnetCoverArtProps) {
  const bg = COVER_BG[coverColor] || 'bg-cover-navy';
  const textColor = getCoverTextColor(coverColor);

  const isDetail = variant === 'detail';

  return (
    <div
      className={`
        ${bg} ${textColor}
        border-2 border-ink rounded-sharp
        relative overflow-hidden
        ${className}
      `}
      style={{ minHeight: isDetail ? '480px' : '240px' }}
    >
      <div
        className="flex flex-col items-center justify-center p-6 text-center"
        style={{ minHeight: isDetail ? '480px' : '240px' }}
      >
        {/* Emoji */}
        {coverEmoji && (
          <span className={`${isDetail ? 'text-[80px]' : 'text-[64px]'} leading-none mb-3`}>
            {coverEmoji}
          </span>
        )}

        {/* Title */}
        <h3
          className={`font-display leading-tight mb-3 ${
            isDetail ? 'text-[36px]' : 'text-[28px]'
          }`}
        >
          {title}
        </h3>

        {/* Page count pill */}
        {pageCount != null && (
          <div className="mt-auto pt-4">
            <span
              className={`
                inline-block px-3 py-1 rounded-pill
                border ${textColor === 'text-ink' ? 'border-ink' : 'border-cream/40'}
                ${textColor === 'text-ink' ? 'bg-ink/10' : 'bg-cream/10'}
                font-body text-[12px] font-semibold tracking-wide
              `}
            >
              FREE PDF · {pageCount} {pageCount === 1 ? 'PAGE' : 'PAGES'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
