/**
 * Privacy Policy page for MLBuilder.
 *
 * Written in the founder's voice — honest, no legal filler.
 * Includes cookie/analytics preference management.
 */
import { useState, useEffect } from 'react';
import SeoHead from '@/components/seo/SeoHead';

const CONSENT_KEY = 'mlbuilder_consent';

export default function Privacy() {
  const [consentState, setConsentState] = useState<string>('Not yet decided');

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === 'accepted') setConsentState('Accepted');
    else if (stored === 'rejected') setConsentState('Rejected');
    else setConsentState('Not yet decided');
  }, []);

  const handleChangePreference = () => {
    localStorage.removeItem(CONSENT_KEY);
    window.location.reload();
  };

  return (
    <>
      <SeoHead
        title="Privacy"
        description="How MLBuilder handles your data. Short, honest, no legal filler."
        path="/privacy"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero */}
        <section className="mb-12">
          <p className="font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-ink mb-4">
            § MLBUILDER / PRIVACY
          </p>
          <h1 className="font-display text-[48px] sm:text-6xl md:text-7xl text-ink leading-[0.95] tracking-tight mb-4">
            <span className="text-ink">WHAT </span>
            <span className="text-accent">I TRACK.</span>
            <br />
            <span className="text-ink">AND WHY.</span>
          </h1>
          <p className="font-script text-ink text-xl md:text-2xl leading-snug">
            Plain English. No lawyer phrasing.
          </p>
        </section>

        {/* Sections */}
        <div className="space-y-8">
          {/* What MLBuilder collects */}
          <Section title="WHAT MLBUILDER COLLECTS">
            <ul className="space-y-2 list-disc list-inside font-body text-ink text-[15px] leading-[1.6]">
              <li>Page views, click events, and navigation patterns (via PostHog analytics)</li>
              <li>Form submissions (newsletter signups, lead magnet claims)</li>
              <li>Search queries (to improve content — zero-result queries tell me what to write next)</li>
              <li>Bookmark actions (for your personal library — stored locally, not on a server)</li>
            </ul>
            <p className="font-body text-ink text-[15px] leading-[1.6] mt-3">
              <strong>For signed-in users:</strong> name + email (for the account itself, not tracking).
            </p>
            <p className="font-body text-ink text-[15px] leading-[1.6]">
              <strong>Newsletter subscribers:</strong> just the email.
            </p>
            <p className="font-body text-ink text-[15px] leading-[1.6]">
              <strong>Lead magnet claimers:</strong> email + which file you downloaded.
            </p>
          </Section>

          {/* What MLBuilder does NOT collect */}
          <Section title="WHAT MLBUILDER DOES NOT COLLECT">
            <ul className="space-y-2 list-disc list-inside font-body text-ink text-[15px] leading-[1.6]">
              <li>No selling of data, ever</li>
              <li>No tracking pixels from advertisers</li>
              <li>No reading your email content</li>
              <li>No tracking you across other sites</li>
            </ul>
          </Section>

          {/* Who sees this data */}
          <Section title="WHO SEES THIS DATA">
            <ul className="space-y-2 list-disc list-inside font-body text-ink text-[15px] leading-[1.6]">
              <li><strong>Just me</strong> — Kunj, the solo founder</li>
              <li><strong>PostHog</strong> — the analytics tool I use (SOC 2 compliant, EU servers available)</li>
              <li><strong>Resend</strong> — for sending newsletter emails</li>
              <li>No advertisers, no data brokers, no third parties</li>
            </ul>
          </Section>

          {/* How long it's kept */}
          <Section title="HOW LONG IT'S KEPT">
            <ul className="space-y-2 list-disc list-inside font-body text-ink text-[15px] leading-[1.6]">
              <li><strong>Account data:</strong> as long as you have an account, plus 30 days after deletion</li>
              <li><strong>Analytics events:</strong> 12 months rolling</li>
              <li><strong>Newsletter subscription:</strong> until you unsubscribe</li>
            </ul>
          </Section>

          {/* Your rights */}
          <Section title="YOUR RIGHTS">
            <ul className="space-y-2 list-disc list-inside font-body text-ink text-[15px] leading-[1.6]">
              <li><strong>Right to delete:</strong> contact me, or use Delete Account in /account — full erasure within 30 days</li>
              <li><strong>Right to export:</strong> email me, I'll send you everything within 7 days</li>
              <li><strong>Right to opt out of analytics:</strong> change preference below</li>
            </ul>
          </Section>

          {/* Cookie & analytics preference */}
          <Section title="COOKIE & ANALYTICS PREFERENCE">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-body text-[14px] text-muted">Your current preference:</span>
              <span className={`font-display text-[14px] px-3 py-1 rounded-pill border-2 border-ink ${
                consentState === 'Accepted'
                  ? 'bg-accent text-ink'
                  : consentState === 'Rejected'
                  ? 'bg-ink text-cream'
                  : 'bg-cream text-muted'
              }`}>
                {consentState}
              </span>
            </div>
            <button
              onClick={handleChangePreference}
              className="
                inline-flex items-center justify-center
                font-body font-semibold text-[13px]
                rounded-pill border-2 border-ink
                bg-cream text-ink
                hover:bg-surface
                transition-all duration-150
                cursor-pointer select-none
                px-5 py-2
              "
            >
              Change my preference
            </button>
            <p className="font-body text-muted text-[12px] mt-2">
              This clears your choice and the cookie banner will reappear on next page load.
            </p>
          </Section>

          {/* Questions */}
          <Section title="QUESTIONS">
            <p className="font-body text-ink text-[15px] leading-[1.6]">
              Email me at{' '}
              <a href="mailto:hello@mlbuilder.in" className="text-accent hover:text-ink transition-colors">
                hello@mlbuilder.in
              </a>
              {' '}— I read everything.
            </p>
          </Section>
        </div>

        {/* Footer note */}
        <div className="mt-12 pt-6 border-t-2 border-ink/10">
          <p className="font-body text-muted text-[12px]">
            Last updated: June 27, 2026. Changes will be noted here.
          </p>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-2 border-ink rounded-sharp bg-cream p-6 md:p-8">
      <h2 className="font-display text-[18px] text-ink mb-3">{title}</h2>
      {children}
    </div>
  );
}
