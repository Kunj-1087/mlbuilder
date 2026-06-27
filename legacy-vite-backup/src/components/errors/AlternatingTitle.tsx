/**
 * AlternatingTitle — renders a display-font headline with alternating
 * word colors (ink-black and orange #FF6A1A).
 *
 * Used by error pages and hero sections across the site.
 */
interface ColorSegment {
  text: string;
  color: 'black' | 'orange';
}

interface AlternatingTitleProps {
  segments: ColorSegment[];
  className?: string;
  tag?: 'h1' | 'h2' | 'h3';
}

export default function AlternatingTitle({
  segments,
  className = '',
  tag: Tag = 'h1',
}: AlternatingTitleProps) {
  return (
    <Tag className={className}>
      {segments.map((segment, i) => (
        <span
          key={i}
          className={segment.color === 'orange' ? 'text-accent' : 'text-ink'}
        >
          {segment.text}{i < segments.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
