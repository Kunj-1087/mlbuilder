/**
 * Client-side newsletter subscription service.
 *
 * In production, replace the simulated logic below with real API calls:
 *   POST /api/newsletter/subscribe  { email, source }
 *   GET  /api/newsletter/confirm?token=xxx
 *
 * The simulated version stores subscribers in localStorage so the
 * full UI flow (subscribe → confirm → welcome) works in the demo.
 */

interface Subscriber {
  id: string;
  email: string;
  status: 'PENDING' | 'CONFIRMED' | 'UNSUBSCRIBED';
  confirmationToken: string;
  source: string;
  createdAt: string;
  confirmedAt?: string;
}

const STORAGE_KEY = 'mlbuilder_subscribers';

function getSubscribers(): Subscriber[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveSubscribers(subs: Subscriber[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export type SubscribeResult =
  | { success: true; message: string }
  | { success: false; error: string };

/**
 * Subscribe an email to the newsletter.
 * Simulates the full API route logic:
 * - Validates email format
 * - Handles duplicate emails (CONFIRMED / PENDING / UNSUBSCRIBED)
 * - Creates PENDING subscriber with confirmation token
 */
export async function subscribeNewsletter(email: string, source: string): Promise<SubscribeResult> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 700));

  if (!email.trim() || !isValidEmail(email)) {
    return { success: false, error: "That email doesn't look right." };
  }

  const subscribers = getSubscribers();
  const existing = subscribers.find((s) => s.email === email.toLowerCase());

  if (existing) {
    if (existing.status === 'CONFIRMED') {
      return { success: true, message: "You're already on the list." };
    }

    if (existing.status === 'PENDING') {
      return { success: true, message: "Check your inbox — we just resent the confirmation link." };
    }

    // UNSUBSCRIBED → resubscribe
    if (existing.status === 'UNSUBSCRIBED') {
      existing.status = 'PENDING';
      existing.confirmationToken = crypto.randomUUID();
      saveSubscribers(subscribers);
      return { success: true, message: "Check your inbox — confirmation link just landed." };
    }
  }

  // New subscriber
  const subscriber: Subscriber = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    status: 'PENDING',
    confirmationToken: crypto.randomUUID(),
    source,
    createdAt: new Date().toISOString(),
  };

  subscribers.push(subscriber);
  saveSubscribers(subscribers);

  return { success: true, message: "Check your inbox — confirmation link just landed." };
}

/**
 * Confirm a subscription via token.
 * Called from the /newsletter/confirmed page (simulates GET /api/newsletter/confirm?token=xxx).
 */
export function confirmSubscription(token: string): { success: boolean; message: string } {
  const subscribers = getSubscribers();
  const sub = subscribers.find((s) => s.confirmationToken === token);

  if (!sub) {
    return { success: false, message: 'Invalid token.' };
  }

  if (sub.status === 'CONFIRMED') {
    return { success: true, message: 'Already confirmed.' };
  }

  sub.status = 'CONFIRMED';
  sub.confirmedAt = new Date().toISOString();
  sub.confirmationToken = ''; // Clear token — single use
  saveSubscribers(subscribers);

  return { success: true, message: 'Confirmed.' };
}

/**
 * Get the subscription status for an email.
 * Returns the subscriber object or null if not found.
 */
export function getSubscriberStatus(email: string): Subscriber | null {
  const subscribers = getSubscribers();
  return subscribers.find((s) => s.email === email.toLowerCase()) || null;
}

/**
 * Unsubscribe an email from the newsletter.
 * Marks as UNSUBSCRIBED (doesn't hard-delete — keeps for analytics).
 */
export function unsubscribeFromNewsletter(email: string): { success: boolean; error?: string } {
  const subscribers = getSubscribers();
  const sub = subscribers.find((s) => s.email === email.toLowerCase());

  if (!sub) {
    return { success: false, error: 'No subscription found for that email.' };
  }

  if (sub.status === 'UNSUBSCRIBED') {
    return { success: true };
  }

  sub.status = 'UNSUBSCRIBED';
  sub.confirmationToken = '';
  saveSubscribers(subscribers);
  return { success: true };
}
