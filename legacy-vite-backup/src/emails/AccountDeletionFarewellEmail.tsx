/**
 * Account Deletion Farewell Email
 *
 * Final email sent immediately after account is deleted.
 * No action required — just a respectful sign-off.
 * Transactional only — no marketing, no unsubscribe.
 */
import { EmailLayout } from './components/EmailLayout';
import { EmailHeading } from './components/EmailHeading';
import { EmailText } from './components/EmailText';
import { EmailCard } from './components/EmailCard';
import { EmailScriptLine } from './components/EmailScriptLine';

export function AccountDeletionFarewellEmail() {
  return (
    <EmailLayout preheader="Thanks for trying it out." footerContext="Sent as a final confirmation of your account deletion.">
      <EmailHeading level={1}>ACCOUNT DELETED.</EmailHeading>

      <EmailText>
        Your MLBuilder account and all associated data have been permanently
        removed. Your newsletter subscription was also cancelled.
      </EmailText>

      <EmailText>
        If you ever want to come back, you can create a fresh account anytime
        at mlbuilder.in.
      </EmailText>

      <EmailCard variant="default">
        If you have a moment — what made you leave? I read every reply and use
        feedback to make MLBuilder better. No pressure though.
      </EmailCard>

      <EmailScriptLine>— Kunj</EmailScriptLine>
    </EmailLayout>
  );
}
