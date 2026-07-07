import Link from 'next/link';
import BookmarkButton from '@/components/bookmarks/BookmarkButton';
import LeadMagnetCoverArt from './LeadMagnetCoverArt';
import { formatFileSize } from '@/lib/lead-magnet';

interface LeadMagnetCardProps {
  slug: string;
  title: string;
  tagline: string;
  coverColor: string;
  coverEmoji?: string | null;
  fileSizeKb: number;
  pageCount?: number | null;
  downloadCount: number;
}

export default function LeadMagnetCard({
  slug,
  title,
  tagline,
  coverColor,
  coverEmoji,
  fileSizeKb,
  pageCount,
  downloadCount,
}: LeadMagnetCardProps) {
  return (
    <Link
      href={`/free/${slug}`}
      className="
        block border-2 border-ink rounded-sharp
        shadow-hard overflow-hidden
        transition-all duration-150
        hover:shadow-hard-lg hover:-translate-y-[2px]
      "
    >
      {/* ── Cover area ── */}
      <div className="relative">
        <BookmarkButton
          item={{
            itemType: 'lead-magnet',
            itemId: slug,
            itemTitle: title,
            itemExcerpt: tagline,
            itemUrl: `/free/${slug}`,
            itemCoverColor: coverColor,
            itemCoverEmoji: coverEmoji ?? null,
            itemCategory: 'Free Downloads',
          }}
          variant="card-corner"
        />
      <LeadMagnetCoverArt
        title={title}
        coverColor={coverColor}
        coverEmoji={coverEmoji}
        pageCount={pageCount}
        variant="card"
      />
      </div>

      {/* ── Content area ── */}
      <div className="bg-cream p-6">
        {/* Tag */}
        <p className="font-body text-[12px] font-semibold tracking-[0.08em] uppercase text-ink mb-3">
          FREE DOWNLOAD
        </p>

        {/* Title */}
        <h4 className="font-display text-[22px] text-ink leading-[1.1] mb-2 line-clamp-2">
          {title}
        </h4>

        {/* Tagline */}
        <p className="font-script text-muted text-base leading-relaxed line-clamp-2">
          {tagline}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between mt-4">
          <span className="font-body text-[13px] text-muted">
            {formatFileSize(fileSizeKb)} · {downloadCount} downloads
          </span>
          <span className="font-body text-[14px] font-semibold text-accent">
            Get it →
          </span>
        </div>
      </div>
    </Link>
  );
}
