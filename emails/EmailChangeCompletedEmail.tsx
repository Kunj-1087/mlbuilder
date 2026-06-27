/**
 * Email Change Completed Email
 *
 * Sent to the OLD email address after a successful email change.
 * Notification only — no action required.
 * Transactional only — no marketing, no unsubscribe.
 */
import { EmailLayout } from './components/EmailLayout';
import { EmailHeading } from './components/EmailHeading';
import { EmailText } from './components/EmailText';
import { EmailCard } from './components/EmailCard';
import { EmailScriptLine } from './components/EmailScriptLine';
import type { EmailChangeCompletedProps } from '@/lib/email/types';

export function EmailChangeCompletedEmail({
  maskedNewEmail,
  changeDate,
}: EmailChangeCompletedProps) {
  return (
    <EmailLayout preheader="Heads up — your account email was updated." footerContext="Sent because the email on your MLBuilder account was changed.">
      <EmailHeading level={1}>EMAIL UPDATED.</EmailHeading>

      <EmailText>
        The email address on your MLBuilder account was changed from this
        address to <strong>{maskedNewEmail}</strong> on {changeDate}. If this
        was you, no action needed.
      </EmailText>

      <EmailCard variant="muted">
        Didn't make this change? Your account may be compromised. Reply to
        this email immediately and I'll lock the account while we sort it out.
      </EmailCard>

      <EmailScriptLine>— Kunj</EmailScriptLine>
    </EmailLayout>
  );
}
