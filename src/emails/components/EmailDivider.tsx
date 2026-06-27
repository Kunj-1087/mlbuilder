/**
 * EmailDivider — thin horizontal separator for MLBuilder emails.
 */
import { Hr } from '@react-email/components';

interface EmailDividerProps {
  spacing?: 'tight' | 'normal' | 'wide';
}

const MARGINS = { tight: '16px 0', normal: '24px 0', wide: '32px 0' };

export function EmailDivider({ spacing = 'normal' }: EmailDividerProps) {
  return (
    <Hr
      style={{
        border: 'none',
        borderTop: '1px solid rgba(17,17,17,0.15)',
        margin: MARGINS[spacing],
      }}
    />
  );
}
