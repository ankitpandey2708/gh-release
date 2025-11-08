'use client';

import { useState, useEffect } from 'react';
import { validateRepo } from '@/lib/validation';
import { Spinner } from './Spinner';

interface RepoInputProps {
  onSubmit: (repo: string) => void;
  loading?: boolean;
}

const EXAMPLES = [
  { repo: 'facebook/react', label: 'React' },
  { repo: 'vuejs/core', label: 'Vue' },
  { repo: 'angular/angular', label: 'Angular' },
];

const STORAGE_KEY = 'recent-searches';
const MAX_RECENT = 5;

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveRecentSearch(repo: string) {
  if (typeof window === 'undefined') return;
  const recent = getRecentSearches();
  const filtered = recent.filter(r => r !== repo);
  const updated = [repo, ...filtered].slice(0, MAX_RECENT);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
    const trimmedValue = value.trim();
    saveRecentSearch(trimmedValue);
    setRecentSearches(getRecentSearches());
    onSubmit(trimmedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setValue('');
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="username/repo-name"
          className="flex-1 px-4 py-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          disabled={loading}
          aria-label="GitHub repository name"
          aria-invalid={!!error}
          aria-describedby={error ? 'input-error' : undefined}
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="px-6 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded flex items-center justify-center gap-2 hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Spinner /> : 'Analyze'}
        </button>
      </div>
      {error && (
        <p id="input-error" role="alert" className="text-sm text-red-600 dark:text-red-400 mt-2">
          {error}
        </p>
      )}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Try:</p>
        {EXAMPLES.map(({ repo, label }) => (
          <button
            key={repo}
            onClick={() => setValue(repo)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mx-2 transition-all duration-200 hover:scale-105"
            type="button"
            aria-label={`Try ${label} repository`}
          >
            {label}
          </button>
        ))}
      </div>
      {recentSearches.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Recent:</p>
          {recentSearches.map((repo) => (
            <button
              key={repo}
              onClick={() => setValue(repo)}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline mx-2 transition-all duration-200"
              type="button"
              aria-label={`Recent search: ${repo}`}
            >
              {repo}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
