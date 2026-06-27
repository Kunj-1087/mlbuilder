/**
 * Shared email sending utility for MLBuilder.
 *
 * Wraps Resend API with transactional defaults.
 * All email failures are caught and logged — never throw to caller.
 */
import { Resend } from 'resend';
import { track, EVENTS } from '@/lib/analytics/track';

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || '';
const FROM_EMAIL = import.meta.env.VITE_RESEND_FROM_EMAIL || 'MLBuilder <hello@mlbuilder.in>';
const REPLY_TO = 'Kunj <kunj@mlbuilder.in>';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://mlbuilder.in';

let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend && RESEND_API_KEY) {
    resend = new Resend(RESEND_API_KEY);
  }
  return resend!;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  react: React.ReactNode;
  replyTo?: string;
  headers?: Record<string, string>;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: Error;
}

/**
 * Send a transactional email via Resend.
 * Wraps in try/catch — failures are logged but never thrown.
 */
export async function sendTransactionalEmail({
  to,
  subject,
  react,
  replyTo = REPLY_TO,
  headers = {},
}: SendEmailOptions): Promise<SendEmailResult> {
  try {
    const client = getResend();
    if (!client) {
      console.warn('[MLBuilder Email] Resend not configured — skipping send');
      return { success: false, error: new Error('Resend API key not configured') };
    }

    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      react,
      replyTo,
      headers,
    });

    if (error) {
      console.error('[MLBuilder Email] Send failed:', error);
      track(EVENTS.API_ERROR_CAUGHT, {
        error_message: error.message || 'Email send failed',
        route: 'sendTransactionalEmail',
      });
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('[MLBuilder Email] Send exception:', error);
    track(EVENTS.API_ERROR_CAUGHT, {
      error_message: error.message,
      route: 'sendTransactionalEmail',
    });
    return { success: false, error };
  }
}

/**
 * Generate a full URL with the site base.
 */
export function siteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

/**
 * Mask an email for display (e.g., j****@gmail.com).
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}${'*'.repeat(Math.min(local.length - 2, 4))}${local.slice(-1)}@${domain}`;
}
