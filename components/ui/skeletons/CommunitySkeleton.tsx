/**
 * CommunitySkeleton — loading skeleton for the community page.
 *
 * Matches: hero + active platforms (2-col) + coming soon (3-col) + final CTA.
 */
import SkeletonHero from '@/components/ui/skeletons/SkeletonHero';
import Skeleton from '@/components/ui/skeletons/Skeleton';
import SkeletonText from '@/components/ui/skeletons/SkeletonText';
import SkeletonPill from '@/components/ui/skeletons/SkeletonPill';

export default function CommunitySkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Hero */}
      <SkeletonHero showStats={false} />

      {/* Active platforms section */}
      <Skeleton width="220px" height="12px" className="mb-2" />
      <Skeleton width="200px" height="20px" className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {[1, 2].map((i) => (
          <div key={i} className="border-2 border-ink rounded-sharp bg-cream shadow-hard p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton shape="circle" width="40px" height="40px" />
              <div className="space-y-1">
                <Skeleton width="120px" height="18px" />
                <Skeleton width="100px" height="12px" />
              </div>
            </div>
            <SkeletonText lines={2} lastLineWidth="80%" lineHeight="12px" />
            <div className="flex gap-4">
              <Skeleton width="80px" height="40px" />
              <Skeleton width="80px" height="40px" />
            </div>
            <SkeletonPill width="180px" height="40px" />
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-[2px] bg-ink mb-10" />

      {/* Coming soon section */}
      <Skeleton width="160px" height="12px" className="mb-2" />
      <Skeleton width="260px" height="20px" className="mb-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-24">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border-2 border-ink rounded-sharp bg-cream shadow-hard p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton shape="circle" width="32px" height="32px" />
              <Skeleton width="100px" height="16px" />
            </div>
            <SkeletonText lines={2} lastLineWidth="70%" lineHeight="11px" />
            <SkeletonPill width="80px" height="32px" />
          </div>
        ))}
      </div>

      {/* Final CTA */}
      <div className="border-2 border-ink rounded-sharp bg-cream shadow-hard p-10 md:p-12 text-center">
        <Skeleton width="300px" height="36px" className="mx-auto mb-3" />
        <SkeletonText lines={2} lastLineWidth="60%" lineHeight="18px" className="max-w-lg mx-auto mb-8" />
        <div className="flex justify-center gap-3">
          <SkeletonPill width="180px" height="44px" />
          <SkeletonPill width="200px" height="44px" />
        </div>
      </div>
    </div>
  );
}
