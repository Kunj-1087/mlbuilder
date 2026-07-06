import { Metadata } from 'next';
import { DisplayHeading, Body } from '@/components/typography';

export const metadata: Metadata = {
  title: 'Stay Ahead — Join the MLBuilder Newsletter',
  description: 'Get weekly AI automation breakdowns, curated research digests, and developer tools delivered directly to your inbox.',
  alternates: {
    canonical: 'https://mlbuilder.in/newsletter',
  },
};

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <DisplayHeading as="h1" size="lg" className="mb-4">Page: newsletter</DisplayHeading>
      <Body size="md" muted>This route is scaffolded and ready for the corresponding prompt build.</Body>
    </div>
  );
}
