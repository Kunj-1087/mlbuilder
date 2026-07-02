import Link from 'next/link';
import NewsletterForm from './NewsletterForm';
import { BRAND } from '@/lib/brand/constants';
import { DisplayHeading, Body, Label, Fine } from '@/components/typography';

export default function Footer() {
  return (
    <>
      {/* ── Newsletter footer strip ── */}
      <NewsletterForm
        variant="footer-strip"
        source="site-footer"
        heading="STAY IN THE LOOP."
        subheading="Weekly build logs and tool drops — no spam."
        buttonLabel="Subscribe →"
      />

      <footer className="bg-ink border-t-2 border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-10">

            {/* ── Brand ── */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2.5 group">
                {/* Star mark — matches Navbar */}
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none" className="flex-shrink-0 group-hover:rotate-[20deg] transition-transform duration-300">
                  <path d="M11 0L13.1 8.9L22 11L13.1 13.1L11 22L8.9 13.1L0 11L8.9 8.9L11 0Z" fill={BRAND.colors.orange} />
                </svg>
                <DisplayHeading as="span" size="sm" className="tracking-tight select-none text-lg">
                  <span className="text-accent">ML</span><span className="text-cream">BUILDER</span>
                </DisplayHeading>
              </Link>
              <Body size="sm" className="text-cream/50 mt-3 leading-relaxed max-w-[200px]">
                AI automation, research, and tools — built solo, shared openly.
              </Body>
            </div>

            {/* ── Explore ── */}
            <div>
              <Label variant="default" className="text-accent text-body-xs block mb-4">EXPLORE</Label>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/automation/workflows" className="hover:text-accent transition-colors">
                    <Body size="sm" className="text-cream/60 hover:text-accent transition-colors">Automation</Body>
                  </Link>
                </li>
                <li>
                  <Link href="/research/papers" className="hover:text-accent transition-colors">
                    <Body size="sm" className="text-cream/60 hover:text-accent transition-colors">Research</Body>
                  </Link>
                </li>
                <li>
                  <Link href="/tools/free" className="hover:text-accent transition-colors">
                    <Body size="sm" className="text-cream/60 hover:text-accent transition-colors">Tools</Body>
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-accent transition-colors">
                    <Body size="sm" className="text-cream/60 hover:text-accent transition-colors">Blog</Body>
                  </Link>
                </li>
              </ul>
            </div>

            {/* ── Account ── */}
            <div>
              <Label variant="default" className="text-accent text-body-xs block mb-4">ACCOUNT</Label>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/sign-in" className="hover:text-accent transition-colors">
                    <Body size="sm" className="text-cream/60 hover:text-accent transition-colors">Sign In</Body>
                  </Link>
                </li>
                <li>
                  <Link href="/sign-up" className="hover:text-accent transition-colors">
                    <Body size="sm" className="text-cream/60 hover:text-accent transition-colors">Create Account</Body>
                  </Link>
                </li>
              </ul>
            </div>

            {/* ── Resources ── */}
            <div>
              <Label variant="default" className="text-accent text-body-xs block mb-4">RESOURCES</Label>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/free" className="hover:text-accent transition-colors">
                    <Body size="sm" className="text-cream/60 hover:text-accent transition-colors">Free Downloads</Body>
                  </Link>
                </li>
                <li>
                  <Link href="/newsletter" className="hover:text-accent transition-colors">
                    <Body size="sm" className="text-cream/60 hover:text-accent transition-colors">Newsletter</Body>
                  </Link>
                </li>
              </ul>
            </div>

            {/* ── Resources (cont.) ── */}
            <div>
              <Label variant="default" className="text-accent text-body-xs block mb-4">LEGAL</Label>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/privacy" className="hover:text-accent transition-colors">
                    <Body size="sm" className="text-cream/60 hover:text-accent transition-colors">Privacy Policy</Body>
                  </Link>
                </li>
                <li>
                  <a href="/rss.xml" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    <Body size="sm" className="text-cream/60 hover:text-accent transition-colors">RSS Feed ↗</Body>
                  </a>
                </li>
              </ul>
            </div>

            {/* ── Connect ── */}
            <div>
              <Label variant="default" className="text-accent text-body-xs block mb-4">CONNECT</Label>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="https://instagram.com/mlbuilder.py"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    <Body size="sm" className="text-cream/60 hover:text-accent transition-colors">Instagram ↗</Body>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@mlbuilder.com"
                    className="hover:text-accent transition-colors"
                  >
                    <Body size="sm" className="text-cream/60 hover:text-accent transition-colors">Email</Body>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="mt-12 pt-6 border-t-2 border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Fine muted className="text-cream/30">
              © 2026 MLBuilder. All rights reserved.
            </Fine>
            <Fine muted className="text-cream/30 italic">
              built solo, shared openly
            </Fine>
          </div>
        </div>
      </footer>
    </>
  );
}
