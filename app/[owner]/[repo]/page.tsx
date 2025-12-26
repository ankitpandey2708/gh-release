import { Suspense } from 'react';
import { DashboardContent } from '@/components/DashboardContent';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { owner, repo } = await params;
  const repoFullName = `${owner}/${repo}`;
  const title = `${repoFullName} - Release History & Analytics`;
  const description = `Visualize release history and patterns for ${repoFullName}. Track release frequency, trends, and statistics for this GitHub repository with interactive charts and analytics.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${owner}/${repo}`,
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${repoFullName} Release Analytics`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: `/${owner}/${repo}`,
    },
  };
}

export default async function RepoPage({ params }: PageProps) {
  const { owner, repo } = await params;
  const repoFullName = `${owner.toLowerCase()}/${repo.toLowerCase()}`;

  return (
    <Suspense fallback={
      <main className="min-h-screen px-4 py-8 md:px-8 flex flex-col items-center bg-gray-50">
        <h1 className="text-3xl font-bold mb-8 text-neutral-900">GitHub releases dashboard</h1>
        <LoadingSkeleton />
      </main>
    }>
      <DashboardContent initialRepo={repoFullName} />
    </Suspense>
  );
}
