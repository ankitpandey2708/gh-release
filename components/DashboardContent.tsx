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
  },
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
        ].join(","),
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
      className="min-h-screen px-2 py-4 md:px-4 flex flex-col items-center bg-neutral-50 text-neutral-900 transition-colors duration-200"
    >
      <ProgressBar loading={loading} />

      {/* Header with clear hierarchy (Design Spec D.1-3) */}
      <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
        <h1 className="text-h1 font-bold animate-fadeIn">
          GitHub releases dashboard
        </h1>
      </div>

      {/* Primary action area (Design Spec D.1) */}
      <RepoInput onSubmit={setRepo} loading={loading} />

      {/* Repository info section - shown when data is loaded */}
      {data && !loading && repo && (
        <div className="mt-3 w-full max-w-2xl p-3 bg-white rounded-md border border-neutral-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-h3 font-semibold text-neutral-900">
                  <a
                    href={`https://github.com/${repo}/releases`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {repo}
                  </a>
                </h2>
                {cached && (
                  <span className="text-body-sm bg-primary-light text-primary px-2 py-1 rounded-sm font-medium">
                    Cached
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleReset}
              className="px-2 py-0.5 text-body-sm font-medium border border-neutral-300 text-neutral-700 bg-white rounded-md hover:bg-neutral-50 hover:border-neutral-400 transition-all duration-200 whitespace-nowrap min-h-[44px]"
              aria-label="Analyze a different repository"
            >
              Analyze different repo
            </button>
          </div>
        </div>
      )}

      {/* Filters section - grouped with consistent spacing (Design Spec A.2-3) */}
      {data && !loading && data.length > 0 && (
        <div className="mt-2 w-full max-w-2xl space-y-2 p-3 bg-white rounded-md border border-neutral-200">
          <h3 className="text-h3 font-semibold text-neutral-800">Filters</h3>

          {/* Date range filters */}
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <label className="flex items-center gap-1 text-body">
              <span className="text-neutral-700 font-medium">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-1 border border-neutral-300 rounded-md bg-white text-neutral-900 text-body-sm focus:border-primary transition-colors min-h-[44px]"
              />
            </label>
            <label className="flex items-center gap-1 text-body">
              <span className="text-neutral-700 font-medium">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-1 border border-neutral-300 rounded-md bg-white text-neutral-900 text-body-sm focus:border-primary transition-colors min-h-[44px]"
              />
            </label>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="text-body-sm text-primary hover:text-primary-hover underline transition-colors min-h-[44px]"
              >
                Clear dates
              </button>
            )}
          </div>

          {/* Secondary action (Design Spec D.2) */}
          <div className="flex gap-2 pt-2 border-t border-neutral-200">
            <button
              onClick={exportToCSV}
              className="px-2 py-1 text-body-sm font-medium border border-neutral-300 text-neutral-700 bg-white rounded-md hover:bg-neutral-50 hover:border-neutral-400 transition-all duration-200 min-h-[44px]"
            >
              Export to CSV
            </button>
          </div>
        </div>
      )}

      {/* Error state (Design Spec H.1-5) */}
      {error && (
        <div className="mt-4 w-full max-w-4xl">
          <ErrorMessage message={error} onRetry={() => setRepo(null)} />
        </div>
      )}

      {/* Loading state (Design Spec H.3) */}
      {loading && (
        <div className="mt-4">
          <LoadingSkeleton />
        </div>
      )}

      {/* Empty state - guide users on next steps (Design Spec H.2) */}
      {data && !loading && data.length === 0 && (
        <div className="mt-4 w-full max-w-4xl p-4 bg-primary-light rounded-md text-center border border-primary/20">
          <h3 className="text-h3 font-semibold text-neutral-900 mb-1">
            No releases found
          </h3>
          <p className="text-body text-neutral-600">
            This repository has no releases yet
          </p>
        </div>
      )}

      {/* No results after filtering (Design Spec H.2) */}
      {filteredData &&
        !loading &&
        filteredData.length === 0 &&
        data &&
        data.length > 0 && (
          <div className="mt-4 w-full max-w-4xl p-4 bg-warning-light rounded-md text-center border border-warning/20">
            <h3 className="text-h3 font-semibold text-neutral-900 mb-1">
              No releases match filters
            </h3>
            <p className="text-body text-neutral-600">
              Try adjusting your filters above
            </p>
          </div>
        )}

      {/* Main content - clear vertical rhythm (Design Spec A.3) */}
      {filteredData && !loading && filteredData.length > 0 && (
        <div className="mt-4 w-full max-w-4xl space-y-4">
          <StatsGrid releases={filteredData} />
          <ReleaseChart releases={filteredData} />
        </div>
      )}
    </main>
  );
}
