import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/account/',
        '/forgot-password/',
        '/reset-password/',
        '/sign-in/',
        '/sign-up/',
        '/api/',
      ],
    },
    sitemap: 'https://mlbuilder.in/sitemap.xml',
  };
}
