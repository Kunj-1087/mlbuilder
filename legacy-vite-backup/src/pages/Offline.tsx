/**
 * OfflinePage — branded offline page for MLBuilder.
 *
 * Placeholder for future PWA support. Also used when client-side
 * network requests fail.
 */
import { useEffect } from 'react';
import SeoHead from '@/components/seo/SeoHead';
import ErrorPageLayout from '@/components/errors/ErrorPageLayout';
import { track, EVENTS } from '@/lib/analytics/track';

export default function OfflinePage() {
  useEffect(() => {
    track(EVENTS.ERROR_PAGE_VIEWED, { error_code: 'OFFLINE', path: window.location.pathname });
  }, []);

  return (
    <>
      <SeoHead
        title="You're Offline"
        description="Check your internet connection and try again."
        path="/offline"
        noindex
      />

      <ErrorPageLayout
        errorCode="OFFLINE"
        titleSegments={[
          { text: 'NO', color: 'black' },
          { text: 'INTERNET.', color: 'orange' },
        ]}
        script="Looks like you're offline. Or my server is."
        description="Check your connection. If your connection is fine, the issue is on my end — give it a minute and try again."
        ctas={[
          {
            label: 'Try Again ↻',
            href: '#',
            variant: 'primary',
            onClick: () => window.location.reload(),
          },
          { label: 'Take Me Home', href: '/', variant: 'secondary' },
        ]}
      />
    </>
  );
}
