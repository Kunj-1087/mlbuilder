/**
 * Fuse.js configuration tuned for MLBuilder content.
 *
 * When the search index grows past 500 items, consider memoizing
 * the Fuse instance creation (it's expensive on large datasets).
 * For current early-stage volume this isn't a concern.
 */
import type { IFuseOptions, FuseResultMatch } from 'fuse.js';

export interface SearchableItem {
  id: string;
  type: 'blog' | 'automation' | 'research' | 'tools' | 'lead-magnet' | 'page';
  title: string;
  description: string;
  excerpt: string;
  url: string;
  tags: string[];
  category: string;
  publishedAt: string | null;
  coverColor: string | null;
  coverEmoji: string | null;
  /** Matches returned by Fuse.js search (used for highlighting) */
  matches?: FuseResultMatch[];
}

export const fuseConfig: IFuseOptions<SearchableItem> = {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'tags', weight: 0.25 },
    { name: 'category', weight: 0.15 },
    { name: 'description', weight: 0.07 },
    { name: 'excerpt', weight: 0.03 },
  ],
  threshold: 0.35,
  includeMatches: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
  shouldSort: true,
};

/** Human-readable labels for search result type badges */
export const TYPE_LABELS: Record<SearchableItem['type'], string> = {
  blog: 'BLOG',
  automation: 'AUTOMATION',
  research: 'RESEARCH',
  tools: 'TOOLS',
  'lead-magnet': 'FREE PDF',
  page: 'PAGE',
};

/** Cover color mapped to Tailwind bg classes */
export const COVER_BG: Record<string, string> = {
  navy: 'bg-cover-navy',
  black: 'bg-cover-black',
  teal: 'bg-cover-teal',
  beige: 'bg-cover-beige',
  maroon: 'bg-cover-maroon',
  olive: 'bg-cover-olive',
};

/** Filter pill labels that map to SearchableItem types */
export const FILTER_TYPES: { label: string; type: SearchableItem['type'] | 'all' }[] = [
  { label: 'All', type: 'all' },
  { label: 'Blog', type: 'blog' },
  { label: 'Automation', type: 'automation' },
  { label: 'Research', type: 'research' },
  { label: 'Tools', type: 'tools' },
  { label: 'Free PDFs', type: 'lead-magnet' },
  { label: 'Pages', type: 'page' },
];

/** Suggestion chips shown when search input is empty */
export const SUGGESTION_CHIPS = [
  'n8n workflows',
  'Gemini Flash',
  'research papers',
  'free PDF',
  'build log',
  'Python',
  'RAG pipeline',
  'token counter',
  'news bot',
];

/** Static quick-link pages */
export const QUICK_LINKS: SearchableItem[] = [
  {
    id: 'page-home',
    type: 'page',
    title: 'Home',
    description: 'MLBuilder homepage — AI automation, research, and free tools.',
    excerpt: 'Cut the noise, build for real. AI that ships.',
    url: '/',
    tags: ['home', 'landing', 'main'],
    category: 'Navigation',
    publishedAt: null,
    coverColor: null,
    coverEmoji: '🏠',
  },
  {
    id: 'page-about',
    type: 'page',
    title: 'About',
    description: 'About MLBuilder — built solo by Kunj.',
    excerpt: 'The story behind MLBuilder and what it stands for.',
    url: '/about',
    tags: ['about', 'kunj', 'story', 'team'],
    category: 'Navigation',
    publishedAt: null,
    coverColor: null,
    coverEmoji: '👤',
  },
  {
    id: 'page-free',
    type: 'page',
    title: 'Free Resources',
    description: 'Free downloadable guides, swipe files, and templates.',
    excerpt: 'Take what you need. No strings attached.',
    url: '/free',
    tags: ['free', 'downloads', 'pdf', 'resources', 'lead magnet'],
    category: 'Navigation',
    publishedAt: null,
    coverColor: null,
    coverEmoji: '📥',
  },
  {
    id: 'page-newsletter',
    type: 'page',
    title: 'Newsletter',
    description: 'MLBuilder newsletter — build logs, research notes, tool drops.',
    excerpt: 'Weekly build logs and tool drops — no spam.',
    url: '/newsletter',
    tags: ['newsletter', 'subscribe', 'email', 'weekly'],
    category: 'Navigation',
    publishedAt: null,
    coverColor: null,
    coverEmoji: '✉️',
  },
  {
    id: 'page-community',
    type: 'page',
    title: 'Community',
    description: 'Where the MLBuilder community lives — vote on platforms.',
    excerpt: 'Join the community and shape what comes next.',
    url: '/blog/community',
    tags: ['community', 'discord', 'telegram', 'vote'],
    category: 'Navigation',
    publishedAt: null,
    coverColor: null,
    coverEmoji: '👥',
  },
  {
    id: 'page-blog',
    type: 'page',
    title: 'Blog',
    description: 'Build notes, research breakdowns, and deep dives.',
    excerpt: 'Honest AI logs, real build notes.',
    url: '/blog',
    tags: ['blog', 'posts', 'articles', 'writing'],
    category: 'Navigation',
    publishedAt: null,
    coverColor: null,
    coverEmoji: '📝',
  },
];
