import { Metadata } from 'next';
import { DisplayHeading, Body } from '@/components/typography';
import { SoftwareApplicationSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Developer Utility Tools — 100% Free & Open Source',
  description: 'A collection of free developer utility tools built to solve real-world problems. No paywalls, no signup required, no catches.',
  alternates: {
    canonical: 'https://mlbuilder.in/tools',
  },
};

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <SoftwareApplicationSchema
        name="MLBuilder Developer Tools"
        description="Free utility tools for web scraping parsing, token counting, and ML pipeline helpers."
        applicationCategory="DeveloperApplication"
      />
      <DisplayHeading as="h1" size="lg" className="mb-4">Page: tools</DisplayHeading>
      <Body size="md" muted>This route is scaffolded and ready for the corresponding prompt build.</Body>
    </div>
  );
}
