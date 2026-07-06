import { Metadata } from 'next';
import { DisplayHeading, Body } from '@/components/typography';

export const metadata: Metadata = {
  title: 'Reset Password Request — MLBuilder',
  description: 'Forgot your password? Request a secure password reset link to regain access to your saved MLBuilder dashboards.',
  alternates: {
    canonical: 'https://mlbuilder.in/forgot-password',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <DisplayHeading as="h1" size="lg" className="mb-4">Page: forgot-password</DisplayHeading>
      <Body size="md" muted>This route is scaffolded and ready for the corresponding prompt build.</Body>
    </div>
  );
}
