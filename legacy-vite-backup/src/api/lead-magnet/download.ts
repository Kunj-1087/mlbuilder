/**
 * GET /api/lead-magnet/download?token=xxx
 *
 * Next.js App Router API route (reference implementation).
 * Move to app/api/lead-magnet/download/route.ts when migrating to Next.js.
 *
 * Dependencies: @prisma/client, fs/promises
 *
 * TODO: Move file storage to Vercel Blob / Cloudflare R2
 *       before /public bloats past 50MB.
 */

// import { PrismaClient } from '@prisma/client';
// import { readFile } from 'fs/promises';
// import { join } from 'path';

// const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return Response.redirect(new URL('/free/error', request.url));
    }

    // Look up claim by download token
    // const claim = await prisma.leadMagnetClaim.findUnique({
    //   where: { downloadToken: token },
    //   include: { leadMagnet: true },
    // });

    // if (!claim) {
    //   return Response.redirect(new URL('/free/error', request.url));
    // }

    // const { leadMagnet } = claim;

    // Read the file from /public
    // const filePath = join(process.cwd(), 'public', leadMagnet.filePath);
    // const fileBuffer = await readFile(filePath);

    // Increment download count
    // await prisma.leadMagnet.update({
    //   where: { id: leadMagnet.id },
    //   data: {
    //     downloadCount: { increment: 1 },
    //     // tokenUsedAt is set but token is NOT invalidated
    //     // — allow re-downloads since users often re-click email links
    //   },
    // });

    // Mark token as used (analytics only)
    // await prisma.leadMagnetClaim.update({
    //   where: { id: claim.id },
    //   data: { tokenUsedAt: new Date() },
    // });

    // Generate slugified filename from title
    // const filename = leadMagnet.title
    //   .toLowerCase()
    //   .replace(/[^a-z0-9]+/g, '-')
    //   .replace(/^-|-$/g, '') + '.pdf';

    // return new Response(fileBuffer, {
    //   headers: {
    //     'Content-Type': 'application/pdf',
    //     'Content-Disposition': `attachment; filename="${filename}"`,
    //   },
    // });

    return Response.redirect(new URL('/free/error', request.url));
  } catch {
    return Response.redirect(new URL('/free/error', request.url));
  }
}
