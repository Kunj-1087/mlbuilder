import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
    }

    const { email, source } = parsed.data;

    // Check existing subscriber
    const existing = await prisma.subscriber.findUnique({
      where: { email: email.toLowerCase() },
    });

    const token = crypto.randomUUID();

    if (existing) {
      if (existing.status === 'CONFIRMED') {
        return NextResponse.json({ success: true, message: "You're already on the list." });
      }
      if (existing.status === 'PENDING') {
        // Resend confirmation email
        await sendConfirmationEmail(email.toLowerCase(), existing.confirmationToken!);
        return NextResponse.json({ success: true, message: "Check your inbox — we just resent the confirmation link." });
      }
      if (existing.status === 'UNSUBSCRIBED') {
        await prisma.subscriber.update({
          where: { email: email.toLowerCase() },
          data: { status: 'PENDING', confirmationToken: token },
        });
        await sendConfirmationEmail(email.toLowerCase(), token);
        return NextResponse.json({ success: true, message: "Check your inbox — confirmation link just landed." });
      }
    }

    // New subscriber
    await prisma.subscriber.create({
      data: {
        email: email.toLowerCase(),
        status: 'PENDING',
        confirmationToken: token,
        source: source || null,
      },
    });

    await sendConfirmationEmail(email.toLowerCase(), token);

    return NextResponse.json({ success: true, message: "Check your inbox — confirmation link just landed." });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: 'Something broke on our end. Try again in a minute.' }, { status: 500 });
  }
}

async function sendConfirmationEmail(email: string, token: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const html = `<p>Confirm your subscription by clicking <a href="${siteUrl}/newsletter/confirmed?token=${token}">here</a>.</p>`;

  await sendEmail({
    to: email,
    subject: 'Confirm your subscription',
    html,
  });
}
