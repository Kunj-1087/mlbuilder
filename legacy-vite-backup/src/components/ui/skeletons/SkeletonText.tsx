/**
 * SkeletonText — multi-line text shimmer skeleton.
 *
 * Renders N skeleton rectangles stacked vertically,
 * where the last one is narrower (mimics natural text wrapping).
 */
import Skeleton from './Skeleton';

interface SkeletonTextProps {
  lines?: number;
  lastLineWidth?: string;
  lineHeight?: string;
  gap?: string;
  className?: string;
}

export default function SkeletonText({
  lines = 3,
  lastLineWidth = '60%',
  lineHeight = '12px',
  gap = '8px',
  className = '',
}: SkeletonTextProps) {
  return (
    <div className={`flex flex-col ${className}`} style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => {
        const isLast = i === lines - 1;
        return (
          <Skeleton
            key={i}
            width={isLast ? lastLineWidth : '100%'}
            height={lineHeight}
          />
        );
      })}
    </div>
  );
}
