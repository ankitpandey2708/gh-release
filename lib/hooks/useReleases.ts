'use client';

import { useState, useEffect } from 'react';
import { Release } from '../types';

interface ReleaseDTO {
  version: string;
  date: string;
  prerelease: boolean;
  url: string;
}

export function useReleases(repo: string | null) {
  const [data, setData] = useState<Release[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);

  useEffect(() => {
    if (!repo) return;

    setLoading(true);
    setError(null);
    setCached(false);

    fetch(`/api/releases/${repo}`)
      .then(res => res.json())
      .then(result => {
        if (result.error) {
          throw new Error(result.error);
        }
        // Convert date strings back to Date objects
        const releases = result.releases.map((r: ReleaseDTO): Release => ({
          ...r,
          date: new Date(r.date)
        }));
        setData(releases);
        setCached(result.cached || false);
      })
      .catch(err => {
        if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
          setError('Network error. Check your connection.');
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [repo]);

  return { data, loading, error, cached };
}
