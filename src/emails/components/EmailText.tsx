/**
 * EmailText — body paragraph for MLBuilder emails.
 *
 * Variants:
 *  - body: standard 16px paragraph
 *  - subtext: 14px muted text for context/legal
 *  - fineprint: 11px footer/legal text
 */
import { Text } from '@react-email/components';

interface EmailTextProps {
  variant?: 'body' | 'subtext' | 'fineprint';
  children: React.ReactNode;
}

const STYLES: Record<string, React.CSSProperties> = {
  body: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#111111',
    margin: '0 0 16px 0',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  subtext: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#6B6B6B',
    margin: '0 0 16px 0',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  fineprint: {
    fontSize: '11px',
    lineHeight: '1.4',
    color: '#6B6B6B',
    margin: '0 0 8px 0',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
};

export function EmailText({ variant = 'body', children }: EmailTextProps) {
  return <Text style={STYLES[variant]}>{children}</Text>;
}
