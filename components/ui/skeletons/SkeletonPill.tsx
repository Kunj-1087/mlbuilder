/**
 * SkeletonPill — pill button skeleton.
 *
 * Renders a full-pill-radius shimmer block matching pill button dimensions.
 */
import Skeleton from './Skeleton';

interface SkeletonPillProps {
  width?: string;
  height?: string;
  className?: string;
}

export default function SkeletonPill({
  width = '120px',
  height = '40px',
  className = '',
}: SkeletonPillProps) {
  return (
    <Skeleton
      width={width}
      height={height}
      shape="pill"
      className={className}
    />
  );
}
