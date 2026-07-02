import { auth } from '@/lib/auth';
import { getAutomation } from '@/lib/content/automation';
import { streamCodeZip } from '@/lib/content/zip';
import { prisma } from '@/lib/prisma';
import { trackServer } from '@/lib/analytics/track';
import { PassThrough } from 'stream';

const downloadRateLimitMap = new Map<string, number[]>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;
  
  const userTimestamps = downloadRateLimitMap.get(userId) || [];
  const recentTimestamps = userTimestamps.filter((t) => t > oneMinuteAgo);
  
  if (recentTimestamps.length >= 10) {
    return false;
  }
  
  recentTimestamps.push(now);
  downloadRateLimitMap.set(userId, recentTimestamps);
  return true;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string; slug: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = session.user.id;

  // Rate limiting check: max 10 downloads per minute per user
  if (!checkRateLimit(userId)) {
    return new Response('Too Many Requests. Max 10 downloads per minute.', { status: 429 });
  }

  const { category, slug } = await params;

  // Validate the category and slug exist
  const automation = await getAutomation(category, slug);
  if (!automation) {
    return new Response('Not Found', { status: 404 });
  }

  // Increment download counter atomically in Prisma DB
  try {
    await prisma.contentDownloadCount.upsert({
      where: {
        contentType_contentSlug_categorySlug: {
          contentType: 'AUTOMATION',
          contentSlug: slug,
          categorySlug: category,
        },
      },
      create: {
        contentType: 'AUTOMATION',
        contentSlug: slug,
        categorySlug: category,
        downloadCount: 1,
      },
      update: {
        downloadCount: { increment: 1 },
      },
    });
  } catch (error) {
    console.error('Error updating download count:', error);
    // Don't fail the user download if DB update fails
  }

  // Log tracking event server-side
  await trackServer('automation_download_completed', userId, {
    category,
    slug,
    userId,
  });

  // Stream ZIP directly
  const stream = new PassThrough();
  streamCodeZip(category, slug, stream).catch((err) => {
    console.error('Error generating code zip stream:', err);
  });

  const webStream = new ReadableStream({
    start(controller) {
      stream.on('data', (chunk) => controller.enqueue(chunk));
      stream.on('end', () => controller.close());
      stream.on('error', (err) => controller.error(err));
    },
  });

  return new Response(webStream, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${slug}-mlbuilder.zip"`,
    },
  });
}
