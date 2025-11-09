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
      <main className="min-h-screen px-4 py-8 md:px-8 flex flex-col items-center bg-gray-50">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">GitHub releases dashboard</h1>
        <LoadingSkeleton />
      </main>
    }>
      <DashboardContent initialRepo={repoFullName} />
    </Suspense>
  );
}
