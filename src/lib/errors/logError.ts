/**
 * Lightweight error logger for MLBuilder.
 *
 * Logs to console.error with structured output and sends to PostHog analytics.
 */
import { track, EVENTS } from '@/lib/analytics/track';

export function logError(error: Error, context?: Record<string, unknown>) {
  console.error('[MLBuilder Error]', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });

  // Wire to analytics (track() silently no-ops if PostHog isn't initialized)
  track(EVENTS.API_ERROR_CAUGHT, {
    error_message: error.message,
    error_digest: error.stack?.split('\n')[1]?.trim() || error.message,
    ...context,
  });
}
