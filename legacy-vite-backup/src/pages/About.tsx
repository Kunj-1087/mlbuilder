import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '@/lib/brand/constants';
import SeoHead from '@/components/seo/SeoHead';
import { PersonSchema } from '@/components/seo/JsonLd';
import PillButton from '@/components/PillButton';
import { WrenchIcon, FlaskIcon, StarIcon } from '@/components/icons/PillarIcons';
import { InstagramIcon, EnvelopeIcon } from '@/components/community/icons';

/* ─── Stats ─── */
const stats = [
  { value: 'Day 1', label: 'Posting since' },
  { value: '1', label: 'Builder' },
  { value: '3', label: 'Active pillars' },
  { value: '₹0', label: 'To access' },
];

/* ─── Pillar data ─── */
const pillars = [
  {
    title: 'Automation',
    description: 'Step-by-step workflows, scripts, and case studies — stuff you can actually run, not just read about.',
    icon: <WrenchIcon size={28} />,
  },
  {
    title: 'Research',
    description: 'Papers digested in plain English, reading lists curated, insights that connect to things you can actually do.',
    icon: <FlaskIcon size={28} />,
  },
  {
    title: 'Tools',
    description: 'Free tools built to solve real problems. No paywalls, no upgrade screens, no catch.',
    icon: <StarIcon size={28} />,
  },
];

/* ─── Tech stack for ticker ─── */
const techStack = [
  'NEXT.JS', 'REACT', 'TYPESCRIPT', 'TAILWIND', 'POSTGRESQL', 'PRISMA',
  'NEXTAUTH', 'RESEND', 'VERCEL', 'RAILWAY', 'CURSOR', 'CLAUDE', 'GEMINI FLASH', 'N8N',
];

/* ─── Social links ─── */
const socials = [
  {
    name: 'Instagram',
    handle: BRAND.social.instagramHandle,
    href: BRAND.social.instagram,
    external: true,
    icon: <InstagramIcon size={32} />,
  },
  {
    name: 'Newsletter',
    handle: 'weekly drop',
    href: '/newsletter',
    external: false,
    icon: <EnvelopeIcon size={32} />,
  },
  {
    name: 'Portfolio',
    handle: BRAND.social.portfolio,
    href: BRAND.social.portfolio,
    external: true,
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    name: 'Email',
    handle: BRAND.social.email,
    href: `mailto:${BRAND.social.email}`,
    external: false,
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 4L12 13L2 4" />
      </svg>
    ),
  },
];

/* ═══════════════════════════════════════════════════════════
   ABOUT PAGE
   ═══════════════════════════════════════════════════════════ */
export default function About() {
  const [hasRealImage, setHasRealImage] = useState(false);

  useEffect(() => {
    fetch('/founder.jpg')
      .then((res) => {
        if (res.ok) return res.text();
        throw new Error();
      })
      .then((text) => {
        if (text.trim() !== 'stub') {
          setHasRealImage(true);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <SeoHead
        title="About"
        description="MLBuilder is built solo by Kunj Nakrani — a second-year college student in Gujarat, India, building AI automation tools, research breakdowns, and free tools in public."
        path="/about"
        type="profile"
      />
      <PersonSchema />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* ═══════════════════════════════════════════════════════
            SECTION 1 — Hero
        ═══════════════════════════════════════════════════════ */}
        <section>
          {/* Eyebrow */}
          <p className="font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-ink mb-4">
            § MLBUILDER / ABOUT
          </p>

          {/* Headline — alternating colors */}
          <h1 className="font-display text-[60px] sm:text-7xl md:text-8xl lg:text-9xl xl:text-[140px] leading-[0.95] tracking-tight mb-4">
            <span className="block">
              <span className="text-accent">HI</span>{' '}
              <span className="text-ink">I'M KUNJ.</span>
            </span>
            <span className="block">
              <span className="text-ink">BUILDING</span>{' '}
              <span className="text-accent">SOLO</span>
              <span className="text-ink">.</span>
            </span>
          </h1>

          {/* Script subtext */}
          <p className="font-script text-ink text-[22px] sm:text-2xl md:text-[26px] leading-snug max-w-xl mb-0">
            Second-year college student in Gujarat, India — building AI automation tools in public while studying.
          </p>

          {/* Divider */}
          <div className="h-[2px] bg-ink mt-12" />
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 2 — Founder
        ═══════════════════════════════════════════════════════ */}
        <section className="mt-12">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">

            {/* Left — Photo */}
            <div className="flex-shrink-0 flex flex-col items-center lg:items-start">
              <div
                className="
                  w-full max-w-[400px] aspect-square
                  border-2 border-ink rounded-sharp
                  shadow-[8px_8px_0_#111111]
                  overflow-hidden
                  relative
                "
                style={{
                  backgroundImage: !hasRealImage ? `
                    repeating-linear-gradient(
                      45deg,
                      #EFEAD8,
                      #EFEAD8 20px,
                      #F5F1E6 20px,
                      #F5F1E6 40px
                    )
                  ` : 'none',
                  backgroundColor: '#EFEAD8',
                }}
              >
                {hasRealImage ? (
                  <img src={BRAND.assets.founderPhoto} className="w-full h-full object-cover" alt="Kunj Nakrani" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 opacity-40">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                      <p className="font-body text-ink/40 text-sm font-medium">Add /public/founder.jpg</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Caption */}
              <p className="font-script text-muted text-[16px] mt-3 text-center lg:text-left">
                Kunj Nakrani · Surat, Gujarat
              </p>
            </div>

            {/* Right — Story */}
            <div className="max-w-2xl">
              <p className="font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-ink mb-5">
                § THE STORY
              </p>

              <p className="font-body text-ink text-base leading-[1.6] mb-5">
                I'm Kunj — I'm 19, studying computer engineering at a college in Surat, and I spend most of my free time building things with AI. Not the "raise funding and scale" kind of building — the "sit with a laptop at 2 AM, vibe-code a workflow in Cursor, and ship it by morning" kind. That's actually how most of MLBuilder gets built. I write prompts, Claude and Gemini help me think through the logic, and I stitch it together into something real.
              </p>

              <p className="font-body text-ink text-base leading-[1.6] mb-5">
                MLBuilder started because I kept running into the same wall: AI content online is either a research paper I can't parse or an Instagram reel that's 90% hype and 10% substance. I wanted somewhere that cuts through both — real automation breakdowns, research in plain language, tools that actually work. I couldn't find it, so I'm building it. The Instagram page (@mlbuilder.py) came first — just me posting what I was learning. People started following, so I figured, might as well make a proper home for all of it.
              </p>

              <p className="font-body text-ink text-base leading-[1.6]">
                Right now, the site is live but the content is still filling in. Some sections have placeholder cards, some are actual posts I've written. It's early — I'm not going to pretend otherwise. But I'm shipping new stuff every week: automation workflows, research digests, tool builds. If you want to watch it grow (or help shape what comes next), sign up or follow along on Instagram. I post about what I'm building almost every day.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 3 — Stats
        ═══════════════════════════════════════════════════════ */}
        <section className="mt-24">
          <p className="font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-ink mb-6">
            § BY THE NUMBERS
          </p>
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-[52px] leading-none text-accent">{s.value}</div>
                <div className="font-body text-[14px] text-ink mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 4 — Why MLBuilder Exists
        ═══════════════════════════════════════════════════════ */}
        <section className="mt-24">
          <p className="font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-ink mb-3">
            § WHY MLBUILDER EXISTS
          </p>

          <h2 className="font-display text-[40px] text-ink leading-[1.05] mb-5 max-w-xl">
            AI IS MOVING FAST. MOST OF IT IS NOISE.
          </h2>

          <div className="max-w-2xl mb-10">
            <p className="font-body text-ink text-base leading-[1.6] mb-4">
              The three pillars — Automation, Research, Tools — aren't random categories I picked from a SaaS playbook. They're the three things I kept looking for and couldn't find in one place. Every AI hub either goes deep on one thing or skims the surface of everything. I wanted a site that does both: real depth on each pillar, but all under one roof.
            </p>
            <p className="font-body text-ink text-base leading-[1.6]">
              This is what a curious tech-student wants in one place — so instead of waiting for someone else to build it, MLBuilder is my attempt. It might not have everything yet, but the scaffolding is up and I'm filling it in every week.
            </p>
          </div>

          {/* Pillar cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="
                  border-2 border-ink rounded-sharp bg-cream
                  shadow-hard p-6
                  transition-all duration-150
                  hover:shadow-hard-lg hover:-translate-y-[2px]
                "
              >
                <div className="text-ink mb-3">{p.icon}</div>
                <h3 className="font-display text-[22px] text-ink mb-2">{p.title}</h3>
                <p className="font-body text-muted text-sm leading-[1.5]">{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 5 — Tech Stack
        ═══════════════════════════════════════════════════════ */}
        <section className="mt-24">
          <p className="font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-ink mb-2">
            § BUILT WITH
          </p>
          <p className="font-script text-muted text-xl mb-6">No magic — just the tools I actually use.</p>

          {/* Ticker bar */}
          <div className="ticker-container border-y-[3px] border-ink bg-cream overflow-hidden py-4">
            <div className="animate-ticker flex w-max">
              {techStack.map((item, i) => (
                <span key={i} className="flex items-center whitespace-nowrap">
                  <span className="font-body text-[13px] font-semibold tracking-[0.18em] text-ink">{item}</span>
                  <span className="text-accent text-sm mx-4">•</span>
                </span>
              ))}
              {techStack.map((item, i) => (
                <span key={`dup-${i}`} className="flex items-center whitespace-nowrap">
                  <span className="font-body text-[13px] font-semibold tracking-[0.18em] text-ink">{item}</span>
                  <span className="text-accent text-sm mx-4">•</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 6 — Connect
        ═══════════════════════════════════════════════════════ */}
        <section className="mt-24">
          <p className="font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-ink mb-3">
            § CONNECT
          </p>
          <h2 className="font-display text-[36px] text-ink mb-2">FIND ME HERE.</h2>
          <p className="font-script text-muted text-xl mb-8">Pick whichever you actually use.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[720px]">
            {socials.map((s) => {
              const cardClass = `
                flex items-center gap-4
                border-2 border-ink rounded-sharp bg-cream
                shadow-hard p-5
                transition-all duration-150
                hover:shadow-hard-lg hover:-translate-y-[2px]
              `;

              const inner = (
                <>
                  <div className="text-ink flex-shrink-0">{s.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-[20px] text-ink leading-none">{s.name}</div>
                    <div className="font-script text-muted text-[16px] truncate">{s.handle}</div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink flex-shrink-0">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              );

              return s.external ? (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className={cardClass}>
                  {inner}
                </a>
              ) : (
                <Link key={s.name} to={s.href} className={cardClass}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 7 — Final CTA
        ═══════════════════════════════════════════════════════ */}
        <section className="mt-24 pb-8">
          <div className="border-2 border-ink rounded-sharp bg-cream shadow-hard p-12 md:p-16 text-center">
            <h2 className="font-display text-[48px] text-ink leading-[1.05] mb-3">
              BUILD ALONGSIDE ME.
            </h2>
            <p className="font-script text-ink text-[22px] max-w-md mx-auto mb-8 leading-relaxed">
              Whether you want the inbox version or the daily reels — I'm publishing in both.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PillButton to="/sign-up" variant="primary" size="lg">
                Get Started →
              </PillButton>
              <a
                href={BRAND.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PillButton variant="ghost" size="lg">
                  Follow on Instagram →
                </PillButton>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
