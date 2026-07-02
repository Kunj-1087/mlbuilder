import { DisplayHeading, Body } from '@/components/typography';

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <DisplayHeading as="h1" size="lg" className="mb-4">Page: tools</DisplayHeading>
      <Body size="md" muted>This route is scaffolded and ready for the corresponding prompt build.</Body>
    </div>
  );
}
