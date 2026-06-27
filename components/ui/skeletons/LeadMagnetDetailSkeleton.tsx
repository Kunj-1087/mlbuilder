/**
 * LeadMagnetDetailSkeleton — loading skeleton for /free/[slug] landing page.
 *
 * Matches: 2-column layout — left (hero + form), right (book cover).
 */
import Skeleton from '@/components/ui/skeletons/Skeleton';
import SkeletonText from '@/components/ui/skeletons/SkeletonText';
import SkeletonPill from '@/components/ui/skeletons/SkeletonPill';

export default function LeadMagnetDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Left column */}
        <div className="lg:col-span-7">
          {/* Breadcrumb */}
          <Skeleton width="180px" height="12px" className="mb-4" />

          {/* Title */}
          <Skeleton width="90%" height="64px" className="mb-3" />

          {/* Tagline */}
          <Skeleton width="70%" height="24px" className="mb-5" />

          {/* Bookmark button */}
          <SkeletonPill width="120px" height="40px" className="mb-6" />

          {/* Description */}
          <SkeletonText lines={4} lastLineWidth="75%" lineHeight="16px" gap="12px" className="mb-8" />

          {/* What's inside */}
          <Skeleton width="180px" height="12px" className="mb-3" />
          <div className="space-y-3 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Skeleton width="12px" height="12px" />
                <Skeleton width={`${70 - i * 8}%`} height="16px" />
              </div>
            ))}
          </div>

          {/* Claim form */}
          <div className="border-2 border-ink rounded-sharp bg-cream shadow-hard p-6 md:p-8 space-y-3">
            <Skeleton width="200px" height="24px" />
            <Skeleton width="160px" height="18px" />
            <Skeleton width="100%" height="48px" />
            <Skeleton width="100%" height="44px" shape="pill" />
          </div>
        </div>

        {/* Right column — book cover */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <div className="rotate-[-2deg]">
              <Skeleton
                width="360px"
                height="480px"
                className="w-full max-w-[360px] mx-auto shadow-[12px_12px_0_#111111]"
              />
            </div>
            <Skeleton width="250px" height="14px" className="mx-auto mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
