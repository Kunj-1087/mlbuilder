/**
 * Build-time sitemap generator for MLBuilder.
 *
 * Run with: npx tsx scripts/generate-sitemap.ts
 * Generates public/sitemap.xml from real content sources.
 * TODO: Wire into build process (add to package.json scripts)
 */

import { blogPosts } from '../lib/data/blogPosts';

const BASE_URL = process.env.SITE_URL || 'https://mlbuilder.in';

interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: number;
}

function generateSitemap(): string {
  const entries: SitemapEntry[] = [];

  // Static pages
  const staticPages = [
    { path: '/', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/free', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/newsletter', priority: 0.6, changeFrequency: 'monthly' },
  ];

  for (const page of staticPages) {
    entries.push({
      url: `${BASE_URL}${page.path}`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  // Blog posts
  for (const post of blogPosts) {
    entries.push({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // NOTE: Lead magnets would be queried from Prisma in production.
  // TODO: Wire to real Prisma query when database is connected
  // For now, scaffold the structure

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return xml;
}

// Run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  const fs = require('fs');
  const path = require('path');
  const sitemap = generateSitemap();
  const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, sitemap, 'utf-8');
  console.log(`✓ Sitemap generated: ${outputPath}`);
}

export { generateSitemap };
