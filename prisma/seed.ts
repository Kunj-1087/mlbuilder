/**
 * Prisma Seed Script — Lead Magnet System
 *
 * Seeds one PUBLISHED LeadMagnet on first run so the system has
 * working content from day one.
 *
 * Run: npx prisma db seed
 * (configured via prisma.seed in package.json)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check if already seeded
  const existing = await prisma.leadMagnet.findUnique({
    where: { slug: 'n8n-workflows-for-ai-builders' },
  });

  if (existing) {
    console.log('Lead magnet already seeded — skipping.');
    return;
  }

  const magnet = await prisma.leadMagnet.create({
    data: {
      slug: 'n8n-workflows-for-ai-builders',
      title: '10 n8n Workflows Every AI Builder Should Steal',
      tagline: 'Copy-paste automations that save hours. Free.',
      description:
        'Ten production-ready n8n workflows I built for real AI projects — from daily news bots to RAG ingestion pipelines. Import the JSON, plug in your API keys, ship.',
      filePath: '/lead-magnets/n8n-workflows.pdf',
      fileSizeKb: 1240,
      pageCount: 18,
      coverColor: 'navy',
      coverEmoji: '⚡',
      whatYouLearn: [
        '10 ready-to-import n8n workflow JSONs',
        'Setup walkthrough for each one — what it does, what it costs',
        'Free-tier API keys you can use without paying',
        'How to fork and customise for your own use case',
        'Bonus: my exact prompt templates for the LLM nodes',
      ],
      status: 'PUBLISHED',
    },
  });

  console.log(`Seeded lead magnet: ${magnet.title} (${magnet.slug})`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
