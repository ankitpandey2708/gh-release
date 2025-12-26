import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://release-history.vercel.app';

  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];

  // Add popular repositories or recent searches
  // You can extend this to include dynamic repositories from your database/cache
  const popularRepos = [
    'facebook/react',
    'microsoft/vscode',
    'vercel/next.js',
    'nodejs/node',
    'typescript-eslint/typescript-eslint',
  ];

  const repoRoutes = popularRepos.map((repo) => ({
    url: `${baseUrl}/${repo}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...repoRoutes];
}
