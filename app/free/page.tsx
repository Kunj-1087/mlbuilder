import { Metadata } from 'next';
import { DisplayHeading, Body } from '@/components/typography';

export const metadata: Metadata = {
  title: 'Free Resources & Downloadable Guides — MLBuilder',
  description: 'Get free downloadable guides, cheat sheets, and automation setups. Build your project toolbox with actionable PDF resources.',
  alternates: {
    canonical: 'https://mlbuilder.in/free',
  },
};

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <DisplayHeading as="h1" size="lg" className="mb-4">Page: free</DisplayHeading>
      <Body size="md" muted>This route is scaffolded and ready for the corresponding prompt build.</Body>
    </div>
  );
}
