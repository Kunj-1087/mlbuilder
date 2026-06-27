/**
 * Skeleton — base primitive for all loading skeletons.
 *
 * Renders a cream-muted block with optional shimmer animation.
 * Respects prefers-reduced-motion via CSS.
 */

type Shape = 'rect' | 'pill' | 'circle';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  shape?: Shape;
  className?: string;
}

const shapeClasses: Record<Shape, string> = {
  rect: 'rounded-[4px]',
  pill: 'rounded-full',
  circle: 'rounded-full',
};

export default function Skeleton({
  width,
  height,
  shape = 'rect',
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={`bg-cream-muted skeleton-shimmer ${shapeClasses[shape]} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      aria-hidden="true"
    />
  );
}
