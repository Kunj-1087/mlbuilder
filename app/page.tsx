"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { WebSiteSchema } from "@/components/seo/JsonLd";
import TickerBar from "@/components/TickerBar";
import NewsletterForm from "@/components/NewsletterForm";
import FeaturedLeadMagnetStrip from "@/components/lead-magnet/FeaturedLeadMagnetStrip";
import { WrenchIcon, FlaskIcon, StarIcon } from "@/components/icons/PillarIcons";

/* ─── Play Button Icon (decorative) ─── */
function PlayIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="opacity-[0.18]">
      <circle cx="16" cy="16" r="14.5" stroke="#111111" strokeWidth="1.5" />
      <path d="M13 10.5L22 16L13 21.5Z" fill="#111111" />
    </svg>
  );
}

/* ─── Scattered play-button positions (hand-placed feel) ─── */
const playPositions = [
  { top: "6%", left: "4%" },
  { top: "12%", left: "82%" },
  { top: "30%", left: "10%" },
  { top: "22%", left: "68%" },
  { top: "48%", left: "90%" },
  { top: "55%", left: "6%" },
  { top: "42%", left: "52%" },
  { top: "68%", left: "75%" },
  { top: "72%", left: "28%" },
  { top: "85%", left: "60%" },
];

/* ─── Stat box data (honest, early-stage) ─── */
const stats = [
  { value: "1", label: "Person building" },
  { value: "3", label: "Pillars" },
  { value: "100%", label: "Open access" },
  { value: "$0", label: "To start" },
];

/* ─── Pillar card data ─── */
const pillars = [
  {
    title: "Automation",
    description: "Workflows, scripts, and case studies — stuff you can actually run, not just read about.",
    to: "/automation/workflows",
    icon: <WrenchIcon />,
  },
  {
    title: "Research",
    description: "Papers digested in plain English, curated reading lists, and insights that connect research to things you can actually do.",
    to: "/research/papers",
    icon: <FlaskIcon />,
  },
  {
    title: "Tools",
    description: "Free tools built to solve real problems. No paywalls, no hidden upgrade screens, no catch.",
    to: "/tools/free",
    icon: <StarIcon />,
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <WebSiteSchema />

      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — Hero
          Layering: grid bg (z-0) → play icons (z-10) → content (z-20)
      ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* ── Layer 0: Graph-paper grid ── */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(17,17,17,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.12) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
          }}
        />

        {/* ── Layer 1: Scattered play-button icons ── */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {playPositions.map((pos, i) => (
            <div
              key={i}
              className="absolute"
              style={{ top: pos.top, left: pos.left }}
            >
              <PlayIcon />
            </div>
          ))}
        </div>

        {/* ── Layer 2: Hero content ── */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 md:pt-16 md:pb-14 text-center">
          {/* Pill label */}
          <div className="inline-flex items-center gap-2 border-2 border-ink rounded-pill px-4 py-1.5 bg-cream mb-6 md:mb-8">
            <span className="text-accent text-xs">▶</span>
            <span className="font-body text-[11px] font-semibold tracking-[0.14em] uppercase text-ink">
              New drop every week
            </span>
          </div>

          {/* ── Headline: 3 lines, massive poster type ── */}
          <h1 className="font-display text-[2.75rem] sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] leading-[0.88] tracking-tight mb-4 md:mb-6">
            <span className="block text-ink">CUT THE NOISE</span>
            <span className="block text-ink">BUILD FOR REAL</span>
            <span className="block">
              <span className="inline-block bg-accent px-5 py-1 sm:px-7 sm:py-2 -rotate-2 text-ink">
                AI THAT SHIPS
              </span>
            </span>
          </h1>

          {/* ── Script subheadline ── */}
          <p className="font-script text-ink text-xl sm:text-2xl md:text-[28px] mb-8 md:mb-10">
            Automation, research, and tools — minus the fluff.
          </p>

          {/* ── Stat boxes ── */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 md:mb-10">
            {stats.map((s) => (
              <div
                key={s.label}
                className="w-[140px] h-[90px] border-2 border-ink rounded-sharp bg-cream flex flex-col items-center justify-center"
              >
                <span className="font-display text-2xl sm:text-3xl text-ink leading-none">{s.value}</span>
                <span className="font-script text-muted text-sm mt-1">{s.label}</span>
              </div>
            ))}
          </div>

          {/* ── Featured lead magnet strip ── */}
          <div className="mb-6">
            <FeaturedLeadMagnetStrip />
          </div>

          {/* ── CTA row ── */}
          <div className="flex flex-wrap justify-center gap-3">
            {user ? (
              <Link
                href="/automation/workflows"
                className="
                  inline-flex items-center justify-center
                  font-body font-semibold text-base
                  rounded-pill border-2 border-ink
                  bg-accent text-ink
                  shadow-hard
                  hover:shadow-hard-lg hover:-translate-y-[2px]
                  transition-all duration-150
                  px-8 py-3.5
                "
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  className="
                    inline-flex items-center justify-center
                    font-body font-semibold text-base
                    rounded-pill border-2 border-ink
                    bg-accent text-ink
                    shadow-hard
                    hover:shadow-hard-lg hover:-translate-y-[2px]
                    transition-all duration-150
                    px-8 py-3.5
                  "
                >
                  Get Started →
                </Link>
                <Link
                  href="/automation"
                  className="
                    inline-flex items-center justify-center
                    font-body font-semibold text-base
                    rounded-pill border-2 border-ink
                    bg-cream text-ink
                    shadow-hard
                    hover:shadow-hard-lg hover:-translate-y-[2px]
                    transition-all duration-150
                    px-8 py-3.5
                  "
                >
                  Explore Automation
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — Ticker Bar
          Cream fill, ink borders, ink text, pause on hover
      ═══════════════════════════════════════════════════════ */}
      <TickerBar />

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 — Pillar Cards
          Thin border, sharp corners, cream fill, hard shadow
      ═══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="mb-10">
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-2">What's inside</h2>
          <p className="font-body text-muted text-lg">Three pillars. Everything behind a free sign-in — no paywalls after that.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="
                border-2 border-ink rounded-sharp bg-cream
                shadow-hard p-8
                transition-all duration-150
                hover:shadow-hard-lg hover:-translate-y-[2px]
              "
            >
              {/* Icon */}
              <div className="text-ink mb-4">{p.icon}</div>

              {/* Title */}
              <h3 className="font-display text-[28px] text-ink mb-2">{p.title}</h3>

              {/* Description */}
              <p className="font-body text-muted text-sm leading-relaxed mb-4">{p.description}</p>

              {/* Sign-in link */}
              {!user && (
                <Link
                  href="/sign-in"
                  className="font-body text-muted text-sm font-medium hover:text-accent transition-colors inline-flex items-center gap-1"
                >
                  Sign in to explore
                  <span className="text-accent">→</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4 — Newsletter
      ═══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="flex justify-center">
          <NewsletterForm
            variant="card"
            source="homepage"
            heading="GET THE WEEKLY DROP."
            subheading="Build logs, research notes, tool drops — straight to your inbox."
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5 — Final CTA
      ═══════════════════════════════════════════════════════ */}
      {!user && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
          <div className="bg-ink border-2 border-ink rounded-sharp shadow-hard-lg p-10 md:p-14 text-center">
            <h2 className="font-display text-2xl md:text-4xl text-cream mb-3">
              Make an account. It's free.
            </h2>
            <p className="font-body text-cream/60 text-base md:text-lg max-w-lg mx-auto mb-8 leading-relaxed">
              Everything's behind the sign-in, but it doesn't cost anything. Automation breakdowns, research digests, free tools — it's all there.
            </p>
            <Link
              href="/sign-up"
              className="
                inline-flex items-center justify-center
                font-body font-semibold text-lg
                rounded-pill border-2 border-ink
                bg-accent text-ink
                shadow-hard
                hover:shadow-hard-lg hover:-translate-y-[2px]
                transition-all duration-150
                px-8 py-3.5
              "
            >
              Get Started →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
