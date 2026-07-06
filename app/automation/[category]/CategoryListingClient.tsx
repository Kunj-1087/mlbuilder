"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BookmarkButton from '@/components/bookmarks/BookmarkButton';
import FilterPillRow from '@/components/FilterPillRow';
import { track } from '@/lib/analytics/track';
import { AutomationSummary } from '@/lib/content/types';
import { DisplayHeading, SectionHeading, Body, ScriptText, Label } from '@/components/typography';

interface CategoryListingClientProps {
  categorySlug: string;
  categoryTitle: string;
  automations: AutomationSummary[];
}

const COVER_COLORS = ['navy', 'black', 'teal', 'beige', 'maroon', 'olive'];

function getCoverColor(slug: string) {
  let sum = 0;
  for (let i = 0; i < slug.length; i++) {
    sum += slug.charCodeAt(i);
  }
  return COVER_COLORS[sum % 6];
}

function getCoverTextClass(color: string) {
  return color === 'beige' ? 'text-ink' : 'text-cream';
}

function getCoverBgClass(color: string) {
  return `bg-cover-${color}`;
}

export default function CategoryListingClient({
  categorySlug,
  categoryTitle,
  automations,
}: CategoryListingClientProps) {
  const [activeFilter, setActiveFilter] = useState('All');

  // Track page view
  useEffect(() => {
    track('automation_category_viewed', { category: categorySlug });
  }, [categorySlug]);

  // Extract unique tags and format them
  const dynamicTags = Array.from(
    new Set(automations.flatMap((auto) => auto.tags))
  );

  // Capitalize tags for display but match raw tags when filtering
  // Prepend difficulties
  const filterOptions = [
    'All',
    ...dynamicTags.map((t) => t.charAt(0).toUpperCase() + t.slice(1)),
    'Beginner',
    'Intermediate',
    'Advanced',
  ].filter((value, index, self) => self.indexOf(value) === index);

  const handleFilterChange = (filter: string) => {
    track('automation_filter_changed', {
      from_filter: activeFilter,
      to_filter: filter,
      category: categorySlug,
    });
    setActiveFilter(filter);
  };

  const filteredAutomations = automations.filter((auto) => {
    if (activeFilter === 'All') return true;
    const filterLower = activeFilter.toLowerCase();
    
    // Check difficulty match
    if (auto.difficulty.toLowerCase() === filterLower) return true;

    // Check tags match
    return auto.tags.some((tag) => tag.toLowerCase() === filterLower);
  });

  if (automations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-4">
        <div className="max-w-md p-8 border-2 border-ink bg-cream rounded-sharp shadow-hard">
          <DisplayHeading as="h2" size="sm" className="mb-2">BEING BUILT.</DisplayHeading>
          <ScriptText size="md" muted className="mb-6">
            First {categoryTitle} automation drops soon. Follow @mlbuilder.py to catch the first one.
          </ScriptText>
          <Link
            href="/automation"
            className="inline-block px-6 py-2.5 border-2 border-ink rounded-pill bg-accent text-ink font-body text-body-sm font-bold shadow-hard-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
          >
            Browse Other Pillars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Row */}
      <FilterPillRow
        filters={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Grid of Automation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
        {filteredAutomations.map((auto) => {
          const coverColor = getCoverColor(auto.slug);
          const bgClass = getCoverBgClass(coverColor);
          const textClass = getCoverTextClass(coverColor);
          const bookmarkItem = {
            itemType: 'automation' as const,
            itemId: `${auto.categorySlug}/${auto.slug}`,
            itemTitle: auto.title,
            itemExcerpt: auto.excerpt,
            itemUrl: `/automation/${auto.categorySlug}/${auto.slug}`,
            itemCoverColor: coverColor,
            itemCoverEmoji: '🕸️',
            itemCategory: categoryTitle,
          };

          return (
            <div
              key={auto.slug}
              className="
                border-2 border-ink rounded-sharp bg-cream shadow-hard
                transition-all duration-150
                hover:shadow-hard-lg hover:-translate-y-[2px]
                overflow-hidden flex flex-col h-full
              "
            >
              {/* Cover area */}
              <div className={`${bgClass} ${textClass} relative h-[240px] flex-shrink-0`}>
                <BookmarkButton item={bookmarkItem} variant="card-corner" />

                {auto.coverImage ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={auto.coverImage}
                      alt={auto.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                    <DisplayHeading as="h2" size="sm" className="mb-3 break-words max-w-full px-2 text-current">
                      {auto.title}
                    </DisplayHeading>
                    <Label className="text-body-xs opacity-75 tracking-wider text-current">
                      {auto.tags.slice(0, 3).join(' • ')}
                    </Label>
                    <div className="absolute bottom-4 left-4">
                      <Label className="inline-block px-2.5 py-0.5 rounded-pill border border-current bg-cream/10 text-body-xs font-bold text-current tracking-wider">
                        {auto.difficulty} · {auto.estimatedTime}
                      </Label>
                    </div>
                  </div>
                )}
              </div>

              {/* Content area */}
              <div className="p-6 flex flex-col flex-1 bg-cream border-t border-ink/10">
                <Label variant="metadata" className="text-body-xs font-bold tracking-[0.08em] mb-2 block">
                  {auto.tags.slice(0, 3).join(' • ')}
                </Label>

                <DisplayHeading as="h2" size="sm" className="text-lg leading-tight mb-2 line-clamp-2">
                  {auto.title}
                </DisplayHeading>

                <ScriptText size="sm" muted className="leading-snug line-clamp-3 mb-6 flex-1">
                  {auto.excerpt}
                </ScriptText>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-ink/10">
                  <Label variant="metadata" className="text-body-xs font-bold text-muted">
                    UPDATED {new Date(auto.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                  </Label>

                  <Link
                    href={`/automation/${auto.categorySlug}/${auto.slug}`}
                    className="font-body text-body-sm font-bold text-accent hover:text-ink transition-colors cursor-pointer select-none"
                  >
                    Open →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
