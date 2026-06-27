/**
 * LoadingBar — thin indeterminate progress bar.
 *
 * Appears at the top of a content section during inline data fetches.
 * ~3px tall, orange fill with animated indeterminate motion.
 */

interface LoadingBarProps {
  className?: string;
}

export default function LoadingBar({ className = '' }: LoadingBarProps) {
  return (
    <div
      className={`relative w-full h-[3px] bg-cream-muted overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute top-0 left-0 h-full w-[30%] bg-accent"
        style={{
          animation: 'loadingBarPulse 1.2s ease-in-out infinite',
        }}
      />
    </div>
  );
}
