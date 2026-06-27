/**
 * EmailCard — bordered card container for MLBuilder emails.
 *
 * Used for visual emphasis blocks within emails.
 * - default: cream fill, ink border
 * - highlight: orange fill, ink text
 * - muted: cream-muted fill, ink border
 */
import { Text } from '@react-email/components';

interface EmailCardProps {
  variant?: 'default' | 'highlight' | 'muted';
  children: React.ReactNode;
}

const STYLES: Record<string, React.CSSProperties> = {
  default: {
    backgroundColor: '#FBF8F0',
    border: '2px solid #111111',
    borderRadius: '4px',
    padding: '16px 20px',
    margin: '0 0 16px 0',
  },
  highlight: {
    backgroundColor: '#FF6A1A',
    border: '2px solid #111111',
    borderRadius: '4px',
    padding: '16px 20px',
    margin: '0 0 16px 0',
  },
  muted: {
    backgroundColor: '#EFEAD8',
    border: '1px solid rgba(17,17,17,0.15)',
    borderRadius: '4px',
    padding: '16px 20px',
    margin: '0 0 16px 0',
  },
};

const TEXT_COLORS: Record<string, string> = {
  default: '#111111',
  highlight: '#111111',
  muted: '#6B6B6B',
};

export function EmailCard({ variant = 'default', children }: EmailCardProps) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', margin: '0 0 16px 0' }}>
      <tbody>
        <tr>
          <td style={STYLES[variant]}>
            <Text
              style={{
                fontSize: '14px',
                lineHeight: '1.5',
                color: TEXT_COLORS[variant],
                margin: '0',
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              }}
            >
              {children}
            </Text>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
