import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getMagnetBySlug } from '@/lib/lead-magnet';
import LeadMagnetDetailClient from './LeadMagnetDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let title = 'Free Guide — MLBuilder';
  let description = 'Download this free guide to build automation projects.';

  try {
    const magnet = await prisma.leadMagnet.findUnique({ where: { slug } });
    if (magnet) {
      title = `${magnet.title} — Free Guide`;
      description = `${magnet.tagline} — Download your copy from MLBuilder.`;
    } else {
      const staticMagnet = getMagnetBySlug(slug);
      if (staticMagnet) {
        title = `${staticMagnet.title} — Free Guide`;
        description = `${staticMagnet.tagline} — Download your copy from MLBuilder.`;
      }
    }
  } catch (error) {
    console.error('Error generating lead magnet metadata:', error);
  }

  return {
    title,
    description,
    alternates: {
      canonical: `https://mlbuilder.in/free/${slug}`,
    },
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sParams = await searchParams;
  const ref = sParams.ref || 'free-landing';

  let magnet = null;

  try {
    const dbMagnet = await prisma.leadMagnet.findUnique({
      where: { slug },
    });

    if (dbMagnet) {
      magnet = {
        id: dbMagnet.id,
        slug: dbMagnet.slug,
        title: dbMagnet.title,
        tagline: dbMagnet.tagline,
        description: dbMagnet.description,
        coverColor: dbMagnet.coverColor,
        coverEmoji: dbMagnet.coverEmoji,
        fileSizeKb: dbMagnet.fileSizeKb,
        pageCount: dbMagnet.pageCount,
        downloadCount: dbMagnet.downloadCount,
        whatYouLearn: dbMagnet.whatYouLearn,
      };
    }
  } catch (error) {
    console.error('Error fetching lead magnet from DB:', error);
  }

  if (!magnet) {
    const staticMagnet = getMagnetBySlug(slug);
    if (staticMagnet) {
      magnet = {
        id: staticMagnet.id,
        slug: staticMagnet.slug,
        title: staticMagnet.title,
        tagline: staticMagnet.tagline,
        description: staticMagnet.description,
        coverColor: staticMagnet.coverColor,
        coverEmoji: staticMagnet.coverEmoji,
        fileSizeKb: staticMagnet.fileSizeKb,
        pageCount: staticMagnet.pageCount,
        downloadCount: staticMagnet.downloadCount,
        whatYouLearn: staticMagnet.whatYouLearn,
      };
    }
  }

  if (!magnet) {
    redirect('/free/error');
  }

  return <LeadMagnetDetailClient magnet={magnet} source={ref} />;
}
