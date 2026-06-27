/**
 * Signup Welcome Email
 *
 * Sent after a user successfully creates an account.
 * Personalized with their first name and 3 action items.
 */
import { EmailLayout } from './components/EmailLayout';
import { EmailHeading } from './components/EmailHeading';
import { EmailText } from './components/EmailText';
import { EmailCard } from './components/EmailCard';
import { EmailDivider } from './components/EmailDivider';
import { EmailScriptLine } from './components/EmailScriptLine';
import { siteUrl } from '@/lib/email/send';
import type { SignupWelcomeProps } from '@/lib/email/types';

export function SignupWelcomeEmail({ firstName, siteUrl: _baseUrl }: SignupWelcomeProps) {
  return (
    <EmailLayout preheader="You're in. Here's what's worth checking first." footerContext="You're receiving this because you created an MLBuilder account.">
      <EmailHeading level={1}>YOU'RE IN.</EmailHeading>

      <EmailText>
        Hey {firstName} — thanks for signing up. MLBuilder is a small but real
        project I'm building solo while studying. Here's what's worth checking
        first.
      </EmailText>

      <EmailDivider />

      <EmailHeading level={3}>THREE THINGS TO DO.</EmailHeading>

      <EmailCard variant="default">
        <strong>1. Browse the free resources</strong>
        <br />
        <span style={{ fontSize: '14px', color: '#6B6B6B' }}>
          Real build kits and swipe files — totally free.
        </span>
        <br />
        <a href={siteUrl('/free')} style={{ color: '#FF6A1A', fontSize: '14px' }}>
          → See what's there
        </a>
      </EmailCard>

      <EmailCard variant="default">
        <strong>2. Subscribe to the newsletter</strong>
        <br />
        <span style={{ fontSize: '14px', color: '#6B6B6B' }}>
          Weekly build logs, research notes, and tool drops.
        </span>
        <br />
        <a href={siteUrl('/newsletter')} style={{ color: '#FF6A1A', fontSize: '14px' }}>
          → Subscribe in 10 seconds
        </a>
      </EmailCard>

      <EmailCard variant="default">
        <strong>3. Follow on Instagram</strong>
        <br />
        <span style={{ fontSize: '14px', color: '#6B6B6B' }}>
          Daily reels and carousels at @mlbuilder.py.
        </span>
        <br />
        <a href="https://instagram.com/mlbuilder.py" style={{ color: '#FF6A1A', fontSize: '14px' }}>
          → Follow on Instagram
        </a>
      </EmailCard>

      <EmailDivider />

      <EmailText variant="subtext">
        Hit reply to this email any time — I read everything personally.
      </EmailText>

      <EmailScriptLine>— Kunj</EmailScriptLine>
    </EmailLayout>
  );
}
