import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getPublishedMagnets } from '@/lib/lead-magnet';
import FreeCatalogueClient from './FreeCatalogueClient';

export const metadata: Metadata = {
  title: 'Free Resources & Downloadable Guides — MLBuilder',
  description: 'Get free downloadable guides, cheat sheets, and automation setups. Build your project toolbox with actionable PDF resources.',
  alternates: {
    canonical: 'https://mlbuilder.in/free',
  },
};

export default async function Page() {
  let magnets: {
    id: string;
    slug: string;
    title: string;
    tagline: string;
    description: string;
    coverColor: string;
    coverEmoji: string | null;
    fileSizeKb: number;
    pageCount: number | null;
    downloadCount: number;
  }[] = [];

  try {
    const dbMagnets = await prisma.leadMagnet.findMany({
      where: { status: 'PUBLISHED' },
    });

    if (dbMagnets.length > 0) {
      magnets = dbMagnets.map((m) => ({
        id: m.id,
        slug: m.slug,
        title: m.title,
        tagline: m.tagline,
        description: m.description,
        coverColor: m.coverColor,
        coverEmoji: m.coverEmoji,
        fileSizeKb: m.fileSizeKb,
        pageCount: m.pageCount,
        downloadCount: m.downloadCount,
      }));
    }
  } catch (error) {
    console.error('Error fetching lead magnets from DB:', error);
  }

  if (magnets.length === 0) {
    magnets = getPublishedMagnets().map((m) => ({
      id: m.id,
      slug: m.slug,
      title: m.title,
      tagline: m.tagline,
      description: m.description,
      coverColor: m.coverColor,
      coverEmoji: m.coverEmoji,
      fileSizeKb: m.fileSizeKb,
      pageCount: m.pageCount,
      downloadCount: m.downloadCount,
    }));
  }

  return <FreeCatalogueClient initialMagnets={magnets} />;
}
