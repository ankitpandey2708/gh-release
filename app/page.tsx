'use client';

import { RepoInput } from '@/components/RepoInput';

export default function Home() {
  const handleSubmit = (repo: string) => {
    console.log('Repo:', repo);
  };

  return (
    <main className="min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">GitHub Releases Dashboard</h1>
      <RepoInput onSubmit={handleSubmit} />
    </main>
  );
}
