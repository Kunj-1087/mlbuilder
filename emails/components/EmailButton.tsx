/**
 * EmailButton — the universal CTA button for MLBuilder emails.
 *
 * Primary: solid orange fill, ink-black text
 * Secondary: cream fill, ink-black border
 */
import { Button } from '@react-email/components';

interface EmailButtonProps {
  href: string;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function EmailButton({ href, variant = 'primary', children }: EmailButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <tbody>
        <tr>
          <td style={{ textAlign: 'center', padding: '0 0 24px 0' }}>
            <Button
              href={href}
              style={{
                backgroundColor: isPrimary ? '#FF6A1A' : '#FBF8F0',
                color: '#111111',
                border: '2px solid #111111',
                borderRadius: '9999px',
                padding: '14px 32px',
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: '16px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-block',
                textAlign: 'center',
              }}
            >
              {children}
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
