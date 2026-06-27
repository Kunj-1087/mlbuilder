"use client";

import { useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { track, EVENTS } from '@/lib/analytics/track';

interface SubNavItem {
  label: string;
  to: string;
}

interface PillarLayoutProps {
  title: string;
  description: string;
  subNav: SubNavItem[];
  rootPath: string;
  children: ReactNode;
}

export default function PillarLayout({ title, description, subNav, rootPath, children }: PillarLayoutProps) {
  const pathname = usePathname();
  const currentSub = subNav.find((item) => pathname === item.to);

  useEffect(() => {
    track(EVENTS.PILLAR_PAGE_VIEWED, { pillar: title.toLowerCase() });
  }, [title]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          href={rootPath}
          className="font-body text-xs font-semibold uppercase tracking-[0.12em] text-muted hover:text-accent transition-colors"
        >
          {title}
        </Link>
        {currentSub && (
          <>
            <span className="font-body text-xs text-muted/40">/</span>
            <span className="font-body text-xs font-semibold uppercase tracking-[0.12em] text-ink">
              {currentSub.label}
            </span>
          </>
        )}
      </div>

      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-2">{title}</h1>
        <p className="font-body text-muted text-lg max-w-2xl">{description}</p>
      </div>

      {/* ── Sub-nav pills ── */}
      <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
        {subNav.map((item) => (
          <Link
            key={item.to}
            href={item.to}
            className={`
              px-5 py-2 rounded-pill border-2 border-ink font-body font-semibold text-sm
              transition-all duration-150 whitespace-nowrap
              ${pathname === item.to
                ? 'bg-ink text-cream shadow-hard-sm'
                : 'bg-surface text-ink hover:bg-ink hover:text-cream shadow-hard-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]'
              }
            `}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* ── Content ── */}
      {children}
    </div>
  );
}
