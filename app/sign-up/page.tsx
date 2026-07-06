import { Metadata } from 'next';
import { DisplayHeading, Body } from '@/components/typography';

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
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <DisplayHeading as="h1" size="lg" className="mb-4">Page: sign-up</DisplayHeading>
      <Body size="md" muted>This route is scaffolded and ready for the corresponding prompt build.</Body>
    </div>
  );
}
