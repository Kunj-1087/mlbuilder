/**
 * UnauthorizedPage — branded 401 page for MLBuilder.
 *
 * Shown when an authenticated user tries to access a restricted area.
 */
import { useEffect } from 'react';
import SeoHead from '@/components/seo/SeoHead';
import ErrorPageLayout from '@/components/errors/ErrorPageLayout';
import { track, EVENTS } from '@/lib/analytics/track';

export default function UnauthorizedPage() {
  useEffect(() => {
    track(EVENTS.ERROR_PAGE_VIEWED, { error_code: '401', path: window.location.pathname });
  }, []);

  return (
    <>
      <SeoHead
        title="Not Authorized"
        description="You don't have access to this page."
        path="/unauthorized"
        noindex
      />

      <ErrorPageLayout
        errorCode="401"
        titleSegments={[
          { text: 'NOT', color: 'black' },
          { text: 'AUTHORIZED', color: 'orange' },
          { text: 'FOR THIS.', color: 'black' },
        ]}
        script="You're signed in, but this area isn't open to you yet."
        description="Some MLBuilder pages are restricted — either to specific user roles, or to early access. If you think you should have access, sign out and back in or send me a note."
        ctas={[
          { label: 'Back to Dashboard →', href: '/account', variant: 'primary' },
          { label: 'Go to Home →', href: '/', variant: 'secondary' },
        ]}
      />
    </>
  );
}
