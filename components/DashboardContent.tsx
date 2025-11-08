'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { RepoInput } from '@/components/RepoInput';
import { StatsGrid } from '@/components/StatsGrid';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ProgressBar } from '@/components/ProgressBar';
import { useReleases } from '@/lib/hooks/useReleases';
import { saveRecentSearch } from '@/lib/localStorage';

const ReleaseChart = dynamic(
  () => import('@/components/ReleaseChart').then(m => ({ default: m.ReleaseChart })),
  {
    loading: () => <div className="h-64 md:h-96 bg-gray-100 rounded animate-pulse" />,
    ssr: false,
  }
);

interface DashboardContentProps {
  initialRepo?: string;
}

export function DashboardContent({ initialRepo }: DashboardContentProps = {}) {
  const router = useRouter();
  const [repo, setRepoState] = useState<string | null>(initialRepo || null);
  const { data, loading, error, cached } = useReleases(repo);
  const [showPreReleases, setShowPreReleases] = useState(true);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Initialize with initialRepo if provided
  useEffect(() => {
    if (initialRepo) {
      setRepoState(initialRepo);
    }
  }, [initialRepo]);

  // Save to recent searches only after successful fetch
  useEffect(() => {
    if (data && repo && !error) {
      saveRecentSearch(repo);
    }
  }, [data, repo, error]);

  // Update URL when repo changes - use path-based routing
  const setRepo = (newRepo: string | null) => {
    setRepoState(newRepo);
    if (newRepo) {
      // Convert owner/repo to /owner/repo path
      const [owner, repoName] = newRepo.split('/');
      router.push(`/${owner}/${repoName}`);
    } else {
      router.push('/');
    }
  };

  const filteredData = data?.filter(r => {
    if (!showPreReleases && r.prerelease) return false;
    if (startDate && new Date(r.date) < new Date(startDate)) return false;
    if (endDate && new Date(r.date) > new Date(endDate)) return false;
    return true;
  });

  const exportToCSV = () => {
    if (!filteredData) return;

    const csvContent = [
      ['Version', 'Date', 'Pre-release'].join(','),
      ...filteredData.map(r => [
        r.version,
        new Date(r.date).toISOString().split('T')[0],
        r.prerelease ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${repo?.replace('/', '-')}-releases.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main id="main" className="min-h-screen p-8 flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <ProgressBar loading={loading} />
      <ThemeToggle />
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold animate-fadeIn">GitHub Releases Dashboard</h1>
        {cached && (
          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
            Cached
          </span>
        )}
      </div>
      <RepoInput onSubmit={setRepo} loading={loading} />
      {data && !loading && data.length > 0 && (
        <div className="mt-4 w-full max-w-2xl space-y-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showPreReleases}
              onChange={(e) => setShowPreReleases(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span>Show pre-releases</span>
          </label>
          <div className="flex gap-4 items-center text-sm">
            <label className="flex items-center gap-2">
              <span>From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-1 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </label>
            <label className="flex items-center gap-2">
              <span>To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-1 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </label>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear dates
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="px-3 py-1 text-sm bg-green-500 dark:bg-green-600 text-white rounded hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
            >
              Export CSV
            </button>
          </div>
        </div>
      )}
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
      {filteredData && !loading && filteredData.length === 0 && data && data.length > 0 && (
        <div className="mt-8 w-full max-w-4xl p-8 bg-yellow-50 dark:bg-yellow-900/20 rounded text-center">
          <h3 className="font-bold mb-2">No Releases Match Filters</h3>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      )}
      {filteredData && !loading && filteredData.length > 0 && (
        <div className="mt-8 w-full max-w-4xl space-y-8">
          <StatsGrid releases={filteredData} />
          <ReleaseChart releases={filteredData} />
        </div>
      )}
    </main>
  );
}
