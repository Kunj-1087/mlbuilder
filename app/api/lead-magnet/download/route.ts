import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/free/error', request.url));
    }

    // Look up claim by download token
    const claim = await prisma.leadMagnetClaim.findUnique({
      where: { downloadToken: token },
      include: { leadMagnet: true },
    });

    if (!claim) {
      return NextResponse.redirect(new URL('/free/error', request.url));
    }

    const { leadMagnet } = claim;

    // Read the file from /public
    const filePath = path.join(process.cwd(), 'public', leadMagnet.filePath);
    const fileBuffer = await fs.readFile(filePath);

    // Update claim's tokenUsedAt
    await prisma.leadMagnetClaim.update({
      where: { id: claim.id },
      data: { tokenUsedAt: new Date() },
    });

    // Generate filename from title
    const filename = leadMagnet.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '.pdf';

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.redirect(new URL('/free/error', request.url));
  }
}
