import { Suspense } from 'react';
import { DashboardContent } from '@/components/DashboardContent';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

interface PageProps {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
}

export default async function RepoPage({ params }: PageProps) {
  const { owner, repo } = await params;
  const repoFullName = `${owner}/${repo}`;

  return (
    <Suspense fallback={
      <main className="min-h-screen p-8 flex flex-col items-center bg-gray-50 dark:bg-gray-900">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">GitHub Releases Dashboard</h1>
        <LoadingSkeleton />
      </main>
    }>
      <DashboardContent initialRepo={repoFullName} />
    </Suspense>
  );
}
