'use client';

import { useState } from 'react';
import { validateRepo } from '@/lib/validation';

interface RepoInputProps {
  onSubmit: (repo: string) => void;
  loading?: boolean;
}

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

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="username/repo-name"
          className="flex-1 px-4 py-2 border rounded"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded"
        >
          {loading ? 'Loading...' : 'Analyze'}
        </button>
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </form>
  );
}
