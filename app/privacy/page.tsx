import { Metadata } from 'next';
import { DisplayHeading, Body } from '@/components/typography';

export const metadata: Metadata = {
  title: 'Privacy Policy — MLBuilder',
  description: 'Read the privacy policy of MLBuilder. Learn how we handle and protect user analytics, authentication credentials, and data.',
  alternates: {
    canonical: 'https://mlbuilder.in/privacy',
  },
};

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <DisplayHeading as="h1" size="lg" className="mb-4">Page: privacy</DisplayHeading>
      <Body size="md" muted>This route is scaffolded and ready for the corresponding prompt build.</Body>
    </div>
  );
}
