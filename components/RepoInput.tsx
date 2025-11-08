'use client';

import { useState } from 'react';

export function RepoInput({ onSubmit, loading = false }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
    }
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
    </form>
  );
}
