import { MetadataRoute } from 'next';
import { getAllCategories, getAutomationsByCategory } from '@/lib/content/automation';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mlbuilder.in';

  // 1. Core static routes
  const staticPaths = [
    '',
    '/about',
    '/automation',
    '/research',
    '/tools',
    '/blog',
    '/blog/community',
    '/free',
    '/newsletter',
    '/privacy',
  ];

  const staticRoutes = staticPaths.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Dynamic automation category routes
  let categoryRoutes: MetadataRoute.Sitemap = [];
  let automationRoutes: MetadataRoute.Sitemap = [];

  try {
    const categories = await getAllCategories();
    
    categoryRoutes = categories.map((cat) => ({
      url: `${baseUrl}/automation/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // 3. Dynamic automation detail routes
    for (const cat of categories) {
      const automations = await getAutomationsByCategory(cat.slug);
      for (const auto of automations) {
        automationRoutes.push({
          url: `${baseUrl}/automation/${cat.slug}/${auto.slug}`,
          lastModified: auto.lastUpdated ? new Date(auto.lastUpdated) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        });
      }
    }
  } catch (error) {
    console.error('Failed to generate dynamic sitemap routes:', error);
  }

  return [...staticRoutes, ...categoryRoutes, ...automationRoutes];
}
