'use client';

import { useState, useEffect } from 'react';
import { validateRepo } from '@/lib/validation';
import { Spinner } from './Spinner';
import { getRecentSearches, clearRecentSearches as clearSearches } from '@/lib/localStorage';

interface RepoInputProps {
  onSubmit: (repo: string) => void;
  loading?: boolean;
  currentRepo?: string | null;
}

export function RepoInput({ onSubmit, loading = false, currentRepo }: RepoInputProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Update input value when currentRepo changes
  useEffect(() => {
    if (currentRepo) {
      setValue(currentRepo);
    }
  }, [currentRepo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateRepo(value);
    if (!result.valid) {
      setError(result.error || '');
      return;
    }
    setError('');
    // Use extracted repo (handles GitHub URLs)
    const repo = result.repo || value.trim();
    // Don't save to recent searches here - only save after successful fetch
    onSubmit(repo);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setValue('');
      setError('');
    }
  };

  const handleClearRecentSearches = () => {
    clearSearches();
    setRecentSearches([]);
  };

  const handleRecentSearchClick = (repo: string) => {
    setValue(repo);
    setError('');
    // Recent searches are already validated, so directly submit
    onSubmit(repo);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl">
      {/* Primary input area */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="owner/repo or paste GitHub URL (e.g., facebook/react)"
          className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg bg-white text-neutral-900 text-base placeholder:text-neutral-500 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200"
          disabled={loading}
          autoFocus
          aria-label="GitHub repository name"
          aria-invalid={!!error}
          aria-describedby={error ? 'input-error' : undefined}
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="px-6 py-3 bg-gradient-to-b from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold text-base rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg w-[160px]"
        >
          {loading ? <Spinner /> : 'Analyze'}
        </button>
      </div>

      {/* Inline error message - actionable and specific */}
      {error && (
        <p id="input-error" role="alert" className="text-sm text-error mt-2 font-semibold">
          {error}
        </p>
      )}

      {/* Recent searches - lower visual weight */}
      {recentSearches.length > 0 && (
        <div className="mt-6 p-6 bg-white rounded-lg border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <p className="text-sm text-neutral-600 font-semibold flex-1 text-center">Recent searches</p>
            <div className="flex-1 flex justify-end">
              <button
                onClick={handleClearRecentSearches}
                className="text-error hover:text-red-700 transition-colors min-h-0 p-1"
                type="button"
                aria-label="Clear recent searches"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {recentSearches.map((repo) => (
              <button
                key={repo}
                onClick={() => handleRecentSearchClick(repo)}
                className="px-4 py-2 text-sm text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:border-primary-500 hover:text-primary-600 transition-all duration-200 min-h-0"
                type="button"
                aria-label={`Recent search: ${repo}`}
              >
                {repo}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
