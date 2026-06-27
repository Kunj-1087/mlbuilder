/**
 * EmailScriptLine — italic accent line for MLBuilder emails.
 *
 * Substitute for Caveat (not web-safe in email).
 * True script font (Caveat) isn't web-safe in email. Italic is the
 * most universally-rendered closest match.
 */
import { Text } from '@react-email/components';

interface EmailScriptLineProps {
  children: React.ReactNode;
}

export function EmailScriptLine({ children }: EmailScriptLineProps) {
  return (
    <Text
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontSize: '18px',
        fontStyle: 'italic',
        color: '#111111',
        margin: '0 0 32px 0',
        lineHeight: '1.4',
      }}
    >
      {children}
    </Text>
  );
}
