'use client';

import { useState } from 'react';
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

export function RepoInput({ onSubmit, loading = false }: RepoInputProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateRepo(value);
    if (!result.valid) {
      setError(result.error || '');
      return;
    }
    setError('');
    onSubmit(value.trim());
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
          className="flex-1 px-4 py-2 border rounded"
          disabled={loading}
          aria-label="GitHub repository name"
          aria-invalid={!!error}
          aria-describedby={error ? 'input-error' : undefined}
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded flex items-center justify-center gap-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Spinner /> : 'Analyze'}
        </button>
      </div>
      {error && (
        <p id="input-error" role="alert" className="text-sm text-red-600 mt-2">
          {error}
        </p>
      )}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 mb-2">Try:</p>
        {EXAMPLES.map(({ repo, label }) => (
          <button
            key={repo}
            onClick={() => setValue(repo)}
            className="text-sm text-blue-600 hover:underline mx-2"
            type="button"
            aria-label={`Try ${label} repository`}
          >
            {label}
          </button>
        ))}
      </div>
    </form>
  );
}
