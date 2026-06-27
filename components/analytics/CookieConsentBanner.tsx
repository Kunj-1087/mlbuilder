"use client";

/**
 * CookieConsentBanner — neo-brutalist cookie consent UI for MLBuilder.
 *
 * Shows after 800ms delay on first visit. Stores choice in localStorage
 * under "mlbuilder_consent". Slides up from bottom with 300ms ease.
 * Accept → initializes PostHog. Reject → stays opted-out.
 */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { initPostHog } from '@/lib/analytics/posthog';
import { track, EVENTS } from '@/lib/analytics/track';

const CONSENT_KEY = 'mlbuilder_consent';

type ConsentState = 'accepted' | 'rejected' | null;

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Check consent state on mount, show banner after delay if no choice yet
  useEffect(() => {
    const existing = localStorage.getItem(CONSENT_KEY) as ConsentState;
    if (existing) return; // Already decided

    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    initPostHog(); // Initialize FIRST so the consent event is captured
    track(EVENTS.CONSENT_ACCEPTED, { timestamp: Date.now() });
    setDismissed(true);
    setTimeout(() => setVisible(false), 200);
  };

  const handleReject = () => {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    track(EVENTS.CONSENT_REJECTED, { timestamp: Date.now() });
    setDismissed(true);
    setTimeout(() => setVisible(false), 200);
  };

  if (!visible) return null;

  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        w-full max-w-[720px] mx-4
        transition-all duration-300 ease-out
        ${dismissed ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}
      `}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="bg-cream border-2 border-ink rounded-sharp shadow-[4px_4px_0_#111111] p-5 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {/* Cookie icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <circle cx="12" cy="12" r="10" />
                <circle cx="8" cy="9" r="1" fill="#111111" />
                <circle cx="15" cy="8" r="1" fill="#111111" />
                <circle cx="10" cy="15" r="1" fill="#111111" />
                <circle cx="16" cy="14" r="1" fill="#111111" />
              </svg>
              <h3 className="font-display text-[16px] text-ink">BRIEF NOTE.</h3>
            </div>
            <p className="font-body text-ink text-[13px] leading-[1.5] mb-1">
              I use PostHog to see what's working on MLBuilder — pages viewed, links clicked, that kind of thing.
              Nothing personal stored without you signing in.
            </p>
            <Link
              href="/privacy"
              className="font-body text-muted text-[12px] hover:text-accent transition-colors"
            >
              Learn more →
            </Link>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleAccept}
              className="
                inline-flex items-center justify-center
                font-body font-semibold text-[13px]
                rounded-pill border-2 border-ink
                bg-accent text-ink
                shadow-hard-sm
                hover:shadow-hard hover:-translate-y-[1px]
                transition-all duration-150
                cursor-pointer select-none
                px-5 py-2
              "
            >
              Accept
            </button>
            <button
              onClick={handleReject}
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
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
