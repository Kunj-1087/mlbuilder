/**
 * FreeCatalogueSkeleton — loading skeleton for the /free catalogue page.
 *
 * Matches: hero + 3-column card grid.
 */
import SkeletonHero from '@/components/ui/skeletons/SkeletonHero';
import SkeletonCard from '@/components/ui/skeletons/SkeletonCard';

export default function FreeCatalogueSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Hero */}
      <SkeletonHero />

      {/* Card grid */}
      <section className="mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} hasCover contentLines={2} />
          ))}
        </div>
      </section>
    </div>
  );
}
