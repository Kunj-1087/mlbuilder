import { Metadata } from 'next';
import SignUpFormClient from '@/components/auth/SignUpFormClient';

export const metadata: Metadata = {
  title: 'Sign Up — MLBuilder Account',
  description: 'Create your MLBuilder account to unlock bookmarking, custom downloads, and suggest new automation features.',
  alternates: {
    canonical: 'https://mlbuilder.in/sign-up',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <SignUpFormClient />;
}
