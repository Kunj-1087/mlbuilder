/**
 * SavedSkeleton — loading skeleton for the /account/saved page.
 *
 * Matches: hero with stats + sub-nav + filter pills + search/sort row + card grid.
 */
import SkeletonHero from '@/components/ui/skeletons/SkeletonHero';
import Skeleton from '@/components/ui/skeletons/Skeleton';
import SkeletonCard from '@/components/ui/skeletons/SkeletonCard';
import SkeletonPill from '@/components/ui/skeletons/SkeletonPill';

export default function SavedSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Hero with stat row */}
      <SkeletonHero />

      {/* Sub-nav */}
      <div className="flex gap-2 mb-8">
        <SkeletonPill width="120px" height="40px" />
        <SkeletonPill width="140px" height="40px" />
      </div>

      {/* Stat row (inline) */}
      <div className="flex flex-wrap gap-x-12 gap-y-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton width="80px" height="52px" />
            <Skeleton width="90px" height="14px" className="mt-1" />
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-[2px] bg-ink mb-6" />

      {/* Filter pills */}
      <div className="flex gap-2 mb-4">
        {[60, 50, 90, 70, 50, 75].map((w, i) => (
          <SkeletonPill key={i} width={`${w}px`} height="32px" />
        ))}
      </div>

      {/* Search + sort row */}
      <div className="flex items-center gap-3 mb-8">
        <Skeleton width="480px" height="40px" className="max-w-full" />
        <SkeletonPill width="120px" height="40px" />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} hasCover coverHeight="140px" contentLines={2} />
        ))}
      </div>
    </div>
  );
}
