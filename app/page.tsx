'use client';

import { useState } from 'react';
import { RepoInput } from '@/components/RepoInput';
import { useReleases } from '@/lib/hooks/useReleases';

export default function Home() {
  const [repo, setRepo] = useState<string | null>(null);
  const { data, loading, error } = useReleases(repo);

  return (
    <main className="min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">GitHub Releases Dashboard</h1>
      <RepoInput onSubmit={setRepo} loading={loading} />
      {error && <p className="text-red-600 mt-4">{error}</p>}
      {data && <p className="mt-4">Found {data.length} releases</p>}
    </main>
  );
}
