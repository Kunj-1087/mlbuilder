import { DisplayHeading } from '@/components/typography/DisplayHeading';

interface ColorSegment {
  text: string;
  color: 'black' | 'orange' | string;
}

interface AlternatingTitleProps {
  segments: ColorSegment[];
  className?: string;
  tag?: 'h1' | 'h2' | 'h3';
}

export default function AlternatingTitle({
  segments,
  className = '',
  tag = 'h1',
}: AlternatingTitleProps) {
  return (
    <DisplayHeading
      as={tag}
      className={className}
      colorPattern={segments}
    />
  );
}
