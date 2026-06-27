/**
 * Account Deletion Confirmation Email
 *
 * Sent when a user initiates account deletion.
 * Gives them a 24-hour cooling-off window.
 * Transactional only — no marketing, no unsubscribe.
 */
import { EmailLayout } from './components/EmailLayout';
import { EmailHeading } from './components/EmailHeading';
import { EmailText } from './components/EmailText';
import { EmailButton } from './components/EmailButton';
import { EmailCard } from './components/EmailCard';
import { EmailScriptLine } from './components/EmailScriptLine';
import { siteUrl } from '@/lib/email/send';
import type { AccountDeletionConfirmationProps } from '@/lib/email/types';

export function AccountDeletionConfirmationEmail({
  confirmationToken,
  siteUrl: _baseUrl,
}: AccountDeletionConfirmationProps) {
  const confirmUrl = siteUrl(`/api/account/confirm-deletion?token=${confirmationToken}`);

  return (
    <EmailLayout preheader="Final step — confirm within 24 hours." footerContext="Sent because account deletion was requested.">
      <EmailHeading level={1}>ABOUT TO DELETE YOUR ACCOUNT.</EmailHeading>

      <EmailText>
        You requested to delete your MLBuilder account. Click below within
        24 hours to confirm — after that, the request expires and nothing
        happens.
      </EmailText>

      <EmailText>
        Once confirmed, your account and all associated data (saved items,
        newsletter subscription, profile) will be permanently removed. This
        cannot be undone.
      </EmailText>

      <EmailButton href={confirmUrl}>Confirm Account Deletion →</EmailButton>

      <EmailText variant="subtext">
        If the button doesn't work, copy this link: {confirmUrl}
      </EmailText>

      <EmailCard variant="muted">
        Changed your mind? Don't click the link — the request expires
        automatically in 24 hours. Or sign in to your account and cancel
        from the dashboard.
      </EmailCard>

      <EmailScriptLine>— Kunj</EmailScriptLine>
    </EmailLayout>
  );
}
