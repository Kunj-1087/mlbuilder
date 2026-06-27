/**
 * Newsletter Confirmation Email
 *
 * Sent when a visitor subscribes to the newsletter (double opt-in).
 * Requires them to click a confirmation link.
 */
import { EmailLayout } from './components/EmailLayout';
import { EmailHeading } from './components/EmailHeading';
import { EmailText } from './components/EmailText';
import { EmailButton } from './components/EmailButton';
import { EmailScriptLine } from './components/EmailScriptLine';
import { siteUrl } from '@/lib/email/send';
import type { NewsletterConfirmationProps } from '@/lib/email/types';

export function ConfirmationEmail({ confirmationToken, siteUrl: _baseUrl }: NewsletterConfirmationProps) {
  const confirmUrl = siteUrl(`/newsletter/confirmed?token=${confirmationToken}`);

  return (
    <EmailLayout preheader="One click and you're in." footerContext="You're getting this because you signed up at mlbuilder.in. Didn't sign up? Just ignore this email.">
      <EmailHeading level={1}>ONE MORE STEP.</EmailHeading>

      <EmailText>
        You signed up for the MLBuilder newsletter — almost there. Click the button
        below to confirm your email and start getting build logs, research notes,
        and tool drops every week.
      </EmailText>

      <EmailButton href={confirmUrl}>Confirm Subscription →</EmailButton>

      <EmailText variant="subtext">
        If the button doesn't work, copy this link: {confirmUrl}
      </EmailText>

      <EmailScriptLine>— Kunj, building MLBuilder solo</EmailScriptLine>
    </EmailLayout>
  );
}
