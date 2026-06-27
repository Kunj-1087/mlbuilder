/**
 * SkeletonHero — standard hero section skeleton used by most protected pages.
 *
 * Renders: eyebrow, 3-line stacked headline, script subtext,
 * stat row, and divider — matching the real hero layout.
 */
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';

interface SkeletonHeroProps {
  showStats?: boolean;
  statCount?: number;
  showDivider?: boolean;
  className?: string;
}

export default function SkeletonHero({
  showStats = true,
  statCount = 3,
  showDivider = true,
  className = '',
}: SkeletonHeroProps) {
  return (
    <section className={className}>
      {/* Eyebrow */}
      <Skeleton width="200px" height="14px" className="mb-4" />

      {/* Headline — 3 stacked lines of decreasing width */}
      <div className="mb-4 space-y-3">
        <Skeleton width="80%" height="80px" />
        <Skeleton width="90%" height="80px" />
        <Skeleton width="65%" height="80px" />
      </div>

      {/* Script subtext */}
      <SkeletonText
        lines={2}
        lastLineWidth="70%"
        lineHeight="22px"
        gap="10px"
        className="max-w-xl mb-8"
      />

      {/* Stat row */}
      {showStats && (
        <div className="flex flex-wrap gap-x-12 gap-y-4 mb-0">
          {Array.from({ length: statCount }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton width="80px" height="52px" />
              <Skeleton width="100px" height="14px" />
            </div>
          ))}
        </div>
      )}

      {/* Divider */}
      {showDivider && <div className="h-[2px] bg-ink mt-12" />}
    </section>
  );
}
