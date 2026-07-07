/**
 * POST /api/community/vote
 * GET  /api/community/vote
 *
 * Next.js App Router API route (reference implementation).
 * Move to app/api/community/vote/route.ts when migrating to Next.js.
 *
 * Dependencies: @prisma/client, next-auth
 */

// import { PrismaClient } from '@prisma/client';
// import { auth } from '@/auth'; // NextAuth session helper
// const prisma = new PrismaClient();

/**
 * GET — Return the current user's voted platforms
 *
 * export async function GET() {
 *   const session = await auth();
 *   if (!session?.user) {
 *     return Response.json({ error: 'Not authenticated' }, { status: 401 });
 *   }
 *
 *   const votes = await prisma.platformVote.findMany({
 *     where: { userId: session.user.id },
 *     select: { platform: true },
 *   });
 *
 *   return Response.json({ platforms: votes.map(v => v.platform) });
 * }
 */

/**
 * POST — Vote for a platform
 *
 * export async function POST(request: Request) {
 *   const session = await auth();
 *   if (!session?.user) {
 *     return Response.json({ error: 'Not authenticated' }, { status: 401 });
 *   }
 *
 *   const { platform } = await request.json();
 *   if (!platform || !['discord', 'youtube', 'twitter', 'telegram'].includes(platform)) {
 *     return Response.json({ error: 'Invalid platform' }, { status: 400 });
 *   }
 *
 *   try {
 *     // Upsert with composite unique key — idempotent
 *     await prisma.platformVote.upsert({
 *       where: { platform_userId: { platform, userId: session.user.id } },
 *       update: {},
 *       create: { platform, userId: session.user.id },
 *     });
 *
 *     const count = await prisma.platformVote.count({
 *       where: { platform },
 *     });
 *
 *     return Response.json({ count });
 *   } catch {
 *     return Response.json({ error: 'Could not record vote. Try again.' }, { status: 500 });
 *   }
 * }
 */
