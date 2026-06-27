/**
 * GET /api/newsletter/confirm?token=xxx
 *
 * Next.js App Router API route (reference implementation).
 * Move to app/api/newsletter/confirm/route.ts when migrating to Next.js.
 *
 * Dependencies: @prisma/client, resend
 */

// import { PrismaClient } from '@prisma/client';
// import { Resend } from 'resend';
// import { getWelcomeEmailHtml } from '@/emails/WelcomeEmail';

// const prisma = new PrismaClient();
// const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return Response.redirect(new URL('/newsletter/error', request.url));
    }

    // Look up subscriber by token
    // const subscriber = await prisma.subscriber.findUnique({
    //   where: { confirmationToken: token },
    // });

    // if (!subscriber) {
    //   return Response.redirect(new URL('/newsletter/error', request.url));
    // }

    // if (subscriber.status === 'CONFIRMED') {
    //   return Response.redirect(new URL('/newsletter/confirmed', request.url));
    // }

    // Confirm the subscriber
    // await prisma.subscriber.update({
    //   where: { id: subscriber.id },
    //   data: {
    //     status: 'CONFIRMED',
    //     confirmedAt: new Date(),
    //     confirmationToken: null, // Clear token — single use
    //   },
    // });

    // Send welcome email
    // await sendWelcomeEmail(subscriber.email);

    return Response.redirect(new URL('/newsletter/confirmed', request.url));
  } catch {
    return Response.redirect(new URL('/newsletter/error', request.url));
  }
}

// async function sendWelcomeEmail(email: string) {
//   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
//   const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
//   const html = getWelcomeEmailHtml({ email, siteUrl });
//
//   await resend.emails.send({
//     from: fromEmail,
//     to: email,
//     subject: "You're in. Here's what's coming.",
//     html,
//   });
// }
