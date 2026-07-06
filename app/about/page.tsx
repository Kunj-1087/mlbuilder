import { Metadata } from 'next';
import { DisplayHeading, Body } from '@/components/typography';
import { PersonSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'About MLBuilder — Behind the Automation Library',
  description: 'Discover the story behind MLBuilder. Open-source scripts, technical breakdowns, and tools created to streamline development and automate operations.',
  alternates: {
    canonical: 'https://mlbuilder.in/about',
  },
};

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <PersonSchema />
      <DisplayHeading as="h1" size="lg" className="mb-4">Page: about</DisplayHeading>
      <Body size="md" muted>This route is scaffolded and ready for the corresponding prompt build.</Body>
    </div>
  );
}
