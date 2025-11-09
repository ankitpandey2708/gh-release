"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { RepoInput } from "@/components/RepoInput";
import { StatsGrid } from "@/components/StatsGrid";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ProgressBar } from "@/components/ProgressBar";
import { useReleases } from "@/lib/hooks/useReleases";
import { saveRecentSearch } from "@/lib/localStorage";

const ReleaseChart = dynamic(
  () =>
    import("@/components/ReleaseChart").then((m) => ({
      default: m.ReleaseChart,
    })),
  {
    loading: () => (
      <div className="h-64 md:h-96 bg-neutral-100 rounded-md animate-pulse" />
    ),
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
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

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
  // Navigation will mount new component with initialRepo, preventing duplicate fetches
  const setRepo = (newRepo: string | null) => {
    if (newRepo) {
      // Convert owner/repo to /owner/repo path
      const [owner, repoName] = newRepo.split("/");
      router.push(`/${owner}/${repoName}`);
    } else {
      router.push("/");
    }
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setShowPreReleases(true);
    setRepo(null);
  };

  const filteredData = data?.filter((r) => {
    if (!showPreReleases && r.prerelease) return false;
    if (startDate && new Date(r.date) < new Date(startDate)) return false;
    if (endDate && new Date(r.date) > new Date(endDate)) return false;
    return true;
  });

  const exportToCSV = () => {
    if (!filteredData) return;

    const csvContent = [
      ["Version", "Date", "Pre-release"].join(","),
      ...filteredData.map((r) =>
        [
          r.version,
          new Date(r.date).toISOString().split("T")[0],
          r.prerelease ? "Yes" : "No",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${repo?.replace("/", "-")}-releases.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main
      id="main"
      className="min-h-screen px-4 py-8 md:px-8 flex flex-col items-center bg-neutral-50 text-neutral-900 transition-colors duration-200"
    >
      <ProgressBar loading={loading} />

      {/* Header with clear hierarchy */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
        <h1 className="text-h1 font-bold animate-fadeIn">
          GitHub releases dashboard
        </h1>
      </div>

      {/* Primary action area */}
      <RepoInput onSubmit={setRepo} loading={loading} currentRepo={repo} />

      {/* Filters section - grouped with consistent spacing */}
      {data && !loading && data.length > 0 && (
        <div className="mt-4 w-full max-w-4xl">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="flex-1 flex flex-col sm:flex-row gap-2 sm:items-center p-4 bg-white rounded-md border border-neutral-200 relative">
              {(startDate || endDate) && (
                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-700 transition-colors"
                  aria-label="Clear dates"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
              <label className="flex items-center gap-2 text-body">
                <span className="text-neutral-700 font-medium">From:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-3 border border-neutral-300 rounded-md bg-white text-neutral-900 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </label>
              <label className="flex items-center gap-2 text-body">
                <span className="text-neutral-700 font-medium">To:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-3 border border-neutral-300 rounded-md bg-white text-neutral-900 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </label>
            </div>
            <button
              onClick={exportToCSV}
              className="px-6 py-3 bg-primary text-white font-medium text-body rounded-md flex items-center justify-center gap-2 hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md w-[160px]"
            >
              Export to CSV
            </button>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mt-8 w-full max-w-4xl">
          <ErrorMessage message={error} onRetry={() => setRepo(null)} />
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="mt-8">
          <LoadingSkeleton />
        </div>
      )}

      {/* Empty state - guide users on next steps */}
      {data && !loading && data.length === 0 && (
        <div className="mt-8 w-full max-w-4xl p-8 bg-primary-light rounded-md text-center border border-primary/20">
          <h3 className="text-h3 font-medium text-neutral-900 mb-2">
            No releases found
          </h3>
          <p className="text-body text-neutral-600">
            This repository has no releases yet
          </p>
        </div>
      )}

      {/* No results after filtering */}
      {filteredData &&
        !loading &&
        filteredData.length === 0 &&
        data &&
        data.length > 0 && (
          <div className="mt-8 w-full max-w-4xl p-8 bg-yellow-50 rounded-md text-center border border-yellow-200">
            <h3 className="text-h3 font-medium text-neutral-900 mb-2">
              No releases match filters
            </h3>
            <p className="text-body text-neutral-600">
              Try adjusting your filters above
            </p>
          </div>
        )}

      {/* Main content - staggered with clear vertical rhythm */}
      {filteredData && !loading && filteredData.length > 0 && (
        <div className="mt-8 w-full max-w-4xl space-y-8">
          <StatsGrid releases={filteredData} />
          <ReleaseChart releases={filteredData} />
        </div>
      )}
    </main>
  );
}
