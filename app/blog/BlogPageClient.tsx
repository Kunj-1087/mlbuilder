"use client";

import { useState, useRef } from 'react';
import { track, EVENTS } from '@/lib/analytics/track';
import BlogCard from '@/components/BlogCard';
import FilterPillRow from '@/components/FilterPillRow';
import NewsletterForm from '@/components/NewsletterForm';
import FeaturedLeadMagnetStrip from '@/components/lead-magnet/FeaturedLeadMagnetStrip';

export interface BlogPostMapped {
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

const FILTERS = ['All Posts', 'Automation', 'Research', 'Tools', 'Build Logs', 'AI News'];

interface BlogPageClientProps {
  initialPosts: BlogPostMapped[];
}

export default function BlogPageClient({ initialPosts }: BlogPageClientProps) {
  const [activeFilter, setActiveFilter] = useState('All Posts');
  const prevFilter = useRef('All Posts');

  const handleFilterChange = (filter: string) => {
    track(EVENTS.BLOG_FILTER_CHANGED, { from_filter: prevFilter.current, to_filter: filter });
    prevFilter.current = filter;
    setActiveFilter(filter);
  };

  const filtered = activeFilter === 'All Posts'
    ? initialPosts
    : initialPosts.filter((p) => p.filterCategory === activeFilter);

  const stats = [
    { value: `${initialPosts.length}`, label: 'posts published' },
    { value: '$0', label: 'to read' },
    { value: '100%', label: 'open access' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — Hero
      ═══════════════════════════════════════════════════════ */}
      <section className="mb-0">
        {/* Eyebrow breadcrumb */}
        <p className="font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-ink mb-4">
          § MLBUILDER / BLOG
        </p>

        {/* Massive stacked headline — alternating word colors */}
        <h1 className="font-display text-[60px] sm:text-7xl md:text-8xl lg:text-9xl xl:text-[140px] leading-[0.95] tracking-tight mb-4 select-none">
          <span className="block">
            <span className="text-ink">HONEST</span>{' '}
            <span className="text-accent">AI</span>{' '}
            <span className="text-ink">LOGS</span>
          </span>
          <span className="block">
            <span className="text-accent">REAL</span>{' '}
            <span className="text-ink">BUILD</span>{' '}
            <span className="text-accent">NOTES</span>
          </span>
        </h1>

        {/* Script subtext */}
        <p className="font-script text-ink text-[22px] sm:text-2xl md:text-[26px] leading-snug max-w-xl mb-8">
          Build notes, research breakdowns, and deep dives — written by someone actually shipping this stuff, not just talking about it.
        </p>

        {/* Inline stat row */}
        <div className="flex flex-wrap gap-x-12 gap-y-4 mb-0 select-none">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-[52px] leading-none text-accent">{s.value}</div>
              <div className="font-body text-[14px] text-ink mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-[2px] bg-ink mt-12" />
      </section>

      {/* Featured lead magnet strip */}
      <section className="mt-8">
        <FeaturedLeadMagnetStrip />
      </section>

      {/* SECTION 2 — Filter Pill Row */}
      <section>
        <FilterPillRow
          filters={FILTERS}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />

        {/* Divider */}
        <div className="h-[2px] bg-ink mt-0" />
      </section>

      {/* SECTION 3 — Blog Card Grid */}
      <div className="mt-8 mb-4">
        <NewsletterForm variant="inline" source="blog-index" />
      </div>

      <section className="mt-6">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <BlogCard
                key={post.slug}
                {...post}
                onTagClick={(tag) => {
                  if (FILTERS.includes(tag)) setActiveFilter(tag);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 select-none">
            <p className="font-script text-muted text-xl">
              No posts in this category yet — check back soon.
            </p>
          </div>
        )}
      </section>

      {/* SECTION 4 — End State */}
      <section className="mt-16 mb-4 text-center select-none">
        <p className="font-script text-muted text-lg">
          More dropping as I build them — follow @mlbuilder.py to catch new posts first.
        </p>
      </section>
    </div>
  );
}
