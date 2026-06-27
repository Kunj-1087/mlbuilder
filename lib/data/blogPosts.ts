/**
 * Blog post data — shared between the Blog page and the search index.
 * When real CMS/MDX content arrives, replace this array with data
 * fetched from the CMS.
 */

export interface BlogPost {
  coverColor: string;
  coverTextColor: string;
  coverTitle: string;
  coverKeywords?: string;
  coverTag?: string;
  categories: string[];
  title: string;
  excerpt: string;
  footerTag: string;
  filterCategory: string;
  slug: string;
}

export const blogPosts: BlogPost[] = [
  {
    coverColor: 'bg-cover-navy',
    coverTextColor: 'text-cream',
    coverTitle: 'n8n + Gemini',
    coverKeywords: 'free tier • 100 runs/day • no code',
    coverTag: 'BUILD LOG',
    categories: ['AUTOMATION', 'N8N', 'TUTORIAL'],
    title: 'Building a daily AI news bot with n8n and Gemini Flash',
    excerpt: "Wired up an n8n workflow that scrapes 5 AI news sources, summarizes with Gemini Flash, and pushes to Telegram every morning. Here's the exact setup.",
    footerTag: 'Automation',
    filterCategory: 'Automation',
    slug: 'n8n-gemini-daily-news',
  },
  {
    coverColor: 'bg-cover-black',
    coverTextColor: 'text-cream',
    coverTitle: 'This Site, Live',
    coverKeywords: 'next.js • tailwind • solo dev',
    coverTag: 'BUILD LOG',
    categories: ['BUILD LOG', 'NEXT.JS', 'DEV'],
    title: 'How I built MLBuilder in a weekend — stack, decisions, and shortcuts',
    excerpt: 'The full walkthrough: React Router, Tailwind with a neo-brutalist design system, auth from scratch, and why I chose boring tech for a side project.',
    footerTag: 'Build Logs',
    filterCategory: 'Build Logs',
    slug: 'how-i-built-mlbuilder',
  },
  {
    coverColor: 'bg-cover-teal',
    coverTextColor: 'text-cream',
    coverTitle: 'RAG from Scratch',
    coverKeywords: 'python • embeddings • vector store',
    coverTag: 'DEEP DIVE',
    categories: ['AUTOMATION', 'RAG', 'PYTHON'],
    title: 'A working RAG pipeline from scratch — no frameworks, no magic',
    excerpt: 'Built a retrieval-augmented generation pipeline in pure Python. No LangChain, no abstraction layers. Just chunking, embeddings, and a vector store.',
    footerTag: 'Automation',
    filterCategory: 'Automation',
    slug: 'rag-from-scratch',
  },
  {
    coverColor: 'bg-cover-beige',
    coverTextColor: 'text-ink',
    coverTitle: 'Attention Paper',
    coverKeywords: 'transformers • 2017 • foundational',
    coverTag: 'RESEARCH',
    categories: ['RESEARCH', 'PAPERS', 'TRANSFORMERS'],
    title: 'Attention Is All You Need — what it actually means, in plain English',
    excerpt: "The 2017 paper that started everything. I read it so you don't have to — here's the core idea, why self-attention replaced RNNs, and what it means for everything built since.",
    footerTag: 'Research',
    filterCategory: 'Research',
    slug: 'attention-is-all-you-need',
  },
  {
    coverColor: 'bg-cover-maroon',
    coverTextColor: 'text-cream',
    coverTitle: 'Token Counter',
    coverKeywords: 'openai • claude • cost calc',
    coverTag: 'FREE TOOL',
    categories: ['TOOLS', 'PROMPTING', 'COST'],
    title: 'I built a free token counter — because guessing API costs is exhausting',
    excerpt: 'Paste your text, see the token count across GPT-4, Claude, and Llama. No sign-up, no paywall, no tracking. Just a tool that does one thing.',
    footerTag: 'Tools',
    filterCategory: 'Tools',
    slug: 'free-token-counter',
  },
  {
    coverColor: 'bg-cover-olive',
    coverTextColor: 'text-cream',
    coverTitle: 'AI News Weekly',
    coverKeywords: 'scrape • summarize • telegram',
    coverTag: 'AUTOMATION',
    categories: ['AI NEWS', 'WEEKLY', 'ROUNDUP'],
    title: 'My weekly AI news roundup workflow — fully automated, zero manual work',
    excerpt: "Every Monday morning, an n8n workflow scrapes 12 sources, clusters the biggest stories, summarizes them, and drops a formatted digest in my inbox. Here's how.",
    footerTag: 'AI News',
    filterCategory: 'AI News',
    slug: 'weekly-ai-news-workflow',
  },
];
