/**
 * Password Reset Email
 *
 * Sent when a user requests a password reset.
 * Contains a secure reset link (expires in 1 hour).
 * Transactional only — no marketing, no unsubscribe.
 */
import { EmailLayout } from './components/EmailLayout';
import { EmailHeading } from './components/EmailHeading';
import { EmailText } from './components/EmailText';
import { EmailButton } from './components/EmailButton';
import { EmailCard } from './components/EmailCard';
import { EmailScriptLine } from './components/EmailScriptLine';
import { siteUrl } from '@/lib/email/send';
import type { PasswordResetProps } from '@/lib/email/types';

export function PasswordResetEmail({ resetToken, email, siteUrl: _baseUrl }: PasswordResetProps) {
  const resetUrl = siteUrl(`/reset-password?token=${resetToken}`);

  return (
    <EmailLayout preheader="Click within 1 hour to set a new password." footerContext="Sent because a password reset was requested for this email at mlbuilder.in.">
      <EmailHeading level={1}>RESET YOUR PASSWORD.</EmailHeading>

      <EmailText>
        Someone (probably you) requested a password reset for the MLBuilder
        account at <strong>{email}</strong>. Click below to set a new one —
        the link expires in 1 hour.
      </EmailText>

      <EmailButton href={resetUrl}>Set New Password →</EmailButton>

      <EmailText variant="subtext">
        If the button doesn't work, copy this link: {resetUrl}
      </EmailText>

      <EmailCard variant="muted">
        Didn't request this? You can safely ignore this email — no changes have
        been made to your account. If you keep getting these and didn't request
        them, email me at hello@mlbuilder.in.
      </EmailCard>

      <EmailScriptLine>— Kunj</EmailScriptLine>
    </EmailLayout>
  );
}
