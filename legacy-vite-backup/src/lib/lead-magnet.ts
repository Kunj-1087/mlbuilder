/**
 * Client-side Lead Magnet service.
 *
 * Simulates the full backend (Prisma + Resend) using localStorage
 * so the demo flow works without a server. In production, replace
 * with real API calls:
 *
 *   POST /api/lead-magnet/claim   { email, slug, source }
 *   GET  /api/lead-magnet/download?token=xxx
 *
 * TODO: Move file storage to Vercel Blob / Cloudflare R2 before
 *       /public bloats past 50MB.
 */

// ── Types ──

export interface LeadMagnet {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  filePath: string;
  fileSizeKb: number;
  pageCount: number | null;
  coverColor: string;
  coverEmoji: string | null;
  whatYouLearn: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LeadMagnetClaim {
  id: string;
  email: string;
  leadMagnetId: string;
  source: string | null;
  downloadToken: string;
  tokenUsedAt: string | null;
  createdAt: string;
}

// ── Storage keys ──

const MAGNETS_KEY = 'mlbuilder_lead_magnets';
const CLAIMS_KEY = 'mlbuilder_lead_magnet_claims';

// ── Seed data ──

const SEED_MAGNETS: LeadMagnet[] = [
  {
    id: 'seed-magnet-001',
    slug: 'n8n-workflows-for-ai-builders',
    title: '10 n8n Workflows Every AI Builder Should Steal',
    tagline: 'Copy-paste automations that save hours. Free.',
    description:
      'Ten production-ready n8n workflows I built for real AI projects — from daily news bots to RAG ingestion pipelines. Import the JSON, plug in your API keys, ship.',
    filePath: '/lead-magnets/n8n-workflows.pdf',
    fileSizeKb: 1240,
    pageCount: 18,
    coverColor: 'navy',
    coverEmoji: '⚡',
    whatYouLearn: [
      '10 ready-to-import n8n workflow JSONs',
      'Setup walkthrough for each one — what it does, what it costs',
      'Free-tier API keys you can use without paying',
      'How to fork and customise for your own use case',
      'Bonus: my exact prompt templates for the LLM nodes',
    ],
    status: 'PUBLISHED',
    downloadCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ── Helpers ──

function getMagnets(): LeadMagnet[] {
  try {
    const stored = localStorage.getItem(MAGNETS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // fall through
  }
  // Initialize with seed
  localStorage.setItem(MAGNETS_KEY, JSON.stringify(SEED_MAGNETS));
  return [...SEED_MAGNETS];
}

function saveMagnets(magnets: LeadMagnet[]) {
  localStorage.setItem(MAGNETS_KEY, JSON.stringify(magnets));
}

function getClaims(): LeadMagnetClaim[] {
  try {
    return JSON.parse(localStorage.getItem(CLAIMS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveClaims(claims: LeadMagnetClaim[]) {
  localStorage.setItem(CLAIMS_KEY, JSON.stringify(claims));
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Format fileSizeKb to human-readable (e.g. "1.2 MB" or "800 KB") */
export function formatFileSize(kb: number): string {
  if (kb >= 1000) {
    return `${(kb / 1000).toFixed(1)} MB`;
  }
  return `${kb} KB`;
}

/** Get cover text color that contrasts with the cover background */
export function getCoverTextColor(coverColor: string): string {
  return coverColor === 'beige' ? 'text-ink' : 'text-cream';
}

// ── Public API ──

/** Get all PUBLISHED lead magnets */
export function getPublishedMagnets(): LeadMagnet[] {
  return getMagnets().filter((m) => m.status === 'PUBLISHED');
}

/** Get a single lead magnet by slug */
export function getMagnetBySlug(slug: string): LeadMagnet | undefined {
  return getMagnets().find((m) => m.slug === slug);
}

/** Get the first published magnet (for featured strips) */
export function getFirstPublishedMagnet(): LeadMagnet | null {
  const published = getPublishedMagnets();
  return published.length > 0 ? published[0] : null;
}

/** Count of published magnets */
export function getPublishedMagnetCount(): number {
  return getPublishedMagnets().length;
}

export type ClaimResult =
  | { success: true; alreadySubscribed: boolean; downloadToken: string }
  | { success: false; error: string };

/**
 * Claim a lead magnet by email.
 * Simulates the full backend flow:
 * 1. Validates email + slug
 * 2. Creates a claim record with download token
 * 3. Handles newsletter subscription (reuses newsletter.ts logic)
 * 4. Returns the download token for the delivery email
 */
export async function claimLeadMagnet(
  email: string,
  slug: string,
  source: string = 'free-landing',
): Promise<ClaimResult> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 700));

  if (!email.trim() || !isValidEmail(email)) {
    return { success: false, error: "That email doesn't look right." };
  }

  const magnets = getMagnets();
  const magnet = magnets.find((m) => m.slug === slug);

  if (!magnet || magnet.status !== 'PUBLISHED') {
    return { success: false, error: 'This resource is not available right now.' };
  }

  // Create claim with download token
  const downloadToken = crypto.randomUUID();
  const claim: LeadMagnetClaim = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    leadMagnetId: magnet.id,
    source,
    downloadToken,
    tokenUsedAt: null,
    createdAt: new Date().toISOString(),
  };

  const claims = getClaims();
  claims.push(claim);
  saveClaims(claims);

  // Handle newsletter subscription (mirrors newsletter.ts logic)
  const SUBSCRIBERS_KEY = 'mlbuilder_subscribers';
  let subscribers: Array<{
    id: string;
    email: string;
    status: string;
    confirmationToken: string;
    source: string;
    createdAt: string;
    confirmedAt?: string;
  }>;

  try {
    subscribers = JSON.parse(localStorage.getItem(SUBSCRIBERS_KEY) || '[]');
  } catch {
    subscribers = [];
  }

  let alreadySubscribed = false;
  const existing = subscribers.find((s) => s.email === email.toLowerCase());

  if (existing) {
    alreadySubscribed = existing.status === 'CONFIRMED';
    // PENDING → resend confirmation (no-op in demo)
    // UNSUBSCRIBED → do NOT auto-resubscribe (respect their choice)
    // CONFIRMED → already good
  } else {
    // New subscriber
    subscribers.push({
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      status: 'PENDING',
      confirmationToken: crypto.randomUUID(),
      source: 'lead-magnet',
      createdAt: new Date().toISOString(),
    });
  }

  localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(subscribers));

  return { success: true, alreadySubscribed, downloadToken };
}

/**
 * Exchange a download token for the file.
 * Simulates the backend download route.
 * Returns the download URL for the PDF.
 */
export function getDownloadUrl(token: string): string | null {
  const claims = getClaims();
  const claim = claims.find((c) => c.downloadToken === token);

  if (!claim) return null;

  const magnets = getMagnets();
  const magnet = magnets.find((m) => m.id === claim.leadMagnetId);

  if (!magnet) return null;

  // Increment download count
  magnet.downloadCount += 1;
  saveMagnets(magnets);

  // Mark token as used (analytics only — don't invalidate)
  claim.tokenUsedAt = new Date().toISOString();
  saveClaims(claims);

  return magnet.filePath;
}

/** Get claims for a magnet (analytics helper) */
export function getClaimsForMagnet(slug: string): LeadMagnetClaim[] {
  const magnet = getMagnetBySlug(slug);
  if (!magnet) return [];
  return getClaims().filter((c) => c.leadMagnetId === magnet.id);
}
