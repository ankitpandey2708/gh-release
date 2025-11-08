'use client';

import { useState } from 'react';
import { RepoInput } from '@/components/RepoInput';
import { ReleaseChart } from '@/components/ReleaseChart';
import { StatsGrid } from '@/components/StatsGrid';
import { useReleases } from '@/lib/hooks/useReleases';

export default function Home() {
  const [repo, setRepo] = useState<string | null>(null);
  const { data, loading, error } = useReleases(repo);

  return (
    <main className="min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">GitHub Releases Dashboard</h1>
      <RepoInput onSubmit={setRepo} loading={loading} />
      {error && <p className="text-red-600 mt-4">{error}</p>}
      {data && (
        <div className="mt-8 w-full max-w-4xl space-y-8">
          <StatsGrid releases={data} />
          <ReleaseChart releases={data} />
        </div>
      )}
    </main>
  );
}
