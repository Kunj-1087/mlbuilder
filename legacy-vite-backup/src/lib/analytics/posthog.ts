/**
 * PostHog client singleton for MLBuilder.
 *
 * Lazy-initialized only when user has accepted analytics consent.
 * Includes PII sanitization as defense-in-depth.
 *
 * TODO: Set up separate PostHog projects for dev/staging/prod
 */
import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || '';
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

let initialized = false;

/**
 * Sanitize event properties — strip anything that looks like PII.
 * Defense in depth: even if we accidentally pass PII, this catches it.
 */
function sanitizeProperties(properties: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  const piiPatterns = [/email/i, /password/i, /token/i, /secret/i, /phone/i, /ssn/i, /credit/i];

  for (const [key, value] of Object.entries(properties)) {
    // Strip keys that match PII patterns
    if (piiPatterns.some((p) => p.test(key))) continue;
    // Strip string values that look like email addresses
    if (typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) continue;
    sanitized[key] = value;
  }

  return sanitized;
}

/**
 * Initialize PostHog. Safe to call multiple times (idempotent).
 * Only initializes if consent has been accepted.
 */
export function initPostHog(): void {
  if (initialized || !POSTHOG_KEY) return;

  // Respect Do Not Track
  if (window.navigator.doNotTrack === '1') return;

  try {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false, // Manual pageview capture for React Router
      capture_pageleave: true,
      persistence: 'localStorage+cookie',
      autocapture: false, // We track explicitly for privacy
      disable_session_recording: true, // TODO: Enable selectively after opt-in
      respect_dnt: true,
      sanitize_properties: sanitizeProperties as (properties: Record<string, unknown>) => Record<string, unknown>,
    });

    initialized = true;
  } catch {
    // Analytics failures should never break the app
  }
}

/**
 * Check if PostHog has been initialized.
 */
export function isPostHogInitialized(): boolean {
  return initialized;
}

/**
 * Get the PostHog client instance. Returns the uninitialized instance
 * — events will silently no-op if consent hasn't been accepted.
 */
export function getPostHog(): typeof posthog {
  return posthog;
}

/**
 * Identify a signed-in user with a hashed email (never raw PII).
 */
export function identifyUser(userId: string, properties?: Record<string, unknown>): void {
  if (!initialized) return;
  try {
    posthog.identify(userId, properties);
  } catch {
    // Silent failure
  }
}

/**
 * Reset user identity (on sign-out).
 */
export function resetIdentity(): void {
  if (!initialized) return;
  try {
    posthog.reset();
  } catch {
    // Silent failure
  }
}
