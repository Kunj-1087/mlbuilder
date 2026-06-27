/**
 * NewsletterSkeleton — loading skeleton for the newsletter page.
 *
 * Matches: hero + 3-column "what's inside" + form card.
 */
import Skeleton from '@/components/ui/skeletons/Skeleton';
import SkeletonText from '@/components/ui/skeletons/SkeletonText';
import SkeletonPill from '@/components/ui/skeletons/SkeletonPill';

export default function NewsletterSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
      <div className="max-w-2xl mx-auto text-center">
        {/* Eyebrow */}
        <Skeleton width="220px" height="12px" className="mx-auto mb-4" />

        {/* Headline */}
        <Skeleton width="80%" height="64px" className="mx-auto mb-4" />

        {/* Script subtext */}
        <SkeletonText
          lines={2}
          lastLineWidth="60%"
          lineHeight="22px"
          gap="10px"
          className="max-w-lg mx-auto mb-10"
        />

        {/* What's inside — 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-2 border-ink rounded-sharp bg-cream p-5 text-left space-y-2">
              <Skeleton width="100px" height="18px" />
              <SkeletonText lines={3} lastLineWidth="60%" lineHeight="11px" gap="5px" />
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="border-2 border-ink rounded-sharp bg-surface shadow-hard p-8 md:p-10 max-w-lg text-center mx-auto space-y-4">
          <Skeleton width="250px" height="28px" className="mx-auto" />
          <Skeleton width="180px" height="18px" className="mx-auto" />
          <Skeleton width="100%" height="48px" />
          <SkeletonPill width="160px" height="44px" className="mx-auto" />
        </div>
      </div>
    </div>
  );
}
