/**
 * EmailFooter — standardized footer for all MLBuilder emails.
 *
 * Shows brand line, context line, and action links.
 * Optional unsubscribe link for marketing-class emails.
 */
import { Text } from '@react-email/components';

interface EmailFooterProps {
  context: string;
  unsubscribeUrl?: string;
}

export function EmailFooter({ context, unsubscribeUrl }: EmailFooterProps) {
  const year = new Date().getFullYear();

  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        borderTop: '2px solid #111111',
        backgroundColor: '#FBF8F0',
      }}
    >
      <tbody>
        <tr>
          <td style={{ padding: '24px 32px', textAlign: 'center' }}>
            {/* Brand line */}
            <Text style={lineStyle}>
              MLBuilder — built solo by Kunj Nakrani · Gujarat, India
            </Text>

            {/* Context line */}
            <Text style={lineStyle}>{context}</Text>

            {/* Action links */}
            <Text style={lineStyle}>
              <a href="https://mlbuilder.in" style={linkStyle}>Visit mlbuilder.in</a>
              {' · '}
              <a href="https://mlbuilder.in/account" style={linkStyle}>Update preferences</a>
              {unsubscribeUrl && (
                <>
                  {' · '}
                  <a href={unsubscribeUrl} style={linkStyle}>Unsubscribe</a>
                </>
              )}
            </Text>

            {/* Copyright */}
            <Text style={{ ...lineStyle, fontSize: '10px', color: '#999999' }}>
              © {year} MLBuilder. All rights reserved.
            </Text>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

const lineStyle: React.CSSProperties = {
  fontSize: '12px',
  lineHeight: '1.5',
  color: '#6B6B6B',
  margin: '0 0 4px 0',
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

const linkStyle: React.CSSProperties = {
  color: '#FF6A1A',
  textDecoration: 'underline',
};
