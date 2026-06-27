import Link from 'next/link';
import NewsletterForm from './NewsletterForm';
import { BRAND } from '@/lib/brand/constants';

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
                <span className="font-display text-lg tracking-tight select-none">
                  <span className="text-accent">ML</span><span className="text-cream">BUILDER</span>
                </span>
              </Link>
              <p className="font-body text-cream/50 text-sm mt-3 leading-relaxed max-w-[200px]">
                AI automation, research, and tools — built solo, shared openly.
              </p>
            </div>

            {/* ── Explore ── */}
            <div>
              <h4 className="font-display text-xs text-accent tracking-[0.1em] mb-4">EXPLORE</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/automation/workflows" className="font-body text-sm text-cream/60 hover:text-accent transition-colors">
                    Automation
                  </Link>
                </li>
                <li>
                  <Link href="/research/papers" className="font-body text-sm text-cream/60 hover:text-accent transition-colors">
                    Research
                  </Link>
                </li>
                <li>
                  <Link href="/tools/free" className="font-body text-sm text-cream/60 hover:text-accent transition-colors">
                    Tools
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="font-body text-sm text-cream/60 hover:text-accent transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* ── Account ── */}
            <div>
              <h4 className="font-display text-xs text-accent tracking-[0.1em] mb-4">ACCOUNT</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/sign-in" className="font-body text-sm text-cream/60 hover:text-accent transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/sign-up" className="font-body text-sm text-cream/60 hover:text-accent transition-colors">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>

            {/* ── Resources ── */}
            <div>
              <h4 className="font-display text-xs text-accent tracking-[0.1em] mb-4">RESOURCES</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/free" className="font-body text-sm text-cream/60 hover:text-accent transition-colors">
                    Free Downloads
                  </Link>
                </li>
                <li>
                  <Link href="/newsletter" className="font-body text-sm text-cream/60 hover:text-accent transition-colors">
                    Newsletter
                  </Link>
                </li>
              </ul>
            </div>

            {/* ── Resources (cont.) ── */}
            <div>
              <h4 className="font-display text-xs text-accent tracking-[0.1em] mb-4">LEGAL</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/privacy" className="font-body text-sm text-cream/60 hover:text-accent transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <a href="/rss.xml" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-cream/60 hover:text-accent transition-colors">
                    RSS Feed ↗
                  </a>
                </li>
              </ul>
            </div>

            {/* ── Connect ── */}
            <div>
              <h4 className="font-display text-xs text-accent tracking-[0.1em] mb-4">CONNECT</h4>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="https://instagram.com/mlbuilder.py"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-cream/60 hover:text-accent transition-colors"
                  >
                    Instagram ↗
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@mlbuilder.com"
                    className="font-body text-sm text-cream/60 hover:text-accent transition-colors"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="mt-12 pt-6 border-t-2 border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-body text-cream/30 text-xs">
              © 2026 MLBuilder. All rights reserved.
            </p>
            <p className="font-body text-cream/30 text-xs italic">
              built solo, shared openly
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
