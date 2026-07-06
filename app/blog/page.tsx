import { Metadata } from 'next';
import { DisplayHeading, Body } from '@/components/typography';

export const metadata: Metadata = {
  title: 'MLBuilder Blog — Tech Insights & Guides',
  description: 'Articles, step-by-step guides, and developer stories covering AI automation, engineering best practices, and operations scaling.',
  alternates: {
    canonical: 'https://mlbuilder.in/blog',
  },
};

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <DisplayHeading as="h1" size="lg" className="mb-4">Page: blog</DisplayHeading>
      <Body size="md" muted>This route is scaffolded and ready for the corresponding prompt build.</Body>
    </div>
  );
}
