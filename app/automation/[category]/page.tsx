import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategory } from '@/lib/content/automation';
import CategoryListingClient from './CategoryListingClient';
import { DisplayHeading, SectionHeading, Body, ScriptText, Label, Eyebrow } from '@/components/typography';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getCategory(categorySlug);
  if (!category) return {};

  return {
    title: `${category.title} Workflows & Automation`,
    description: category.intro || `Download production-ready workflows for ${category.title}. Step-by-step documentation, clean code patches, and configuration scripts.`,
    alternates: {
      canonical: `https://mlbuilder.in/automation/${categorySlug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = await getCategory(categorySlug);

  if (!category) {
    notFound();
  }

  // Get dynamic headline based on category
  const getHeroHeadline = () => {
    if (categorySlug === 'web-scraping') {
      return (
        <DisplayHeading as="h1" size="lg" className="max-w-4xl mb-4">
          PYTHON <span className="text-accent">SCRAPERS</span> THAT ACTUALLY WORK.
        </DisplayHeading>
      );
    }
    return (
      <DisplayHeading as="h1" size="lg" className="max-w-4xl mb-4">
        PRODUCTION <span className="text-accent">{category.title}</span> WORKFLOWS.
      </DisplayHeading>
    );
  };

  // Get script subtext
  const getHeroSubtext = () => {
    if (categorySlug === 'web-scraping') {
      return "Real automation projects I built and use. Download, customize, ship.";
    }
    return category.intro || "Ready-to-run automation pipelines designed to scale your operations.";
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      {/* Eyebrow Breadcrumbs */}
      <nav className="mb-6 select-none flex items-center gap-1.5">
        <Link href="/automation" className="hover:text-accent transition-colors flex items-center">
          <Eyebrow prefixChar="§">MLBUILDER</Eyebrow>
        </Link>{' '}
        <span className="text-muted text-xs">/</span>{' '}
        <Link href="/automation" className="hover:text-accent transition-colors">
          <Label className="text-body-xs font-bold text-muted hover:text-accent transition-colors">AUTOMATION</Label>
        </Link>{' '}
        <span className="text-muted text-xs">/</span>{' '}
        <Label className="text-body-xs font-bold text-ink">{category.title}</Label>
      </nav>

      {/* Hero Section */}
      <div className="mb-10">
        {getHeroHeadline()}
        <ScriptText size="lg" muted className="max-w-2xl leading-relaxed">
          {getHeroSubtext()}
        </ScriptText>
      </div>

      {/* Stat Row */}
      <div className="flex flex-wrap gap-x-12 gap-y-4 mb-8">
        <div className="flex flex-col">
          <SectionHeading as="span" size="md" className="text-accent leading-none">
            {category.automationCount}
          </SectionHeading>
          <Label className="text-muted text-body-xs font-bold tracking-wider mt-1">
            Automations
          </Label>
        </div>
        <div className="flex flex-col">
          <SectionHeading as="span" size="md" className="text-accent leading-none">
            Python
          </SectionHeading>
          <Label className="text-muted text-body-xs font-bold tracking-wider mt-1">
            Stack
          </Label>
        </div>
        <div className="flex flex-col">
          <SectionHeading as="span" size="md" className="text-accent leading-none">
            Free
          </SectionHeading>
          <Label className="text-muted text-body-xs font-bold tracking-wider mt-1">
            All of them
          </Label>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-t-2 border-ink mb-8" />

      {/* Client listing wrapper */}
      <CategoryListingClient
        categorySlug={categorySlug}
        categoryTitle={category.title}
        automations={category.automations}
      />
    </div>
  );
}
