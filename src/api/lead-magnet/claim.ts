/**
 * POST /api/lead-magnet/claim
 *
 * Next.js App Router API route (reference implementation).
 * Move to app/api/lead-magnet/claim/route.ts when migrating to Next.js.
 *
 * Dependencies: resend, zod, @prisma/client
 */

import { z } from 'zod';
// import { PrismaClient } from '@prisma/client';
// import { Resend } from 'resend';
// import { getLeadMagnetDeliveryEmailHtml } from '@/emails/LeadMagnetDeliveryEmail';

// const prisma = new PrismaClient();
// const resend = new Resend(process.env.RESEND_API_KEY);

const claimSchema = z.object({
  email: z.string().email(),
  slug: z.string().min(1),
  source: z.string().optional(),
});

// ── Simple in-memory rate limiter ──
// TODO: Replace with Upstash/Redis for production scale
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5; // Slightly higher than newsletter — this is a conversion endpoint
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    // Rate limit
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (isRateLimited(ip)) {
      return Response.json({ error: 'Too many requests. Try again in a minute.' }, { status: 429 });
    }

    // Validate
    const body = await request.json();
    const parsed = claimSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "That email doesn't look right." }, { status: 400 });
    }

    void parsed.data; // Used in production (commented out below)

    // Look up lead magnet
    // const magnet = await prisma.leadMagnet.findUnique({ where: { slug } });
    // if (!magnet || magnet.status !== 'PUBLISHED') {
    //   return Response.json({ error: 'This resource is not available.' }, { status: 404 });
    // }

    // Create claim with download token
    // const downloadToken = crypto.randomUUID();
    // const claim = await prisma.leadMagnetClaim.create({
    //   data: {
    //     email: email.toLowerCase(),
    //     leadMagnetId: magnet.id,
    //     source: source || null,
    //     downloadToken,
    //   },
    // });

    // Handle newsletter subscription in parallel
    // ── Import shared helper from /lib/newsletter.ts ──
    // const { alreadySubscribed } = await createOrUpdateSubscriber(email, 'lead-magnet');

    // Send delivery email
    // await resend.emails.send({
    //   from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    //   to: email,
    //   subject: `Your free guide: ${magnet.title}`,
    //   html: getLeadMagnetDeliveryEmailHtml({
    //     title: magnet.title,
    //     downloadToken,
    //     siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    //     alreadySubscribed: false,
    //   }),
    // });

    // await prisma.leadMagnet.update({
    //   where: { id: magnet.id },
    //   data: { downloadCount: { increment: 1 } },
    // });

    return Response.json({ success: true, alreadySubscribed: false });
  } catch {
    return Response.json({ error: 'Something broke on our end. Try again in a minute.' }, { status: 500 });
  }
}
