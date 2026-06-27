/**
 * Lead Magnet Delivery Email
 *
 * Sent when a visitor claims a lead magnet.
 * Contains the download link and optional newsletter enrollment.
 */
import { EmailLayout } from './components/EmailLayout';
import { EmailHeading } from './components/EmailHeading';
import { EmailText } from './components/EmailText';
import { EmailButton } from './components/EmailButton';
import { EmailCard } from './components/EmailCard';
import { EmailScriptLine } from './components/EmailScriptLine';
import { siteUrl } from '@/lib/email/send';
import type { LeadMagnetDeliveryProps } from '@/lib/email/types';

export function LeadMagnetDeliveryEmail({
  title,
  downloadToken,
  siteUrl: _baseUrl,
  alreadySubscribed,
}: LeadMagnetDeliveryProps) {
  const downloadUrl = siteUrl(`/api/lead-magnet/download?token=${downloadToken}`);


  return (
    <EmailLayout preheader="Click below to download — link doesn't expire." footerContext="You're getting this because you downloaded a resource at mlbuilder.in.">
      <EmailHeading level={1}>HERE'S YOUR FREE GUIDE.</EmailHeading>

      <EmailText>
        Thanks for grabbing <strong>{title}</strong>. The download link is
        below — it stays active, so save it or download whenever.
      </EmailText>

      <EmailButton href={downloadUrl}>Download PDF →</EmailButton>

      <EmailText variant="subtext">
        Or copy-paste this link: {downloadUrl}
      </EmailText>

      {!alreadySubscribed && (
        <EmailCard variant="muted">
          <strong>Bonus:</strong> I also added you to the MLBuilder newsletter —
          check your inbox for a confirmation link to start receiving build logs,
          research notes and tool drops.
        </EmailCard>
      )}

      <EmailScriptLine>— Kunj</EmailScriptLine>
    </EmailLayout>
  );
}
