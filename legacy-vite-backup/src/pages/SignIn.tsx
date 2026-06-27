import { useEffect } from 'react';
import SeoHead from '@/components/seo/SeoHead';
import AuthForm from '@/components/AuthForm';
import { track, EVENTS } from '@/lib/analytics/track';

export default function SignIn() {
  useEffect(() => {
    track(EVENTS.AUTH_SIGNIN_STARTED, {});
  }, []);

  return (
    <>
      <SeoHead
        title="Sign In"
        description="Sign in to access automation breakdowns, research notes, and free AI tools."
        path="/sign-in"
        noindex
      />
      <AuthForm mode="sign-in" />
    </>
  );
}
