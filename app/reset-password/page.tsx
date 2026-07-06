import { Metadata } from 'next';
import { DisplayHeading, Body } from '@/components/typography';

export const metadata: Metadata = {
  title: 'Set New Password — MLBuilder',
  description: 'Choose a new secure password for your MLBuilder developer account.',
  alternates: {
    canonical: 'https://mlbuilder.in/reset-password',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <DisplayHeading as="h1" size="lg" className="mb-4">Page: reset-password</DisplayHeading>
      <Body size="md" muted>This route is scaffolded and ready for the corresponding prompt build.</Body>
    </div>
  );
}
