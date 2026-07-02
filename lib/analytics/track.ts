/**
 * Centralized event tracking utility for MLBuilder.
 *
 * All analytics events flow through track(). If consent hasn't been
 * accepted, calls silently no-op. Standard UTM + device properties
 * are auto-attached to every event.
 *
 * Event naming convention: snake_case (PostHog standard).
 * All events are defined in this file for consistency.
 */
import { getPostHog, isPostHogInitialized } from './posthog';

// ── UTM parameter extraction (cached per session) ──
let cachedUTM: Record<string, string> | null = null;

function getUTMParams(): Record<string, string> {
  if (cachedUTM) return cachedUTM;

  const params = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const utm: Record<string, string> = {};

  for (const key of utmKeys) {
    const val = params.get(key);
    if (val) {
      utm[key] = val;
      // Persist for session duration
      sessionStorage.setItem(key, val);
    } else {
      const stored = sessionStorage.getItem(key);
      if (stored) utm[key] = stored;
    }
  }

  cachedUTM = utm;
  return utm;
}

/**
 * Derive device type from viewport width.
 */
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const w = window.innerWidth;
  if (w < 640) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Core tracking function. Silently no-ops if PostHog isn't initialized.
 *
 * @example
 * track('newsletter_subscribe_attempted', { source: 'homepage', variant: 'card' })
 * track('bookmark_added', { item_type: 'blog', item_id: 'n8n-workflows' })
 */
export function track(eventName: string, properties?: Record<string, unknown>): void {
  if (!isPostHogInitialized()) return;

  try {
    const ph = getPostHog();
    const baseProperties: Record<string, unknown> = {
      device_type: getDeviceType(),
      ...getUTMParams(),
    };

    ph.capture(eventName, {
      ...baseProperties,
      ...properties,
    });
  } catch {
    // Analytics failures should never break the app
  }
}

// ═══════════════════════════════════════════════════════════
// STANDARDIZED EVENT NAMES
// Use these exact strings everywhere — consistency matters
// for funnel analysis in PostHog.
// ═══════════════════════════════════════════════════════════

// ── Authentication events ──
export const EVENTS = {
  // Auth
  AUTH_SIGNUP_STARTED: 'auth_signup_started',
  AUTH_SIGNUP_COMPLETED: 'auth_signup_completed',
  AUTH_SIGNIN_STARTED: 'auth_signin_started',
  AUTH_SIGNIN_COMPLETED: 'auth_signin_completed',
  AUTH_SIGNOUT: 'auth_signout',
  AUTH_ACCOUNT_DELETED: 'auth_account_deleted',

  // Newsletter
  NEWSLETTER_FORM_VIEWED: 'newsletter_form_viewed',
  NEWSLETTER_SUBSCRIBE_ATTEMPTED: 'newsletter_subscribe_attempted',
  NEWSLETTER_SUBSCRIBE_SUCCEEDED: 'newsletter_subscribe_succeeded',
  NEWSLETTER_SUBSCRIBE_FAILED: 'newsletter_subscribe_failed',

  // Lead magnet
  LEAD_MAGNET_VIEWED: 'lead_magnet_viewed',
  LEAD_MAGNET_FORM_VIEWED: 'lead_magnet_form_viewed',
  LEAD_MAGNET_CLAIM_ATTEMPTED: 'lead_magnet_claim_attempted',
  LEAD_MAGNET_CLAIM_SUCCEEDED: 'lead_magnet_claim_succeeded',

  // Bookmark
  BOOKMARK_ADDED: 'bookmark_added',
  BOOKMARK_REMOVED: 'bookmark_removed',
  BOOKMARK_NOTE_ADDED: 'bookmark_note_added',
  SAVED_ITEMS_VIEWED: 'saved_items_viewed',

  // Search
  SEARCH_MODAL_OPENED: 'search_modal_opened',
  SEARCH_QUERY_SUBMITTED: 'search_query_submitted',
  SEARCH_RESULT_CLICKED: 'search_result_clicked',
  SEARCH_NO_RESULTS: 'search_no_results',

  // Content
  BLOG_POST_VIEWED: 'blog_post_viewed',
  BLOG_FILTER_CHANGED: 'blog_filter_changed',
  PILLAR_PAGE_VIEWED: 'pillar_page_viewed',
  FREE_RESOURCES_VIEWED: 'free_resources_viewed',
  LEAD_MAGNET_CARD_CLICKED: 'lead_magnet_card_clicked',

  // Navigation / CTA
  CTA_CLICKED: 'cta_clicked',
  EXTERNAL_LINK_CLICKED: 'external_link_clicked',
  NAVBAR_LINK_CLICKED: 'navbar_link_clicked',
  FOOTER_LINK_CLICKED: 'footer_link_clicked',

  // Error
  ERROR_PAGE_VIEWED: 'error_page_viewed',
  API_ERROR_CAUGHT: 'api_error_caught',

  // Consent
  CONSENT_ACCEPTED: 'consent_accepted',
  CONSENT_REJECTED: 'consent_rejected',
} as const;

/**
 * Server-side event tracking utility using PostHog HTTP Capture API.
 */
export async function trackServer(
  eventName: string,
  userId: string,
  properties?: Record<string, unknown>
): Promise<void> {
  const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || '';
  const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

  if (!POSTHOG_KEY) return;

  try {
    const baseProperties = {
      $lib: 'node',
      distinct_id: userId,
    };

    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        event: eventName,
        properties: {
          ...baseProperties,
          ...properties,
        },
      }),
    });
  } catch (error) {
    console.error('Server-side PostHog tracking error:', error);
  }
}

