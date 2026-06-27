/**
 * PillarPageSkeleton — shared skeleton for automation/research/tools listing pages.
 *
 * All three pillar pages use the same layout:
 * SkeletonHero + filter pills + divider + 3-column card grid.
 */
import SkeletonHero from './SkeletonHero';
import SkeletonCard from './SkeletonCard';
import SkeletonPill from './SkeletonPill';

export default function PillarPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Hero */}
      <SkeletonHero />

      {/* Filter pill row */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {[100, 90, 80, 70, 95].map((w, i) => (
          <SkeletonPill key={i} width={`${w}px`} height="36px" />
        ))}
      </div>

      {/* Divider */}
      <div className="h-[2px] bg-ink mt-0 mb-8" />

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} hasCover contentLines={3} />
        ))}
      </div>
    </div>
  );
}
