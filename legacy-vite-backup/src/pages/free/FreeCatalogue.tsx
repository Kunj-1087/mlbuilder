import { useEffect } from 'react';
import SeoHead from '@/components/seo/SeoHead';
import LeadMagnetCard from '@/components/lead-magnet/LeadMagnetCard';
import { track, EVENTS } from '@/lib/analytics/track';
import NewsletterForm from '@/components/NewsletterForm';
import { getPublishedMagnets, getPublishedMagnetCount } from '@/lib/lead-magnet';

/* ─── Stats ─── */
const stats = [
  { value: '0₹', label: '/ Forever' },
  { value: 'Anytime', label: '/ Cancel emails' },
];

/* ═══════════════════════════════════════════════════════════
   FREE RESOURCES — CATALOGUE PAGE
   ═══════════════════════════════════════════════════════════ */
export default function FreeCatalogue() {
  const magnets = getPublishedMagnets();
  const count = getPublishedMagnetCount();

  useEffect(() => {
    track(EVENTS.FREE_RESOURCES_VIEWED, {});
  }, []);

  return (
    <>
      <SeoHead
        title="Free Resources"
        description="Free downloadable guides, swipe files, and templates for AI builders. No paywalls, no catch — just useful stuff."
        path="/free"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* ═══════════════════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════════════════ */}
        <section className="mb-0">
          {/* Eyebrow */}
          <p className="font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-ink mb-4">
            § FREE RESOURCES
          </p>

          {/* Headline */}
          <h1 className="font-display text-[60px] sm:text-7xl md:text-8xl lg:text-9xl xl:text-[140px] leading-[0.95] tracking-tight mb-4">
            <span className="block">
              <span className="text-ink">TAKE WHAT</span>{' '}
              <span className="text-accent">YOU NEED.</span>
            </span>
            <span className="block">
              <span className="text-accent">NO STRINGS</span>{' '}
              <span className="text-ink">ATTACHED.</span>
            </span>
          </h1>

          {/* Script subtext */}
          <p className="font-script text-ink text-[22px] sm:text-2xl md:text-[26px] leading-snug max-w-xl mb-8">
            Trade your email for build kits, swipe files and templates I actually use.
          </p>

          {/* Inline stat row */}
          <div className="flex flex-wrap gap-x-12 gap-y-4 mb-0">
            {/* Dynamic count stat */}
            <div>
              <div className="font-display text-[52px] leading-none text-accent">{count}</div>
              <div className="font-body text-[14px] text-ink mt-1">Resources</div>
            </div>
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

        {/* ═══════════════════════════════════════════════════════
            GRID OF LEAD MAGNET CARDS
        ═══════════════════════════════════════════════════════ */}
        <section className="mt-10">
          {magnets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {magnets.map((magnet) => (
                <LeadMagnetCard
                  key={magnet.slug}
                  slug={magnet.slug}
                  title={magnet.title}
                  tagline={magnet.tagline}
                  coverColor={magnet.coverColor}
                  coverEmoji={magnet.coverEmoji}
                  fileSizeKb={magnet.fileSizeKb}
                  pageCount={magnet.pageCount}
                  downloadCount={magnet.downloadCount}
                />
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="text-center py-16">
              <p className="font-script text-muted text-xl mb-8">
                Nothing live yet — first drop is being polished. Check back soon.
              </p>
              <div className="flex justify-center">
                <NewsletterForm
                  variant="card"
                  source="free-empty"
                  heading="GET NOTIFIED."
                  subheading="I'll send you an email when the first resource drops."
                />
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
