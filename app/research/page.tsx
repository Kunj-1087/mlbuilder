import { Metadata } from 'next';
import { DisplayHeading, Body } from '@/components/typography';

export const metadata: Metadata = {
  title: 'AI Research Digests — Plain English Explanations',
  description: 'Complex machine learning and AI research papers translated into plain, actionable English digests for developers and builders.',
  alternates: {
    canonical: 'https://mlbuilder.in/research',
  },
};

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <DisplayHeading as="h1" size="lg" className="mb-4">Page: research</DisplayHeading>
      <Body size="md" muted>This route is scaffolded and ready for the corresponding prompt build.</Body>
    </div>
  );
}
