/**
 * SkeletonLoader — minimal loading indicator with dot-pulse animation.
 *
 * Used as a fallback for Suspense boundaries and route transitions.
 */
export default function SkeletonLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="flex items-center gap-1.5 mb-3">
        <span className="w-2 h-2 rounded-full bg-ink dot-pulse-1" />
        <span className="w-2 h-2 rounded-full bg-ink dot-pulse-2" />
        <span className="w-2 h-2 rounded-full bg-ink dot-pulse-3" />
      </div>
      <p className="font-body text-muted text-sm">Loading...</p>
    </div>
  );
}
