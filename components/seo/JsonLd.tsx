/**
 * JsonLd — renders schema.org structured data as a <script> tag.
 *
 * Safe JSON.stringify with </script> escaping to prevent XSS.
 */

interface JsonLdProps {
  data: Record<string, unknown>;
}

function safeStringify(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003C')
    .replace(/>/g, '\\u003E')
    .replace(/&/g, '\\u0026');
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeStringify(data) }}
    />
  );
}

/** Organization schema for root layout */
export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'MLBuilder',
        url: 'https://mlbuilder.in',
        description: 'AI automation breakdowns, research digests in plain English, and free tools — all in one place. Built for people who actually want to ship things.',
        founder: {
          '@type': 'Person',
          name: 'Kunj Nakrani',
          url: 'https://kunjnakrani.in',
        },
        sameAs: [
          'https://instagram.com/mlbuilder.py',
          'https://kunjnakrani.in',
        ],
      }}
    />
  );
}

/** WebSite schema with SearchAction for homepage */
export function WebSiteSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'MLBuilder',
        url: 'https://mlbuilder.in',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://mlbuilder.in/?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}

/** Person schema for about page */
export function PersonSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Kunj Nakrani',
        jobTitle: 'Founder of MLBuilder, Student',
        url: 'https://mlbuilder.in/about',
        sameAs: [
          'https://instagram.com/mlbuilder.py',
          'https://kunjnakrani.in',
        ],
        worksFor: {
          '@type': 'Organization',
          name: 'MLBuilder',
        },
      }}
    />
  );
}

/** BlogPosting schema for blog post detail pages */
export function BlogPostingSchema({
  title,
  description,
  slug,
  publishedAt,
  updatedAt,
  tags,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description,
        image: `https://mlbuilder.in/opengraph-image`,
        datePublished: publishedAt,
        dateModified: updatedAt || publishedAt,
        author: {
          '@type': 'Person',
          name: 'Kunj Nakrani',
          url: 'https://kunjnakrani.in',
        },
        publisher: {
          '@type': 'Organization',
          name: 'MLBuilder',
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://mlbuilder.in/blog/${slug}`,
        },
        keywords: tags?.join(', '),
      }}
    />
  );
}

/** DigitalDocument schema for lead magnet pages */
export function DigitalDocumentSchema({
  title,
  description,
  slug,
}: {
  title: string;
  description: string;
  slug: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'DigitalDocument',
        name: title,
        description,
        url: `https://mlbuilder.in/free/${slug}`,
        author: {
          '@type': 'Person',
          name: 'Kunj Nakrani',
          url: 'https://kunjnakrani.in',
        },
        publisher: {
          '@type': 'Organization',
          name: 'MLBuilder',
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
      }}
    />
  );
}
