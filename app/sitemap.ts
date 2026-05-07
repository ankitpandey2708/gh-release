import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];

  const popularRepos = [
    'facebook/react',
    'microsoft/vscode',
    'vercel/next.js',
    'nodejs/node',
    'typescript-eslint/typescript-eslint',
  ];

  const repoRoutes = popularRepos.map((repo) => ({
    url: `${BASE_URL}/${repo}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...repoRoutes];
}
