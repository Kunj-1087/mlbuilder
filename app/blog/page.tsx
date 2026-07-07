import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { blogPosts } from '@/lib/data/blogPosts';
import BlogPageClient, { type BlogPostMapped } from './BlogPageClient';

export const metadata: Metadata = {
  title: 'MLBuilder Blog — Tech Insights & Guides',
  description: 'Articles, step-by-step guides, and developer stories covering AI automation, engineering best practices, and operations scaling.',
  alternates: {
    canonical: 'https://mlbuilder.in/blog',
  },
};

export default async function Page() {
  let mappedPosts: BlogPostMapped[] = [];

  try {
    const dbPosts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });

    if (dbPosts.length > 0) {
      mappedPosts = dbPosts.map((post) => {
        const categoryFormatted = post.category.charAt(0).toUpperCase() + post.category.slice(1);
        return {
          slug: post.id,
          title: post.title,
          excerpt: post.excerpt || '',
          coverColor: 'bg-cover-navy',
          coverTextColor: 'text-cream',
          coverTitle: post.title,
          coverKeywords: post.category,
          coverTag: post.category.toUpperCase(),
          categories: [post.category.toUpperCase()],
          footerTag: categoryFormatted,
          filterCategory: categoryFormatted,
        };
      });
    }
  } catch (error) {
    console.error('Error fetching blog posts from DB:', error);
  }

  // Fall back to static mock blog posts if DB is empty or connection fails
  if (mappedPosts.length === 0) {
    mappedPosts = blogPosts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      coverColor: post.coverColor,
      coverTextColor: post.coverTextColor,
      coverTitle: post.coverTitle,
      coverKeywords: post.coverKeywords,
      coverTag: post.coverTag,
      categories: post.categories,
      footerTag: post.footerTag,
      filterCategory: post.filterCategory,
    }));
  }

  return <BlogPageClient initialPosts={mappedPosts} />;
}
