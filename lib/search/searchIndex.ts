/**
 * Unified search index builder.
 *
 * Aggregates ALL content across MLBuilder into a single SearchableItem[]
 * array. This runs entirely CLIENT-SIDE — no server roundtrip needed.
 *
 * The result is cached in module-level state after first call so the
 * index is only built once per session.
 */
import { blogPosts } from '@/lib/data/blogPosts';
import { getPublishedMagnets } from '@/lib/lead-magnet';
import type { SearchableItem } from './fuseConfig';

/** Map a coverColor string (e.g. "navy") to the Tailwind bg class */
function colorToClass(color: string): string {
  return `bg-cover-${color}`;
}

/** Build search index from all content sources */
export function buildSearchIndex(): SearchableItem[] {
  const items: SearchableItem[] = [];

  // ── Blog posts ──
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
      coverColor: colorToClass(post.coverColor),
      coverEmoji: null,
    });
  }

  // ── Automation placeholder entries ──
  // These match the sub-pages users can navigate to
  const automationItems: SearchableItem[] = [
    {
      id: 'auto-workflows',
      type: 'automation',
      title: 'Workflows',
      description: 'Step-by-step AI automations — n8n, Python, and more.',
      excerpt: 'n8n and Python automation breakdowns — first one in progress.',
      url: '/automation/workflows',
      tags: ['automation', 'workflows', 'n8n', 'python', 'pipelines'],
      category: 'n8n Workflows',
      publishedAt: null,
      coverColor: 'bg-cover-navy',
      coverEmoji: '⚙️',
    },
    {
      id: 'auto-scripts',
      type: 'automation',
      title: 'Scripts',
      description: 'Ready-to-run code snippets for common AI tasks.',
      excerpt: 'Ready-to-run scripts for common AI tasks.',
      url: '/automation/scripts',
      tags: ['automation', 'scripts', 'code', 'snippets', 'python'],
      category: 'Code Snippets',
      publishedAt: null,
      coverColor: 'bg-cover-teal',
      coverEmoji: '🐍',
    },
    {
      id: 'auto-casestudies',
      type: 'automation',
      title: 'Case Studies',
      description: 'Real automation stories from people who shipped.',
      excerpt: 'Real-world automation breakdowns from production.',
      url: '/automation/case-studies',
      tags: ['automation', 'case studies', 'real world', 'production'],
      category: 'Case Studies',
      publishedAt: null,
      coverColor: 'bg-cover-maroon',
      coverEmoji: '📊',
    },
  ];
  items.push(...automationItems);

  // ── Research placeholder entries ──
  const researchItems: SearchableItem[] = [
    {
      id: 'research-papers',
      type: 'research',
      title: 'Research Papers',
      description: 'Key AI papers broken down in plain English.',
      excerpt: 'Key papers, explained plainly — first breakdowns in the works.',
      url: '/research/papers',
      tags: ['research', 'papers', 'AI', 'transformers', 'deep learning'],
      category: 'LLM Papers',
      publishedAt: null,
      coverColor: 'bg-cover-beige',
      coverEmoji: '📄',
    },
    {
      id: 'research-library',
      type: 'research',
      title: 'Library',
      description: 'Curated reading lists organized by topic.',
      excerpt: 'Curated reading lists — being assembled now.',
      url: '/research/library',
      tags: ['research', 'library', 'reading lists', 'curated'],
      category: 'Reading Lists',
      publishedAt: null,
      coverColor: 'bg-cover-olive',
      coverEmoji: '📚',
    },
    {
      id: 'research-insights',
      type: 'research',
      title: 'Insights',
      description: 'Research takeaways that connect papers to things you can actually do.',
      excerpt: 'What the research actually means — actionable insights.',
      url: '/research/insights',
      tags: ['research', 'insights', 'takeaways', 'practical'],
      category: 'Research Insights',
      publishedAt: null,
      coverColor: 'bg-cover-black',
      coverEmoji: '💡',
    },
  ];
  items.push(...researchItems);

  // ── Tools placeholder entries ──
  const toolsItems: SearchableItem[] = [
    {
      id: 'tools-free',
      type: 'tools',
      title: 'Free Tools',
      description: 'Free AI tools with no paywalls — the first one is almost ready.',
      excerpt: 'No paywalls, no hidden upgrade screens, no catch.',
      url: '/tools/free',
      tags: ['tools', 'free', 'AI tools', 'no paywall'],
      category: 'Free Tools',
      publishedAt: null,
      coverColor: 'bg-cover-accent',
      coverEmoji: '🔧',
    },
  ];
  items.push(...toolsItems);

  // ── Published Lead Magnets ──
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
      coverColor: colorToClass(magnet.coverColor),
      coverEmoji: magnet.coverEmoji,
    });
  }

  return items;
}
