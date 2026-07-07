"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSearch } from '@/lib/search/SearchContext';
import DropdownMenu from './DropdownMenu';
import PillButton from './PillButton';
import { BRAND } from '@/lib/brand/constants';
import { DisplayHeading, Body, Label } from '@/components/typography';

const navItems = [
  {
    label: 'Automation',
    items: [
      { label: 'All Automations', to: '/automation', description: 'Browse all scripts and pipelines' },
      { label: 'Web Scraping', to: '/automation/web-scraping', description: 'Production-ready Python scrapers' },
    ],
  },
  {
    label: 'Research',
    items: [
      { label: 'Research Digests', to: '/research', description: 'ML papers, explained plainly' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { label: 'Utility Tools', to: '/tools', description: '100% free developer utilities' },
    ],
  },
  {
    label: 'Blog',
    items: [
      { label: 'All Posts', to: '/blog', description: 'Build notes and developer logs' },
      { label: 'Community', to: '/blog/community', description: 'Where the community lives' },
    ],
  },
];

function ChevronIcon() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="transition-transform duration-150 group-hover:rotate-180">
      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Search icon for the trigger ─── */
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.5" />
      <path d="M16 16L20 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Desktop search trigger ─── */
function SearchTrigger() {
  const { open, triggerRef } = useSearch();
  const [os, setOs] = useState<'mac' | 'other'>('other');

  useEffect(() => {
    setOs(navigator.platform.toUpperCase().includes('MAC') ? 'mac' : 'other');
  }, []);

  return (
    <button
      ref={triggerRef}
      onClick={open}
      className="
        hidden md:inline-flex items-center gap-2
        px-3 py-1.5 rounded-pill
        border-2 border-ink
        bg-surface
        shadow-hard-sm
        hover:shadow-[6px_6px_0_#111111] hover:-translate-y-[1px]
        transition-all duration-150 cursor-pointer
        min-w-[180px]
      "
      aria-label="Open search"
    >
      <span className="text-muted"><SearchIcon /></span>
      <Body size="xs" muted className="flex-1 text-left select-none">Search...</Body>
      <span className="px-1.5 py-0.5 rounded border border-ink/20 bg-cream font-mono text-body-xs text-muted">
        {os === 'mac' ? '⌘K' : 'Ctrl K'}
      </span>
    </button>
  );
}

/* ─── Mobile search trigger (icon only) ─── */
function MobileSearchTrigger() {
  const { open } = useSearch();

  return (
    <button
      onClick={open}
      className="
        md:hidden
        w-9 h-9 flex items-center justify-center
        border-2 border-ink rounded-sharp
        shadow-hard-sm bg-surface text-ink
        hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]
        transition-all cursor-pointer
      "
      aria-label="Open search"
    >
      <SearchIcon />
    </button>
  );
}

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-40 bg-cream border-b-2 border-ink">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <Image
              src={BRAND.assets.logoMark}
              width={22}
              height={22}
              alt="MLBuilder Logo"
              className="flex-shrink-0 group-hover:rotate-[20deg] transition-transform duration-300"
            />
            <DisplayHeading as="span" size="sm" className="tracking-tight select-none text-lg md:text-xl inline-flex items-center">
              <span className="text-accent">ML</span><span className="text-ink">BUILDER</span>
            </DisplayHeading>
          </Link>

          {/* ── Center Nav (Desktop) ── */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((nav) => {
              const active = isActive(`/${nav.label.toLowerCase()}`);
              return (
                <DropdownMenu
                  key={nav.label}
                  trigger={
                    <span
                      className={`
                        inline-flex items-center gap-1.5
                        px-3.5 py-1.5
                        rounded-pill
                        border-2 border-ink
                        transition-all duration-150 cursor-pointer select-none
                        ${active
                          ? 'bg-ink text-cream shadow-hard-sm font-semibold'
                          : 'bg-surface text-ink hover:bg-ink hover:text-cream shadow-hard-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]'
                        }
                      `}
                    >
                      <Label className="text-body-sm font-bold text-current cursor-pointer">{nav.label}</Label>
                      <ChevronIcon />
                    </span>
                  }
                  items={nav.items}
                />
              );
            })}
          </div>

          {/* ── Right (Auth + Search + Mobile Toggle) ── */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Desktop search trigger */}
            <SearchTrigger />

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/free"
                  className="
                    inline-flex items-center gap-1.5
                    px-3 py-1.5
                    rounded-pill
                    border-2 border-ink
                    bg-surface text-ink
                    shadow-hard-sm
                    hover:bg-ink hover:text-cream
                    hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]
                    transition-all duration-150
                  "
                >
                  <Label className="text-body-xs font-bold text-current cursor-pointer">📥 Free PDF</Label>
                </Link>
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-pill border-2 border-ink bg-surface hover:bg-ink hover:text-cream transition-colors shadow-hard-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                >
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-cream text-xs font-bold border border-ink">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <Label className="text-body-sm font-bold text-current cursor-pointer">{user.name}</Label>
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/free"
                  className="
                    inline-flex items-center gap-1.5
                    px-3 py-1.5
                    rounded-pill
                    border-2 border-ink
                    bg-surface text-ink
                    shadow-hard-sm
                    hover:bg-ink hover:text-cream
                    hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]
                    transition-all duration-150
                  "
                >
                  <Label className="text-body-xs font-bold text-current cursor-pointer">📥 Free PDF</Label>
                </Link>
                <PillButton to="/sign-in" variant="secondary" size="sm">
                  Sign In
                </PillButton>
              </div>
            )}

            {/* Mobile search + hamburger */}
            <MobileSearchTrigger />

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 border-2 border-ink rounded-sharp shadow-hard-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-surface"
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                {mobileOpen ? (
                  <path d="M5 5L15 15M15 5L5 15" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
                ) : (
                  <>
                    <path d="M3 5H17" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M3 10H17" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M3 15H17" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden border-t-2 border-ink bg-surface">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((nav) => (
              <div key={nav.label}>
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === nav.label ? null : nav.label)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-ink cursor-pointer"
                >
                  <DisplayHeading as="span" size="sm" className="text-base font-bold text-current">{nav.label}</DisplayHeading>
                  <svg
                    width="10" height="6" viewBox="0 0 10 6" fill="none"
                    className={`transition-transform duration-150 ${mobileExpanded === nav.label ? 'rotate-180' : ''}`}
                  >
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {mobileExpanded === nav.label && (
                  <div className="pb-2">
                    {nav.items.map((item) => (
                      <Link
                        key={item.to}
                        href={item.to}
                        onClick={() => setMobileOpen(false)}
                        className="block pl-6 pr-3 py-2 hover:bg-cream transition-colors"
                      >
                        <Body size="sm" muted className="font-semibold text-current">{item.label}</Body>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-ink"
            >
              <DisplayHeading as="span" size="sm" className="text-base font-bold text-current">About</DisplayHeading>
            </Link>

            <Link
              href="/free"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-ink"
            >
              <DisplayHeading as="span" size="sm" className="text-base font-bold text-current">📥 Free PDF</DisplayHeading>
            </Link>

            <div className="pt-3 border-t-2 border-ink/10 space-y-2">
              {user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2"
                  >
                    <Label className="text-body-sm font-bold text-ink">Account ({user.name})</Label>
                  </Link>

                </>
              ) : (
                <div className="flex gap-2 px-3 pt-1">
                  <PillButton to="/sign-in" variant="secondary" size="sm" onClick={() => setMobileOpen(false)}>
                    Sign In
                  </PillButton>
                  <PillButton to="/sign-up" variant="ghost" size="sm" onClick={() => setMobileOpen(false)}>
                    Sign Up
                  </PillButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
