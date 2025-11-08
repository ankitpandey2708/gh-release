'use client';

import { useState, useEffect } from 'react';
import { validateRepo } from '@/lib/validation';
import { Spinner } from './Spinner';
import { getRecentSearches, clearRecentSearches as clearSearches } from '@/lib/localStorage';

interface RepoInputProps {
  onSubmit: (repo: string) => void;
  loading?: boolean;
}

export function RepoInput({ onSubmit, loading = false }: RepoInputProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

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

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      {/* Primary input area (Design Spec F.7-8) */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="owner/repo or paste GitHub URL (e.g., facebook/react)"
          className="flex-1 px-2 py-1 border border-neutral-300 rounded-md bg-white text-neutral-900 text-body placeholder:text-neutral-400 focus:border-primary disabled:bg-neutral-100 disabled:cursor-not-allowed transition-all duration-200 min-h-[44px]"
          disabled={loading}
          aria-label="GitHub repository name"
          aria-invalid={!!error}
          aria-describedby={error ? 'input-error' : undefined}
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="px-3 py-1 bg-primary text-white font-medium text-body rounded-md flex items-center justify-center gap-2 hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md min-w-[120px] min-h-[44px]"
        >
          {loading ? <Spinner /> : 'Analyze'}
        </button>
      </div>

      {/* Inline error message - actionable and specific (Design Spec H.5) */}
      {error && (
        <p id="input-error" role="alert" className="text-body-sm text-error mt-1 font-medium">
          {error}
        </p>
      )}

      {/* Recent searches - lower visual weight (Design Spec D.2) */}
      {recentSearches.length > 0 && (
        <div className="mt-3 p-2 bg-neutral-50 rounded-md border border-neutral-200">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-body-sm text-neutral-700 font-medium">Recent searches</p>
            <button
              onClick={handleClearRecentSearches}
              className="text-body-sm text-neutral-600 hover:text-error underline transition-colors min-h-[44px]"
              type="button"
              aria-label="Clear recent searches"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {recentSearches.map((repo) => (
              <button
                key={repo}
                onClick={() => setValue(repo)}
                className="px-2 py-1 text-body-sm text-neutral-700 bg-white border border-neutral-300 rounded-md hover:border-primary hover:text-primary transition-all duration-200 min-h-[44px]"
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
