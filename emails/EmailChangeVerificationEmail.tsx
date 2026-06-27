/**
 * Email Change Verification Email
 *
 * Sent to the NEW email address when a user requests an email change.
 * Requires confirmation before the change takes effect.
 * Transactional only — no marketing, no unsubscribe.
 */
import { EmailLayout } from './components/EmailLayout';
import { EmailHeading } from './components/EmailHeading';
import { EmailText } from './components/EmailText';
import { EmailButton } from './components/EmailButton';
import { EmailCard } from './components/EmailCard';
import { EmailScriptLine } from './components/EmailScriptLine';
import { siteUrl } from '@/lib/email/send';
import type { EmailChangeVerificationProps } from '@/lib/email/types';

export function EmailChangeVerificationEmail({
  verificationToken,
  newEmail: _newEmail,
  siteUrl: _baseUrl,
}: EmailChangeVerificationProps) {
  const verifyUrl = siteUrl(`/api/account/verify-email-change?token=${verificationToken}`);

  return (
    <EmailLayout preheader="Confirm this is really you." footerContext="Sent to confirm an email address change for your MLBuilder account.">
      <EmailHeading level={1}>VERIFY YOUR NEW EMAIL.</EmailHeading>

      <EmailText>
        You requested to change your MLBuilder email to this address. Click
        below to confirm — the link expires in 24 hours. Until you confirm,
        your old email is still active.
      </EmailText>

      <EmailButton href={verifyUrl}>Confirm Email Change →</EmailButton>

      <EmailText variant="subtext">
        If the button doesn't work, copy this link: {verifyUrl}
      </EmailText>

      <EmailCard variant="muted">
        Didn't request this? Sign in and review your account immediately. Email
        me at hello@mlbuilder.in if you think your account is compromised.
      </EmailCard>

      <EmailScriptLine>— Kunj</EmailScriptLine>
    </EmailLayout>
  );
}
