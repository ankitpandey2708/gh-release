'use client';

import { useState, useEffect, useCallback } from 'react';
import { Release } from '../types';
import { getSavedPAT, savePAT, clearPAT } from '../localStorage';

type ReleaseDTO = Omit<Release, 'date'> & { date: string };

interface ErrorResponse {
  error: string;
  code?: string;
  needsPAT?: boolean;
}

function mapReleases(raw: ReleaseDTO[]): Release[] {
  return raw.map(r => ({ ...r, date: new Date(r.date) }));
}

export function useReleases(repo: string | null) {
  const [data, setData] = useState<Release[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsPAT, setNeedsPAT] = useState(false);
  const [cached, setCached] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const fetchWithToken = useCallback(async (repoPath: string, token?: string) => {
    const headers: HeadersInit = {};
    if (token) {
      headers['x-github-token'] = token;
    }

    const response = await fetch(`/api/releases/${repoPath}`, { headers });
    const result = await response.json();

    if (result.error) {
      const errorResult = result as ErrorResponse;
      throw {
        message: errorResult.error,
        code: errorResult.code,
        needsPAT: errorResult.needsPAT,
      };
    }

    return result;
  }, []);

  const analyzeRepo = useCallback(async (repoPath: string, userProvidedToken?: string, shouldRememberToken?: boolean) => {
    setLoading(true);
    setError(null);
    setNeedsPAT(false);
    setCached(false);
    setData(null);
    setIsPrivate(false);

    try {
      const result = await fetchWithToken(repoPath);

      setData(mapReleases(result.releases));
      setCached(result.cached || false);
      setIsPrivate(result.isPrivate || false);
    } catch (err: any) {
      if (err.needsPAT || err.code === 'REPO_NOT_FOUND_OR_PRIVATE') {
        const tokenToUse = userProvidedToken || getSavedPAT();

        if (tokenToUse) {
          try {
            const result = await fetchWithToken(repoPath, tokenToUse);

            setData(mapReleases(result.releases));
            setIsPrivate(true);

            if (userProvidedToken && shouldRememberToken) {
              savePAT(userProvidedToken);
            }
          } catch (patError: any) {
            if (patError.code === 'INVALID_TOKEN' || patError.code === 'INVALID_TOKEN_FORMAT') {
              clearPAT();
            }

            setError(patError.message || 'Failed to fetch releases');
            setNeedsPAT(true);
          }
        } else {
          setError(err.message || 'Repository not found');
          setNeedsPAT(true);
        }
      } else {
        if (err.message && (err.message.includes('fetch') || err.message.includes('Failed to fetch'))) {
          setError('Network error. Check your connection.');
        } else {
          setError(err.message || 'Failed to fetch releases');
        }
      }
    } finally {
      setLoading(false);
    }
  }, [fetchWithToken]);

  useEffect(() => {
    if (!repo) return;
    analyzeRepo(repo);
  }, [repo, analyzeRepo]);

  const retryWithPAT = useCallback((token: string, remember: boolean = true) => {
    if (!repo) return;
    analyzeRepo(repo, token, remember);
  }, [repo, analyzeRepo]);

  const clearToken = useCallback(() => {
    clearPAT();
    setNeedsPAT(false);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    needsPAT,
    cached,
    isPrivate,
    retryWithPAT,
    clearToken,
  };
}
