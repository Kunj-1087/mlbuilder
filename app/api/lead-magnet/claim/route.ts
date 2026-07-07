import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { z } from 'zod';

const claimSchema = z.object({
  email: z.string().email(),
  slug: z.string().min(1),
  source: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = claimSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
    }

    const { email, slug, source } = parsed.data;

    // Look up lead magnet
    const magnet = await prisma.leadMagnet.findUnique({
      where: { slug },
    });

    if (!magnet) {
      return NextResponse.json({ error: 'This resource is not available.' }, { status: 404 });
    }

    // 1. Create lead magnet claim record
    const downloadToken = crypto.randomUUID();
    await prisma.leadMagnetClaim.create({
      data: {
        email: email.toLowerCase(),
        leadMagnetId: magnet.id,
        source: source || null,
        downloadToken,
      },
    });

    // 2. Send delivery email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    await sendEmail({
      to: email.toLowerCase(),
      subject: `Your ${magnet.title} download`,
      html: `<p>Click <a href="${siteUrl}/api/lead-magnet/download?token=${downloadToken}">here</a> to download your file.</p>`,
    });

    // 3. Handle newsletter subscription
    const existingSub = await prisma.subscriber.findUnique({
      where: { email: email.toLowerCase() },
    });

    let alreadySubscribed = false;

    if (existingSub) {
      alreadySubscribed = existingSub.status === 'CONFIRMED';
    } else {
      const confirmToken = crypto.randomUUID();
      await prisma.subscriber.create({
        data: {
          email: email.toLowerCase(),
          status: 'PENDING',
          confirmationToken: confirmToken,
          source: 'lead-magnet',
        },
      });

      // Send confirmation email
      await sendEmail({
        to: email.toLowerCase(),
        subject: 'Confirm your subscription',
        html: `<p>Confirm your subscription by clicking <a href="${siteUrl}/newsletter/confirmed?token=${confirmToken}">here</a>.</p>`,
      });
    }

    // Increment download count
    await prisma.leadMagnet.update({
      where: { id: magnet.id },
      data: { downloadCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, alreadySubscribed });
  } catch (error) {
    console.error('Error claiming lead magnet:', error);
    return NextResponse.json({ error: 'Something broke on our end. Try again in a minute.' }, { status: 500 });
  }
}
