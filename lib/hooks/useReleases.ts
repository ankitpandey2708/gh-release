'use client';

import { useState, useEffect } from 'react';
import { Release } from '../types';

export function useReleases(repo: string | null) {
  const [data, setData] = useState<Release[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!repo) return;

    setLoading(true);
    setError(null);

    fetch(`/api/releases/${repo}`)
      .then(res => res.json())
      .then(result => {
        if (result.error) {
          throw new Error(result.error);
        }
        setData(result.releases);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [repo]);

  return { data, loading, error };
}
