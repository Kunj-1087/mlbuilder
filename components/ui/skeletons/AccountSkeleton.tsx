/**
 * AccountSkeleton — loading skeleton for the account dashboard page.
 *
 * Matches: hero + sub-nav + profile card + activity card.
 */
import SkeletonHero from '@/components/ui/skeletons/SkeletonHero';
import Skeleton from '@/components/ui/skeletons/Skeleton';
import SkeletonPill from '@/components/ui/skeletons/SkeletonPill';

export default function AccountSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Hero */}
      <SkeletonHero showStats={false} />

      {/* Sub-nav */}
      <div className="flex gap-2 mb-8">
        <SkeletonPill width="120px" height="40px" />
        <SkeletonPill width="140px" height="40px" />
      </div>

      {/* Dashboard grid */}
      <div className="max-w-lg space-y-6">
        {/* Profile card */}
        <div className="border-2 border-ink rounded-sharp bg-surface shadow-hard p-6">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton shape="circle" width="56px" height="56px" />
            <div className="space-y-2">
              <Skeleton width="160px" height="20px" />
              <Skeleton width="180px" height="14px" />
            </div>
          </div>
          <div className="pt-5 border-t-2 border-ink/10">
            <Skeleton width="140px" height="12px" className="mb-3" />
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Skeleton width="90px" height="14px" />
                <Skeleton width="30px" height="20px" />
              </div>
              <Skeleton width="60px" height="14px" />
            </div>
          </div>
          <div className="pt-4 border-t-2 border-ink/10 mt-4">
            <SkeletonPill width="100px" height="36px" />
          </div>
        </div>
      </div>
    </div>
  );
}
