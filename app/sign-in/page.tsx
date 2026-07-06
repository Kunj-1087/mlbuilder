import { Metadata } from 'next';
import SignInFormClient from '@/components/auth/SignInFormClient';

export const metadata: Metadata = {
  title: 'Sign In — MLBuilder',
  description: 'Access your MLBuilder account to manage saved automations, view download history, and vote on upcoming platform features.',
  alternates: {
    canonical: 'https://mlbuilder.in/sign-in',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <SignInFormClient />;
}
