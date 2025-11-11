"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { RepoInput } from "@/components/RepoInput";
import { StatsGrid } from "@/components/StatsGrid";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ProgressBar } from "@/components/ProgressBar";
import { PATInput } from "@/components/PATInput";
import { useReleases } from "@/lib/hooks/useReleases";
import { saveRecentSearch, hasSavedPAT } from "@/lib/localStorage";
import DateRangePicker from "@/components/DateRangePicker";

const ReleaseChart = dynamic(
  () =>
    import("@/components/ReleaseChart").then((m) => ({
      default: m.ReleaseChart,
    })),
  {
    loading: () => (
      <div className="h-64 md:h-96 bg-gray-200 rounded-lg animate-pulse" />
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
  const { data, loading, error, cached, needsPAT, isPrivate, retryWithPAT, clearToken } = useReleases(repo);
  // const [showPreReleases, setShowPreReleases] = useState(true);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [hasPAT, setHasPAT] = useState(false);

  // Initialize with initialRepo if provided
  useEffect(() => {
    if (initialRepo) {
      setRepoState(initialRepo);
    }
  }, [initialRepo]);

  // Initialize hasPAT state from localStorage
  useEffect(() => {
    setHasPAT(hasSavedPAT());
  }, []);

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
    // setShowPreReleases(true);
    setRepo(null);
  };

  const handlePATSubmit = (token: string, remember: boolean) => {
    retryWithPAT(token, remember);
    if (remember) {
      setHasPAT(true);
    }
  };

  const handleClearToken = () => {
    clearToken();
    setHasPAT(false);
  };

  const filteredData = data?.filter((r) => {
    // if (!showPreReleases && r.prerelease) return false;

    // Start date: beginning of day (midnight)
    if (startDate) {
      const start = new Date(startDate);
      if (new Date(r.date) < start) return false;
    }

    // End date: end of day (23:59:59.999) to include all releases on that day
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (new Date(r.date) > end) return false;
    }

    return true;
  });

  const exportToCSV = () => {
    if (!filteredData) return;

    const csvContent = [
      ["Version", "Date"/*, "Pre-release"*/].join(","),
      ...filteredData.map((r) =>
        [
          r.version,
          new Date(r.date).toISOString().split("T")[0],
          // r.prerelease ? "Yes" : "No",
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
      className="min-h-screen px-4 py-8 md:px-8 flex flex-col items-center bg-gray-50 text-neutral-900 transition-colors duration-200"
    >
      <ProgressBar loading={loading} />

      {/* Header with clear hierarchy */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8 w-full max-w-4xl">
        <h1 className="text-3xl font-bold animate-fade-in">
          GitHub releases dashboard
        </h1>
        {hasPAT && (
          <button
            onClick={handleClearToken}
            className="px-4 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg border border-red-300 transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Saved Token
          </button>
        )}
      </div>

      {/* Primary action area */}
      <RepoInput onSubmit={setRepo} loading={loading} currentRepo={repo} />

      {/* PAT Input - shown when private repo is detected */}
      {needsPAT && repo && !loading && (
        <div className="mt-6 w-full max-w-4xl">
          <PATInput
            onSubmit={handlePATSubmit}
            loading={loading}
            errorMessage={error || undefined}
            repoName={repo}
          />
        </div>
      )}

      {/* Private repo indicator */}
      {isPrivate && data && !loading && (
        <div className="mt-6 w-full max-w-4xl">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900">Private Repository</p>
              <p className="text-xs text-blue-700">This data is not cached and is fetched using your personal access token.</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters section - grouped with consistent spacing */}
      {data && !loading && data.length > 0 && (
        <div className="mt-6 w-full max-w-4xl">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="flex-1 flex flex-col sm:flex-row gap-4 sm:items-center p-4 bg-white rounded-lg border border-neutral-200">
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onClear={() => {
                  setStartDate("");
                  setEndDate("");
                }}
              />
            </div>
            <button
              onClick={exportToCSV}
              className="px-6 py-3 bg-gradient-to-b from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold text-base rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg w-[160px]"
            >
              Export to CSV
            </button>
          </div>
        </div>
      )}

      {/* Error state - only show if NOT asking for PAT */}
      {error && !needsPAT && (
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
        <div className="mt-8 w-full max-w-4xl p-8 bg-primary-50 rounded-lg text-center border border-primary-500/20">
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            No releases found
          </h3>
          <p className="text-base text-neutral-600">
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
          <div className="mt-8 w-full max-w-4xl p-8 bg-yellow-50 rounded-lg text-center border border-yellow-200">
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              No releases match filters
            </h3>
            <p className="text-base text-neutral-600">
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
