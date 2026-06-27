/**
 * AboutSkeleton — loading skeleton for the about page.
 *
 * Matches: hero + founder photo + story + stats + pillar cards + ticker + connect + CTA.
 */
import SkeletonHero from '@/components/ui/skeletons/SkeletonHero';
import Skeleton from '@/components/ui/skeletons/Skeleton';
import SkeletonText from '@/components/ui/skeletons/SkeletonText';
import SkeletonCard from '@/components/ui/skeletons/SkeletonCard';
import SkeletonPill from '@/components/ui/skeletons/SkeletonPill';

export default function AboutSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Hero */}
      <SkeletonHero showStats={false} />

      {/* Founder section — 2-column */}
      <section className="mt-12 flex flex-col lg:flex-row gap-10 lg:gap-14">
        {/* Left — Photo */}
        <div className="flex-shrink-0">
          <Skeleton width="400px" height="400px" className="max-w-full" />
          <Skeleton width="200px" height="14px" className="mt-3" />
        </div>

        {/* Right — Story */}
        <div className="max-w-2xl flex-1">
          <Skeleton width="140px" height="12px" className="mb-5" />
          <SkeletonText lines={5} lastLineWidth="70%" lineHeight="16px" gap="16px" className="mb-5" />
          <SkeletonText lines={4} lastLineWidth="60%" lineHeight="16px" gap="16px" className="mb-5" />
          <SkeletonText lines={5} lastLineWidth="55%" lineHeight="16px" gap="16px" />
        </div>
      </section>

      {/* Stats */}
      <section className="mt-24">
        <Skeleton width="180px" height="12px" className="mb-6" />
        <div className="flex flex-wrap gap-x-12 gap-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <Skeleton width="80px" height="52px" />
              <Skeleton width="100px" height="14px" className="mt-1" />
            </div>
          ))}
        </div>
      </section>

      {/* Why MLBuilder — heading + paragraphs + pillar cards */}
      <section className="mt-24">
        <Skeleton width="260px" height="12px" className="mb-3" />
        <Skeleton width="400px" height="40px" className="mb-5" />
        <SkeletonText lines={4} lastLineWidth="65%" lineHeight="16px" gap="16px" className="max-w-2xl mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} hasCover={false} contentLines={2} />
          ))}
        </div>
      </section>

      {/* Tech stack ticker */}
      <section className="mt-24">
        <Skeleton width="160px" height="12px" className="mb-2" />
        <Skeleton width="240px" height="20px" className="mb-6" />
        <Skeleton width="100%" height="50px" />
      </section>

      {/* Connect */}
      <section className="mt-24">
        <Skeleton width="140px" height="12px" className="mb-3" />
        <Skeleton width="200px" height="36px" className="mb-2" />
        <Skeleton width="240px" height="20px" className="mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[720px]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 border-2 border-ink rounded-sharp bg-cream shadow-hard p-5">
              <Skeleton shape="circle" width="32px" height="32px" />
              <div className="flex-1 space-y-1">
                <Skeleton width="120px" height="18px" />
                <Skeleton width="140px" height="14px" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mt-24 pb-8">
        <div className="border-2 border-ink rounded-sharp bg-cream shadow-hard p-12 md:p-16 text-center">
          <Skeleton width="350px" height="48px" className="mx-auto mb-3" />
          <Skeleton width="280px" height="22px" className="mx-auto mb-8" />
          <div className="flex justify-center gap-4">
            <SkeletonPill width="160px" height="48px" />
            <SkeletonPill width="200px" height="48px" />
          </div>
        </div>
      </section>
    </div>
  );
}
