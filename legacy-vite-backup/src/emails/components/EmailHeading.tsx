/**
 * EmailHeading — display-font heading for MLBuilder emails.
 *
 * Font stack approximates Archivo Black using web-safe fonts.
 * Level 1 + 2 are uppercase; level 3 stays mixed case.
 */
import { Heading } from '@react-email/components';

interface EmailHeadingProps {
  level?: 1 | 2 | 3;
  children: React.ReactNode;
}

const SIZES = { 1: '32px', 2: '22px', 3: '16px' };

export function EmailHeading({ level = 1, children }: EmailHeadingProps) {
  const isUppercase = level <= 2;

  return (
    <Heading
      as={`h${level}`}
      style={{
        fontFamily: "'Arial Black', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: SIZES[level],
        lineHeight: '1.1',
        letterSpacing: '-0.02em',
        color: '#111111',
        margin: '0 0 16px 0',
        textTransform: isUppercase ? 'uppercase' : 'none',
        fontWeight: 900,
      }}
    >
      {children}
    </Heading>
  );
}
