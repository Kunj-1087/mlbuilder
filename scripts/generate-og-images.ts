/**
 * Build-time OG image generator for MLBuilder.
 *
 * Generates static fallback OG images for pages that don't have
 * server-side generation. In production with Vercel/Next.js, use
 * @vercel/og for dynamic generation instead.
 *
 * Run with: npx tsx scripts/generate-og-images.ts
 * TODO: Wire into build process
 * TODO: Use @vercel/og when migrating to Next.js
 */

// This is a placeholder script that documents the OG image structure.
// In a Vite SPA, OG images are typically static files in /public.
// Dynamic OG generation requires a server (Next.js, Cloudflare Workers, etc.)

interface OgImageConfig {
  outputPath: string;
  title: string;
  subtitle?: string;
  tag?: string;
  url?: string;
}

const OG_CONFIGS: OgImageConfig[] = [
  {
    outputPath: 'public/og-default.png',
    title: 'AI BUILDS. RESEARCH. TOOLS.',
    subtitle: 'Built solo. Shared openly.',
    url: 'mlbuilder.in',
  },
  {
    outputPath: 'public/og-blog.png',
    title: 'BLOG',
    subtitle: 'Build logs, research breakdowns, and tool drops.',
    tag: 'BLOG',
    url: 'mlbuilder.in/blog',
  },
  {
    outputPath: 'public/og-free.png',
    title: 'FREE RESOURCES',
    subtitle: 'Build kits, swipe files, and templates.',
    tag: 'FREE PDF',
    url: 'mlbuilder.in/free',
  },
];

/**
 * OG Image Structure (for @vercel/og or canvas implementation):
 *
 * Dimensions: 1200x630px
 * Background: #F5F1E6 (cream) with faint graph-paper grid overlay
 * Top-left: ★ MLBUILDER wordmark (ML in #FF6A1A, BUILDER in #111111)
 * Center-left: Title in Archivo Black ~96px, with "AI" in orange block
 * Below title: Subtitle in Caveat ~32px
 * Bottom-right: URL in Inter ~24px
 * Bottom-left: Thin ink-black accent bar
 *
 * Google Fonts to fetch:
 * - Archivo Black: https://fonts.gstatic.com/s/archivoblack/v22/HTxqL289NzCGg4MzN14OSj6ExnTzivB1.woff2
 * - Caveat: https://fonts.gstatic.com/s/caveat/v18/WnznHAc5bAfYB2QRah7pcpNvOx-pjfJ9eIepZQ.woff2
 */

console.log('═══════════════════════════════════════════════');
console.log('  OG Image Configuration');
console.log('═══════════════════════════════════════════════');
console.log();
console.log('Static fallback OG images are referenced in /public.');
console.log('For dynamic generation, use @vercel/og (Next.js only).');
console.log();
console.log('Configured images:');
for (const config of OG_CONFIGS) {
  console.log(`  → ${config.outputPath}`);
  console.log(`    Title: "${config.title}"`);
  if (config.tag) console.log(`    Tag: "${config.tag}"`);
  console.log(`    URL: ${config.url}`);
  console.log();
}

// TODO: Implement canvas-based generation or use @vercel/og
// TODO: Generate per-post OG images from blog post data
// TODO: Generate per-lead-magnet OG images with cover thumbnails

export { OG_CONFIGS };
