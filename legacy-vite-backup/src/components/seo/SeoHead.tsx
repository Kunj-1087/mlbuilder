/**
 * SeoHead — reusable metadata component for MLBuilder pages.
 *
 * Uses react-helmet-async to set <head> metadata per-page.
 * Handles title, description, canonical, OG, Twitter, robots.
 */
import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl } from '@/lib/seo/canonical';

interface SeoHeadProps {
  title?: string;
  description?: string;
  path: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  section?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export default function SeoHead({
  title,
  description,
  path,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  tags,
  section,
  noindex = false,
  nofollow = false,
}: SeoHeadProps) {
  const canonical = getCanonicalUrl(path);
  const siteTitle = title ? `${title} — MLBuilder` : 'MLBuilder — AI Builds, Research, and Tools';
  const ogImage = image || 'https://mlbuilder.in/opengraph-image.png';

  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
  ].join(', ');

  return (
    <Helmet>
      {/* Basic */}
      <title>{siteTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={robotsContent} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="MLBuilder" />
      <meta property="og:title" content={siteTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@mlbuilder_py" />
      <meta name="twitter:site" content="@mlbuilder_py" />
      <meta name="twitter:title" content={siteTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
