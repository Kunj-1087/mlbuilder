/**
 * POST /api/newsletter/subscribe
 *
 * Next.js App Router API route (reference implementation).
 * Move to app/api/newsletter/subscribe/route.ts when migrating to Next.js.
 *
 * Dependencies: resend, zod, @prisma/client
 */

import { z } from 'zod';
// import { PrismaClient } from '@prisma/client';
// import { Resend } from 'resend';
// import { getConfirmationEmailHtml } from '@/emails/ConfirmationEmail';

// const prisma = new PrismaClient();
// const resend = new Resend(process.env.RESEND_API_KEY);

const subscribeSchema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

// ── Simple in-memory rate limiter ──
// TODO: Replace with Upstash/Redis for production scale
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
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
    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "That email doesn't look right." }, { status: 400 });
    }

    const { email: _email, source: _source } = parsed.data;
    void _email; void _source; // Used in production (commented out below)

    // Check existing subscriber
    // const existing = await prisma.subscriber.findUnique({ where: { email } });

    // if (existing) {
    //   if (existing.status === 'CONFIRMED') {
    //     return Response.json({ message: "You're already on the list." });
    //   }
    //   if (existing.status === 'PENDING') {
    //     // Resend confirmation email
    //     await sendConfirmationEmail(email, existing.confirmationToken!);
    //     return Response.json({ message: "Check your inbox — we just resent the confirmation link." });
    //   }
    //   if (existing.status === 'UNSUBSCRIBED') {
    //     const token = crypto.randomUUID();
    //     await prisma.subscriber.update({
    //       where: { email },
    //       data: { status: 'PENDING', confirmationToken: token },
    //     });
    //     await sendConfirmationEmail(email, token);
    //     return Response.json({ message: "Check your inbox — confirmation link just landed." });
    //   }
    // }

    // New subscriber
    // const token = crypto.randomUUID();
    // await prisma.subscriber.create({
    //   data: { email, status: 'PENDING', confirmationToken: token, source: source || null },
    // });
    // await sendConfirmationEmail(email, token);

    return Response.json({ message: "Check your inbox — confirmation link just landed." });
  } catch {
    return Response.json({ error: 'Something broke on our end. Try again in a minute.' }, { status: 500 });
  }
}

// async function sendConfirmationEmail(email: string, token: string) {
//   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
//   const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
//   const html = getConfirmationEmailHtml({ confirmationToken: token, siteUrl });
//
//   await resend.emails.send({
//     from: fromEmail,
//     to: email,
//     subject: 'Confirm your MLBuilder subscription',
//     html,
//   });
// }
