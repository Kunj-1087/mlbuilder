import { useEffect } from 'react';
import SeoHead from '@/components/seo/SeoHead';
import AuthForm from '@/components/AuthForm';
import { track, EVENTS } from '@/lib/analytics/track';

export default function SignUp() {
  useEffect(() => {
    track(EVENTS.AUTH_SIGNUP_STARTED, {});
  }, []);

  return (
    <>
      <SeoHead
        title="Create Account"
        description="Create a free account to access AI automation workflows, research digests, and tools — all in one place."
        path="/sign-up"
        noindex
      />
      <AuthForm mode="sign-up" />
    </>
  );
}
