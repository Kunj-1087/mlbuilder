/**
 * Build-time RSS feed generator for MLBuilder.
 *
 * Run with: npx tsx scripts/generate-rss.ts
 * Generates public/rss.xml from blog post data.
 * TODO: Wire into build process (add to package.json scripts)
 */

import { blogPosts } from '../src/lib/data/blogPosts';

const BASE_URL = process.env.SITE_URL || 'https://mlbuilder.in';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(date: Date): string {
  return date.toUTCString();
}

function generateRss(): string {
  const sortedPosts = [...blogPosts].slice(0, 20); // Latest 20
  const now = new Date();

  const items = sortedPosts
    .map((post) => {
      const pubDate = toRfc822(now); // In production, use post.publishedAt
      const categories = post.categories.map(
        (cat) => `      <category>${escapeXml(cat)}</category>`
      ).join('\n');

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
${categories}
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MLBuilder Blog</title>
    <description>Build logs, research notes, and tool drops from MLBuilder.</description>
    <link>${BASE_URL}/blog</link>
    <language>en-us</language>
    <lastBuildDate>${toRfc822(now)}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}

// Run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  const fs = require('fs');
  const path = require('path');
  const rss = generateRss();
  const outputPath = path.join(__dirname, '..', 'public', 'rss.xml');
  fs.writeFileSync(outputPath, rss, 'utf-8');
  console.log(`✓ RSS feed generated: ${outputPath}`);
}

export { generateRss };
