import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { codeToHtml } from 'shiki';

import { getAutomation, getAutomationsByCategory } from '@/lib/content/automation';
import { prisma } from '@/lib/prisma';
import BookmarkButton from '@/components/bookmarks/BookmarkButton';
import { mdxComponents, AutomationProvider } from '@/lib/content/mdx-components';
import TableOfContentsClient from './TableOfContentsClient';
import CodeFilesViewerClient from './CodeFilesViewerClient';
import { DisplayHeading, SectionHeading, Body, ScriptText, Label, Eyebrow } from '@/components/typography';
import { BlogPostingSchema } from '@/components/seo/JsonLd';

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

// Brand-aligned code theme for Shiki
const brandTheme = {
  name: 'mlbuilder-brand',
  type: 'light',
  colors: {
    'editor.background': '#FBF8F0',
    'editor.foreground': '#111111',
  },
  tokenColors: [
    {
      scope: ['keyword', 'storage.type', 'storage.modifier'],
      settings: { foreground: '#FF6A1A', fontStyle: 'bold' }
    },
    {
      scope: ['string', 'constant'],
      settings: { foreground: '#FF6A1A' }
    },
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: '#6B6B6B', fontStyle: 'italic' }
    },
    {
      scope: ['entity.name.function', 'support.function'],
      settings: { foreground: '#111111', fontStyle: 'bold' }
    }
  ]
};

const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: 'wrap' }] as any,
    [
      rehypePrettyCode,
      {
        theme: brandTheme as any,
        keepBackground: true,
      }
    ] as any
  ] as any
};

export async function generateMetadata({ params }: PageProps) {
  const { category, slug } = await params;
  const automation = await getAutomation(category, slug);
  if (!automation) return {};

  const truncatedDesc = automation.description.slice(0, 155);

  return {
    title: `${automation.title} — MLBuilder`,
    description: truncatedDesc,
    alternates: {
      canonical: `https://mlbuilder.in/automation/${category}/${slug}`,
    },
    openGraph: {
      title: automation.title,
      description: truncatedDesc,
      type: 'article',
      url: `https://mlbuilder.in/automation/${category}/${slug}`,
      publishedTime: automation.frontmatter.publishedAt,
      modifiedTime: automation.frontmatter.updatedAt || automation.frontmatter.publishedAt,
      authors: ['Kunj'],
      tags: automation.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: automation.title,
      description: truncatedDesc,
    }
  };
}

const COVER_COLORS = ['navy', 'black', 'teal', 'beige', 'maroon', 'olive'];
function getCoverColor(slug: string) {
  let sum = 0;
  for (let i = 0; i < slug.length; i++) {
    sum += slug.charCodeAt(i);
  }
  return COVER_COLORS[sum % 6];
}

export default async function AutomationDetailPage({ params }: PageProps) {
  const { category: categorySlug, slug } = await params;
  const automation = await getAutomation(categorySlug, slug);

  if (!automation) {
    notFound();
  }

  // Fetch download count from database
  let downloadCount = 0;
  try {
    const downloadData = await prisma.contentDownloadCount.findUnique({
      where: {
        contentType_contentSlug_categorySlug: {
          contentType: 'AUTOMATION',
          contentSlug: slug,
          categorySlug: categorySlug,
        }
      }
    });
    downloadCount = downloadData?.downloadCount ?? 0;
  } catch (error) {
    console.error('Error fetching download count:', error);
  }

  // Extract headings from MDX for the Table of Contents
  const headings = automation.mdxContent
    .split('\n')
    .filter(line => line.startsWith('## ') || line.startsWith('### '))
    .map(line => {
      const level = line.startsWith('## ') ? 2 : 3;
      const text = line.replace(/^###?\s+/, '').trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return { level, text, id };
    });

  // Calculate code details
  const fileCount = automation.codeFiles.length;
  const totalBytes = automation.codeFiles.reduce((acc, f) => acc + f.content.length, 0);
  const approximateSizeKb = Math.ceil(totalBytes / 1024);

  // Pre-render code files with Shiki syntax highlighting on the server
  const codeFilesWithHighlightHtml = await Promise.all(
    automation.codeFiles.map(async (file) => {
      let highlightedHtml = '';
      try {
        highlightedHtml = await codeToHtml(file.content, {
          lang: file.language,
          theme: brandTheme as any,
        });
      } catch (err) {
        highlightedHtml = `<pre><code>${file.content}</code></pre>`;
      }
      return {
        ...file,
        highlightedHtml,
      };
    })
  );

  // Fetch related automations in same category (excluding current)
  const relatedList = (await getAutomationsByCategory(categorySlug))
    .filter(item => item.slug !== slug)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // Split title into alternating word colors
  const words = automation.title.split(' ');
  const alternateTitle = words.map((word, idx) => (
    <span key={idx} className={idx % 2 === 1 ? 'text-accent' : 'text-ink'}>
      {word}{' '}
    </span>
  ));

  // JSON-LD structured data for HowTo schema
  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": automation.title,
    "description": automation.description,
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "totalTime": automation.estimatedTime.includes('min') ? `PT${parseInt(automation.estimatedTime)}M` : "PT20M",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Preparation",
        "text": "Clone or download the project files and verify your Python environment."
      },
      {
        "@type": "HowToStep",
        "name": "Installation",
        "text": "Install dependencies using pip install -r requirements.txt."
      },
      {
        "@type": "HowToStep",
        "name": "Execution",
        "text": "Run the scraper script main.py."
      }
    ]
  };

  const bookmarkItem = {
    itemType: 'automation' as const,
    itemId: `${categorySlug}/${slug}`,
    itemTitle: automation.title,
    itemExcerpt: automation.excerpt,
    itemUrl: `/automation/${categorySlug}/${slug}`,
    itemCoverColor: getCoverColor(slug),
    itemCoverEmoji: '🕸️',
    itemCategory: categorySlug === 'web-scraping' ? 'Web Scraping' : categorySlug,
  };

  return (
    <AutomationProvider value={{ zipUrl: automation.zipUrl, title: automation.title, category: categorySlug, slug: slug }}>
      <BlogPostingSchema
        title={automation.title}
        description={automation.description}
        slug={`${categorySlug}/${slug}`}
        publishedAt={automation.frontmatter.publishedAt}
        updatedAt={automation.frontmatter.updatedAt}
        tags={automation.tags}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        
        {/* Breadcrumbs */}
        <nav className="mb-6 font-body text-body-xs font-bold tracking-widest text-muted uppercase select-none">
          <Link href="/automation" className="hover:text-accent transition-colors">
            § MLBUILDER
          </Link>{' '}
          /{' '}
          <Link href="/automation" className="hover:text-accent transition-colors">
            AUTOMATION
          </Link>{' '}
          /{' '}
          <Link href={`/automation/${categorySlug}`} className="hover:text-accent transition-colors">
            {categorySlug.toUpperCase()}
          </Link>{' '}
          / <span className="text-ink">{automation.title.toUpperCase()}</span>
        </nav>

        {/* Article Header */}
        <div className="mb-10">
          <DisplayHeading as="h1" size="lg" className="leading-[1.05] uppercase max-w-5xl mb-6">
            {alternateTitle}
          </DisplayHeading>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="inline-block px-2.5 py-0.5 rounded-pill border-2 border-ink bg-accent font-body text-body-xs font-bold uppercase tracking-wider text-ink select-none">
              {automation.difficulty}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-[#EFEAD8] border-2 border-ink font-body text-body-xs font-bold text-ink uppercase tracking-wider select-none">
              ⏱️ {automation.estimatedTime}
            </span>
            <span className="font-body text-body-xs font-bold uppercase text-muted select-none">
              Updated {new Date(automation.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <div className="ml-2">
              <BookmarkButton item={bookmarkItem} variant="icon-label" />
            </div>
          </div>

          <ScriptText size="lg" muted className="max-w-3xl leading-relaxed text-2xl md:text-3xl">
            {automation.excerpt}
          </ScriptText>

          {automation.coverImage && (
            <div className="relative w-full max-w-4xl h-[280px] md:h-[480px] mt-8 rounded-sharp border-2 border-ink shadow-[8px_8px_0_#111111] overflow-hidden">
              <Image
                src={automation.coverImage}
                alt={automation.title}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>

        {/* Divider */}
        <hr className="border-t-2 border-ink my-8" />

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Main Article Column */}
          <div className="flex-1 lg:w-8/12">
            <article className="prose prose-ink max-w-none">
              <MDXRemote
                source={automation.mdxContent}
                components={mdxComponents}
                options={{ mdxOptions }}
              />
            </article>
          </div>

          {/* Right Sticky Sidebar (Desktop Only) */}
          <div className="hidden lg:block lg:w-4/12 relative">
            <aside className="sticky top-24 space-y-6">
              
              {/* Section 1 - Download CTA */}
              <div className="border-2 border-ink rounded-sharp bg-cream p-6 shadow-[4px_4px_0_#111111]">
                <Label className="text-muted mb-1 block">
                  § GET THE CODE
                </Label>
                <SectionHeading as="h3" size="sm" className="mb-3">
                  DOWNLOAD ZIP
                </SectionHeading>
                <Body size="xs" muted className="leading-relaxed mb-4">
                  {fileCount} Python files · requirements.txt · README
                  <br />
                  Total size: ~{approximateSizeKb} KB
                </Body>
                
                <a
                  href={automation.zipUrl}
                  className="block w-full text-center px-5 py-3 border-2 border-ink rounded-pill bg-accent text-ink font-body text-body-sm font-bold shadow-hard-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer select-none"
                >
                  Download .zip →
                </a>
                
                <span className="block text-center font-body text-body-xs text-muted mt-3 font-semibold">
                  {downloadCount} downloads
                </span>
              </div>

              {/* Section 2 - Table of Contents */}
              {headings.length > 0 && (
                <div className="border-2 border-ink rounded-sharp bg-cream p-6 shadow-[4px_4px_0_#111111]">
                  <Label className="text-muted mb-3 block">
                    § ON THIS PAGE
                  </Label>
                  <TableOfContentsClient headings={headings} />
                </div>
              )}

              {/* Section 3 - Metadata Block */}
              <div className="border-2 border-ink rounded-sharp bg-cream p-6 shadow-[4px_4px_0_#111111]">
                <Label className="text-muted mb-4 block">
                  § DETAILS
                </Label>
                <div className="space-y-3 font-body text-body-xs text-ink">
                  <div className="flex justify-between py-2 border-b border-ink/10">
                    <span className="font-semibold uppercase text-muted text-xs">Difficulty</span>
                    <span className="font-bold text-accent uppercase text-xs">{automation.difficulty}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-ink/10">
                    <span className="font-semibold uppercase text-muted text-xs">Setup time</span>
                    <span className="font-bold text-xs">{automation.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-ink/10">
                    <span className="font-semibold uppercase text-muted text-xs">Last updated</span>
                    <span className="font-bold text-xs">{new Date(automation.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  <div className="py-2">
                    <span className="block font-semibold uppercase text-muted text-xs mb-2">Tags</span>
                    <div className="flex flex-wrap gap-1.5">
                      {automation.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-[#EFEAD8] border border-ink/10 font-body text-body-xs font-bold uppercase text-ink">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Collapsible Project Files */}
        {fileCount > 0 && (
          <div className="mt-16">
            <Label className="text-muted mb-1 select-none block">
              § THE FILES IN THIS PROJECT
            </Label>
            <SectionHeading as="h2" size="md" className="mb-2 select-none">
              FULL SOURCE CODE
            </SectionHeading>
            <ScriptText size="md" muted className="mb-6 max-w-xl leading-relaxed">
              Full code inline if you'd rather read than download.
            </ScriptText>

            <CodeFilesViewerClient
              categorySlug={categorySlug}
              automationSlug={slug}
              codeFiles={codeFilesWithHighlightHtml}
            />
          </div>
        )}

        {/* Download CTA (Final Conversion Point) */}
        <div className="max-w-4xl mx-auto mt-12">
          <mdxComponents.DownloadCTA />
        </div>

        {/* Related Automations Section */}
        {relatedList.length > 0 && (
          <div className="mt-20">
            <SectionHeading as="h2" size="sm" className="text-body-xs font-bold text-muted mb-4 select-none block tracking-widest">
              § MORE {categorySlug.replace('-', ' ').toUpperCase()}
            </SectionHeading>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedList.map(auto => {
                const coverColor = getCoverColor(auto.slug);
                const coverItem = {
                  itemType: 'automation' as const,
                  itemId: `${auto.categorySlug}/${auto.slug}`,
                  itemTitle: auto.title,
                  itemExcerpt: auto.excerpt,
                  itemUrl: `/automation/${auto.categorySlug}/${auto.slug}`,
                  itemCoverColor: coverColor,
                  itemCoverEmoji: '🕸️',
                  itemCategory: auto.categorySlug === 'web-scraping' ? 'Web Scraping' : auto.categorySlug,
                };
                return (
                  <div
                    key={auto.slug}
                    className="
                      border-2 border-ink rounded-sharp bg-cream shadow-hard
                      transition-all duration-150
                      hover:shadow-hard-lg hover:-translate-y-[2px]
                      overflow-hidden flex flex-col h-full
                    "
                  >
                    <div className={`bg-cover-${coverColor} ${coverColor === 'beige' ? 'text-ink' : 'text-cream'} relative h-[200px] flex-shrink-0`}>
                      <BookmarkButton item={coverItem} variant="card-corner" />
                      <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                        <SectionHeading as="h3" size="sm" className="leading-tight mb-2 uppercase break-words max-w-full px-2">
                          {auto.title}
                        </SectionHeading>
                        <Body size="xs" className="opacity-75 tracking-wider uppercase">
                          {auto.tags.slice(0, 3).join(' • ')}
                        </Body>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1 bg-cream border-t border-ink/10">
                      <SectionHeading as="h3" size="sm" className="leading-tight mb-2 line-clamp-2 uppercase">
                        {auto.title}
                      </SectionHeading>
                      <ScriptText size="sm" muted className="leading-snug line-clamp-3 mb-4 flex-1">
                        {auto.excerpt}
                      </ScriptText>
                      <div className="flex items-center justify-between mt-auto">
                        <Body size="xs" muted className="font-bold uppercase">
                          {auto.difficulty}
                        </Body>
                        <Link href={`/automation/${auto.categorySlug}/${auto.slug}`} className="text-body-xs font-bold text-accent hover:text-ink transition-colors">
                          Open →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </AutomationProvider>
  );
}
