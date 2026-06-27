/**
 * Newsletter Welcome Email
 *
 * Sent after a subscriber confirms their email.
 * Introduces them to what they'll receive.
 */
import { EmailLayout } from './components/EmailLayout';
import { EmailHeading } from './components/EmailHeading';
import { EmailText } from './components/EmailText';
import { EmailButton } from './components/EmailButton';
import { EmailCard } from './components/EmailCard';
import { EmailScriptLine } from './components/EmailScriptLine';
import type { NewsletterWelcomeProps } from '@/lib/email/types';

export function WelcomeEmail(_props: NewsletterWelcomeProps) {

  return (
    <EmailLayout preheader="Build logs, research notes, tool drops — every week." footerContext="You're getting this because you confirmed your newsletter subscription.">
      <EmailHeading level={1}>WELCOME TO MLBUILDER.</EmailHeading>

      <EmailText>
        You just confirmed your subscription. Here's what you'll get:
      </EmailText>

      <EmailText>
        <strong style={{ color: '#FF6A1A' }}>Build logs</strong> — step-by-step
        breakdowns of AI automations I actually shipped, not tutorials that stop
        at hello world.
      </EmailText>

      <EmailText>
        <strong style={{ color: '#FF6A1A' }}>Research notes</strong> — key papers
        digested in plain English, with takeaways you can act on right away.
      </EmailText>

      <EmailText>
        <strong style={{ color: '#FF6A1A' }}>Tool drops</strong> — free tools worth
        bookmarking. No paywalls, no "upgrade to unlock."
      </EmailText>

      <EmailText variant="subtext">
        I aim for weekly. Sometimes life happens. But when I send something,
        it'll be worth reading.
      </EmailText>

      <EmailCard variant="highlight">
        <strong>Bonus:</strong> Follow @mlbuilder.py on Instagram for daily build
        notes, reels, and behind-the-scenes.
      </EmailCard>

      <EmailButton href="https://instagram.com/mlbuilder.py">
        Follow on Instagram ↗
      </EmailButton>

      <EmailScriptLine>— Kunj, building MLBuilder solo</EmailScriptLine>
    </EmailLayout>
  );
}
