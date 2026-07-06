import { Metadata } from 'next';
import { DisplayHeading, Body } from '@/components/typography';

export const metadata: Metadata = {
  title: 'Community Hub — Share and Learn Automation',
  description: 'Connect with other vibe coders and builders. Share automation scripts, ask questions, and collaborate on building projects.',
  alternates: {
    canonical: 'https://mlbuilder.in/blog/community',
  },
};

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <DisplayHeading as="h1" size="lg" className="mb-4">Page: blog/community</DisplayHeading>
      <Body size="md" muted>This route is scaffolded and ready for the corresponding prompt build.</Body>
    </div>
  );
}
