/**
 * InlineSpinner — small spinning indicator for inline loading states.
 *
 * Pure CSS animation, respects prefers-reduced-motion
 * (shows pulsing dots instead of spinner).
 */

type SpinnerSize = 'sm' | 'md' | 'lg';
type SpinnerColor = 'ink' | 'orange' | 'muted';

interface InlineSpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
}

const sizeMap: Record<SpinnerSize, number> = { sm: 16, md: 24, lg: 32 };
const colorMap: Record<SpinnerColor, string> = {
  ink: '#111111',
  orange: '#FF6A1A',
  muted: '#6B6B6B',
};

export default function InlineSpinner({
  size = 'md',
  color = 'ink',
  className = '',
}: InlineSpinnerProps) {
  const px = sizeMap[size];
  const dotSize = Math.max(3, Math.round(px / 6));
  const dotColor = colorMap[color];

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      aria-hidden="true"
      style={{ minWidth: px, height: px }}
    >
      {/* Spinning circle — hidden by reduced-motion via CSS */}
      <span
        className="animate-spinner"
        style={{
          width: px,
          height: px,
          borderRadius: '50%',
          border: `2px solid ${dotColor}`,
          borderTopColor: 'transparent',
          flexShrink: 0,
        }}
      />
      {/* Pulsing dots — visible only under reduced-motion via CSS override */}
      <span className="hidden-reduced-motion:flex items-center gap-0.5">
        <span className="dot-pulse-1" style={{ width: dotSize, height: dotSize, borderRadius: '50%', backgroundColor: dotColor }} />
        <span className="dot-pulse-2" style={{ width: dotSize, height: dotSize, borderRadius: '50%', backgroundColor: dotColor }} />
        <span className="dot-pulse-3" style={{ width: dotSize, height: dotSize, borderRadius: '50%', backgroundColor: dotColor }} />
      </span>
    </span>
  );
}
