/**
 * Unified search index builder.
 *
 * Aggregates ALL content across MLBuilder into a single SearchableItem[]
 * array. This runs server-side via the /api/search/index endpoint.
 */
import { blogPosts } from '@/lib/data/blogPosts';
import { getPublishedMagnets } from '@/lib/lead-magnet';
import { getAllAutomations } from '@/lib/content/automation';
import { prisma } from '@/lib/prisma';
import type { SearchableItem } from './fuseConfig';

const COVER_COLORS = ['navy', 'black', 'teal', 'beige', 'maroon', 'olive'];

function getCoverColor(slug: string) {
  let sum = 0;
  for (let i = 0; i < slug.length; i++) {
    sum += slug.charCodeAt(i);
  }
  return COVER_COLORS[sum % 6];
}

function getCoverEmoji(categorySlug: string): string {
  switch (categorySlug) {
    case 'web-scraping': return '🕸️';
    case 'data-processing': return '📊';
    case 'ai-workflows': return '⚙️';
    case 'api-automations': return '🔧';
    default: return '🐍';
  }
}

function formatCategoryLabel(categorySlug: string): string {
  if (categorySlug === 'web-scraping') return 'Web Scraping';
  return categorySlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Build search index from all content sources */
export async function buildSearchIndex(): Promise<SearchableItem[]> {
  const items: SearchableItem[] = [];

  // ── Blog posts (DB check first, fallback to static) ──
  let postsAdded = false;
  try {
    const dbPosts = await prisma.post.findMany({
      where: { published: true },
    });

    if (dbPosts.length > 0) {
      for (const post of dbPosts) {
        const categoryLabel = formatCategoryLabel(post.category);
        items.push({
          id: `blog-${post.id}`,
          type: 'blog',
          title: post.title,
          description: post.excerpt || '',
          excerpt: post.excerpt || '',
          url: `/blog`,
          tags: [post.category, 'blog'],
          category: categoryLabel,
          publishedAt: post.createdAt.toISOString(),
          coverColor: 'bg-cover-navy',
          coverEmoji: null,
        });
      }
      postsAdded = true;
    }
  } catch (error) {
    console.error('Error adding DB posts to search index:', error);
  }

  if (!postsAdded) {
    for (const post of blogPosts) {
      items.push({
        id: `blog-${post.slug}`,
        type: 'blog',
        title: post.title,
        description: post.excerpt,
        excerpt: post.excerpt,
        url: `/blog`,
        tags: [...post.categories, post.footerTag, post.filterCategory],
        category: post.filterCategory,
        publishedAt: null,
        coverColor: `bg-cover-${post.coverColor}`,
        coverEmoji: null,
      });
    }
  }

  // ── Dynamic Automations ──
  try {
    const automations = await getAllAutomations();
    for (const auto of automations) {
      items.push({
        id: `auto-${auto.categorySlug}-${auto.slug}`,
        type: 'automation',
        title: auto.title,
        description: auto.description,
        excerpt: auto.excerpt,
        url: `/automation/${auto.categorySlug}/${auto.slug}`,
        tags: [...auto.tags, 'automation', auto.categorySlug, auto.difficulty],
        category: formatCategoryLabel(auto.categorySlug),
        publishedAt: auto.lastUpdated,
        coverColor: `bg-cover-${getCoverColor(auto.slug)}`,
        coverEmoji: getCoverEmoji(auto.categorySlug),
      });
    }
  } catch (error) {
    console.error('Error adding automations to search index:', error);
  }

  // ── Published Lead Magnets (DB check first, fallback to static) ──
  let magnetsAdded = false;
  try {
    const dbMagnets = await prisma.leadMagnet.findMany({
      where: { status: 'PUBLISHED' },
    });

    if (dbMagnets.length > 0) {
      for (const magnet of dbMagnets) {
        items.push({
          id: `lead-magnet-${magnet.id}`,
          type: 'lead-magnet',
          title: magnet.title,
          description: magnet.description,
          excerpt: magnet.tagline,
          url: `/free/${magnet.slug}`,
          tags: [...magnet.whatYouLearn, 'free', 'pdf', 'download'],
          category: 'Free Downloads',
          publishedAt: null,
          coverColor: `bg-cover-${magnet.coverColor}`,
          coverEmoji: magnet.coverEmoji,
        });
      }
      magnetsAdded = true;
    }
  } catch (error) {
    console.error('Error adding DB magnets to search index:', error);
  }

  if (!magnetsAdded) {
    const magnets = getPublishedMagnets();
    for (const magnet of magnets) {
      items.push({
        id: `lead-magnet-${magnet.id}`,
        type: 'lead-magnet',
        title: magnet.title,
        description: magnet.description,
        excerpt: magnet.tagline,
        url: `/free/${magnet.slug}`,
        tags: [...magnet.whatYouLearn, 'free', 'pdf', 'download'],
        category: 'Free Downloads',
        publishedAt: null,
        coverColor: `bg-cover-${magnet.coverColor}`,
        coverEmoji: magnet.coverEmoji,
      });
    }
  }

  return items;
}
