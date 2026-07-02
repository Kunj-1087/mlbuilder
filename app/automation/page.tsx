import Link from 'next/link';
import { getCategory } from '@/lib/content/automation';
import { DisplayHeading, SectionHeading, Body, ScriptText, Label, Eyebrow } from '@/components/typography';

export default async function AutomationPillarPage() {
  const webScraping = await getCategory('web-scraping');
  const webScrapingCount = webScraping?.automationCount ?? 0;

  const categories = [
    {
      slug: 'web-scraping',
      title: 'Web Scraping',
      tagline: 'Get clean datasets from public websites without getting blocked.',
      description: 'Production-ready scripts and setups targeting LinkedIn, Google, e-commerce, and directory listings. Includes headless browser scripts, proxy rotations, and dynamic parsing.',
      count: webScrapingCount,
      active: true,
      coverColor: 'bg-cover-navy text-cream',
    },
    {
      slug: 'data-processing',
      title: 'Data Processing',
      tagline: 'Pipelines to structure, clean, and enrich raw information.',
      description: 'Convert messy CSV files, parse complex PDFs, merge disparate sources, and run local data transformations at scale. Built for batch processing pipelines.',
      count: 0,
      active: false,
      coverColor: 'bg-cover-teal text-cream',
    },
    {
      slug: 'ai-workflows',
      title: 'AI Workflows',
      tagline: 'RAG engines, LLM agents, and custom prompt logic.',
      description: 'Connect LLM nodes, manage agent context memories, build vector search indexes, and automate decision trees. Focused on production-grade API integrations.',
      count: 0,
      active: false,
      coverColor: 'bg-cover-maroon text-cream',
    },
    {
      slug: 'api-automations',
      title: 'API Automations',
      tagline: 'Connect apps and orchestrate events.',
      description: 'Custom webhooks, third-party REST API integrations, automated messaging, and backend trigger systems. Built for robust developer utility integrations.',
      count: 0,
      active: false,
      coverColor: 'bg-cover-olive text-cream',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      {/* Eyebrow Breadcrumb */}
      <nav className="mb-6 select-none flex items-center gap-1.5">
        <Link href="/" className="hover:text-accent transition-colors flex items-center">
          <Eyebrow prefixChar="§">MLBUILDER</Eyebrow>
        </Link>{' '}
        <span className="text-muted text-xs">/</span>{' '}
        <Label className="text-body-xs font-bold text-ink">AUTOMATION</Label>
      </nav>

      {/* Hero Header */}
      <div className="mb-12">
        <DisplayHeading as="h1" size="lg" className="max-w-4xl mb-4">
          AUTOMATE the <span className="text-accent">boring</span> stuff.
        </DisplayHeading>
        <ScriptText size="lg" muted className="max-w-2xl leading-relaxed">
          Production-ready code systems, scraping scrapers, and prompt pipelines. Fully documented, downloadable, and designed for builders.
        </ScriptText>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {categories.map((cat) => {
          if (cat.active) {
            return (
              <Link
                key={cat.slug}
                href={`/automation/${cat.slug}`}
                className="
                  border-2 border-ink rounded-sharp bg-cream shadow-hard
                  transition-all duration-150
                  hover:shadow-hard-lg hover:-translate-y-[2px]
                  overflow-hidden flex flex-col h-full group
                "
              >
                {/* Cover area */}
                <div className={`${cat.coverColor} p-8 h-[160px] flex flex-col justify-center border-b-2 border-ink`}>
                  <DisplayHeading as="h3" size="sm" className="mb-2 text-current">{cat.title}</DisplayHeading>
                  <ScriptText size="md" className="opacity-90 leading-tight text-current">{cat.tagline}</ScriptText>
                </div>
                {/* Content area */}
                <div className="p-8 flex flex-col flex-1 bg-cream">
                  <Body size="sm" className="leading-relaxed mb-6 flex-1 text-ink">
                    {cat.description}
                  </Body>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-ink/10">
                    <Label className="text-accent text-body-xs font-bold">
                      {cat.count} {cat.count === 1 ? 'AUTOMATION' : 'AUTOMATIONS'}
                    </Label>
                    <Label className="text-body-sm font-bold text-ink group-hover:text-accent transition-colors">
                      Explore →
                    </Label>
                  </div>
                </div>
              </Link>
            );
          } else {
            return (
              <div
                key={cat.slug}
                className="
                  border-2 border-ink/30 rounded-sharp bg-[#EFEAD8]/50
                  overflow-hidden flex flex-col h-full opacity-60 select-none
                "
              >
                {/* Cover area */}
                <div className="bg-[#EFEAD8] text-muted p-8 h-[160px] flex flex-col justify-center border-b-2 border-ink/20 relative">
                  <DisplayHeading as="h3" size="sm" className="mb-2 text-muted/80">{cat.title}</DisplayHeading>
                  <ScriptText size="md" className="opacity-75 leading-tight text-muted">{cat.tagline}</ScriptText>
                  <Label className="absolute top-4 right-4 px-2 py-0.5 border border-ink/20 rounded bg-cream text-body-xs font-bold text-muted tracking-wider">
                    SOON
                  </Label>
                </div>
                {/* Content area */}
                <div className="p-8 flex flex-col flex-1 bg-cream/30">
                  <Body size="sm" muted className="leading-relaxed mb-6 flex-1">
                    {cat.description}
                  </Body>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-ink/10">
                    <Label className="text-muted text-body-xs font-bold">
                      0 AUTOMATIONS
                    </Label>
                    <Label className="text-muted text-body-sm font-bold">
                      Coming Soon
                    </Label>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
