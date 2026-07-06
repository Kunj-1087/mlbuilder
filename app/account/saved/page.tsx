import { Metadata } from 'next';
import { DisplayHeading, Body } from '@/components/typography';

export const metadata: Metadata = {
  title: 'My Bookmarked Automations — MLBuilder',
  description: 'View and run your saved AI automations, scraping setups, and developer tools.',
  alternates: {
    canonical: 'https://mlbuilder.in/account/saved',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <DisplayHeading as="h1" size="lg" className="mb-4">Page: account/saved</DisplayHeading>
      <Body size="md" muted>This route is scaffolded and ready for the corresponding prompt build.</Body>
    </div>
  );
}
