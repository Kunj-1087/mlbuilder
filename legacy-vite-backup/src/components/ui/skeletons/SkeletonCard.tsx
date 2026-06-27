/**
 * SkeletonCard — full bordered card skeleton matching content cards.
 *
 * Visual: bordered card with thin ink-black border, sharp 4px corners,
 * hard offset shadow, cream fill — same as real content cards.
 */
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';

interface SkeletonCardProps {
  hasCover?: boolean;
  coverHeight?: string;
  contentLines?: number;
  className?: string;
}

export default function SkeletonCard({
  hasCover = false,
  coverHeight = '240px',
  contentLines = 3,
  className = '',
}: SkeletonCardProps) {
  return (
    <div
      className={`border-2 border-ink rounded-sharp bg-cream shadow-hard overflow-hidden ${className}`}
    >
      {/* Cover area */}
      {hasCover && (
        <Skeleton
          width="100%"
          height={coverHeight}
          className="rounded-none"
        />
      )}

      {/* Content area */}
      <div className="p-6 space-y-3">
        {/* Tag pill */}
        <Skeleton width="80px" height="12px" shape="pill" />

        {/* Title (2 lines, display-font sized) */}
        <div className="space-y-2">
          <Skeleton width="90%" height="20px" />
          <Skeleton width="65%" height="20px" />
        </div>

        {/* Body text lines */}
        <SkeletonText
          lines={contentLines}
          lastLineWidth="55%"
          lineHeight="12px"
          gap="6px"
        />

        {/* Footer row */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton width="70px" height="28px" shape="pill" />
          <Skeleton width="50px" height="14px" />
        </div>
      </div>
    </div>
  );
}
