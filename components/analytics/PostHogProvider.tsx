"use client";

/**
 * PostHogProvider — wraps the app to provide:
 * - Consent-gated PostHog initialization
 * - Automatic pageview tracking on Next.js navigations
 * - Global click handlers for CTA and external link tracking
 * - User identification on auth state changes
 *
 * This is a Client Component — mounts once in Root Layout.
 */
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  initPostHog,
  isPostHogInitialized,
  identifyUser,
  resetIdentity,
} from '@/lib/analytics/posthog';
import { track, EVENTS } from '@/lib/analytics/track';

const CONSENT_KEY = 'mlbuilder_consent';

/**
 * Simple SHA-256 hash for email identification (never pass raw email).
 */
async function hashEmail(email: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(email.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPath = useRef(pathname);
  const { user } = useAuth();

  // ── Initialize PostHog if consent was previously accepted ──
  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === 'accepted') {
      // Lazy-load: defer until idle or after a short delay
      if ('requestIdleCallback' in window) {
        (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
          initPostHog();
        });
      } else {
        setTimeout(() => initPostHog(), 100);
      }
    }
  }, []);

  // ── Track pageviews on route changes ──
  useEffect(() => {
    if (!isPostHogInitialized()) return;

    const currentSearch = searchParams?.toString() ? `?${searchParams.toString()}` : '';
    // Only track actual navigations (path changed)
    if (pathname !== prevPath.current || currentSearch !== '') {
      track('$pageview', {
        $current_url: window.location.href,
        path: pathname,
        search: currentSearch || undefined,
      });
      prevPath.current = pathname;
    }
  }, [pathname, searchParams]);

  // ── Identify user on auth state change ──
  useEffect(() => {
    if (!isPostHogInitialized()) return;

    if (user) {
      hashEmail(user.email).then((emailHash) => {
        identifyUser(user.id, {
          email_hash: emailHash,
          created_at: user.createdAt,
        });
      });
    } else {
      resetIdentity();
    }
  }, [user]);

  // ── Global click handler for CTA + external link tracking ──
  useEffect(() => {
    if (!isPostHogInitialized()) return;

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        '[data-cta-label], [data-external-link], [data-nav-context]'
      );
      if (!target) return;

      // CTA clicks
      const ctaLabel = target.dataset.ctaLabel;
      if (ctaLabel) {
        track(EVENTS.CTA_CLICKED, {
          cta_label: ctaLabel,
          cta_location: target.dataset.ctaLocation || 'unknown',
          destination_url: (target as HTMLAnchorElement).href || target.dataset.ctaDestination || undefined,
        });
      }

      // External link clicks
      const externalType = target.dataset.externalLink;
      if (externalType) {
        track(EVENTS.EXTERNAL_LINK_CLICKED, {
          url: (target as HTMLAnchorElement).href || '',
          source_page: window.location.pathname,
          link_type: externalType,
        });
      }

      // Nav context clicks
      const navContext = target.dataset.navContext;
      if (navContext) {
        const eventName = navContext === 'navbar'
          ? EVENTS.NAVBAR_LINK_CLICKED
          : EVENTS.FOOTER_LINK_CLICKED;
        track(eventName, {
          link_label: target.textContent?.trim() || '',
          link_destination: (target as HTMLAnchorElement).href || '',
        });
      }
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, []);

  return <>{children}</>;
}
