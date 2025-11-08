'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { RepoInput } from '@/components/RepoInput';
import { StatsGrid } from '@/components/StatsGrid';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ProgressBar } from '@/components/ProgressBar';
import { useReleases } from '@/lib/hooks/useReleases';

const ReleaseChart = dynamic(
  () => import('@/components/ReleaseChart').then(m => ({ default: m.ReleaseChart })),
  {
    loading: () => <div className="h-64 md:h-96 bg-gray-100 rounded animate-pulse" />,
    ssr: false,
  }
);

export default function Home() {
  const [repo, setRepo] = useState<string | null>(null);
  const { data, loading, error } = useReleases(repo);

  return (
    <main id="main" className="min-h-screen p-8 flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <ProgressBar loading={loading} />
      <ThemeToggle />
      <h1 className="text-3xl font-bold mb-8 animate-fadeIn">GitHub Releases Dashboard</h1>
      <RepoInput onSubmit={setRepo} loading={loading} />
      {error && (
        <div className="mt-8 w-full max-w-4xl">
          <ErrorMessage message={error} onRetry={() => setRepo(null)} />
        </div>
      )}
      {loading && (
        <div className="mt-8">
          <LoadingSkeleton />
        </div>
      )}
      {data && !loading && data.length === 0 && (
        <div className="mt-8 w-full max-w-4xl p-8 bg-blue-50 dark:bg-blue-900 rounded text-center">
          <h3 className="font-bold mb-2">No Releases Found</h3>
          <p className="text-sm">This repo has no releases yet</p>
        </div>
      )}
      {data && !loading && data.length > 0 && (
        <div className="mt-8 w-full max-w-4xl space-y-8">
          <StatsGrid releases={data} />
          <ReleaseChart releases={data} />
        </div>
      )}
    </main>
  );
}
