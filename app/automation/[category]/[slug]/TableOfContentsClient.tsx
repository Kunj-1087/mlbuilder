"use client";

import { useEffect, useState } from 'react';

interface Heading {
  level: number;
  text: string;
  id: string;
}

export default function TableOfContentsClient({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Track the element that is intersecting closest to the top of the viewport
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-100px 0px -60% 0px', // focused in top-middle area
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <ul className="space-y-3 font-body text-body-xs text-muted">
      {headings.map((heading) => {
        const isActive = heading.id === activeId;
        return (
          <li
            key={heading.id}
            style={{ paddingLeft: heading.level === 3 ? '12px' : '0px' }}
            className={`
              border-l-2 pl-2 transition-all duration-150
              ${isActive
                ? 'border-accent text-ink font-bold'
                : 'border-transparent text-muted hover:text-ink'
              }
            `}
          >
            <a href={`#${heading.id}`} className="block truncate">
              {heading.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
