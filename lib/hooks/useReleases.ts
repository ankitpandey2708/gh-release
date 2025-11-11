'use client';

import { useState, useEffect, useCallback } from 'react';
import { Release } from '../types';
import { getSavedPAT, savePAT, clearPAT } from '../localStorage';

interface ReleaseDTO {
  version: string;
  date: string;
  // prerelease: boolean;
  url: string;
}

interface ErrorResponse {
  error: string;
  code?: string;
  needsPAT?: boolean;
}

export function useReleases(repo: string | null) {
  const [data, setData] = useState<Release[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
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

  const analyzeRepo = useCallback(async (repoPath: string, userProvidedToken?: string) => {
    setLoading(true);
    setError(null);
    setErrorCode(null);
    setNeedsPAT(false);
    setCached(false);
    setData(null);
    setIsPrivate(false);

    try {
      // ALWAYS try without PAT first (as per requirements)
      const result = await fetchWithToken(repoPath);

      // Success - it's a public repo
      const releases = result.releases.map((r: ReleaseDTO): Release => ({
        ...r,
        date: new Date(r.date)
      }));
      setData(releases);
      setCached(result.cached || false);
      setIsPrivate(result.isPrivate || false);
    } catch (err: any) {
      // First attempt failed - check if we should try with PAT
      if (err.needsPAT || err.code === 'REPO_NOT_FOUND_OR_PRIVATE') {
        // Check for saved PAT or user-provided PAT
        const tokenToUse = userProvidedToken || getSavedPAT();

        if (tokenToUse) {
          // Retry with PAT
          try {
            const result = await fetchWithToken(repoPath, tokenToUse);

            // Success with PAT - it's a private repo
            const releases = result.releases.map((r: ReleaseDTO): Release => ({
              ...r,
              date: new Date(r.date)
            }));
            setData(releases);
            setIsPrivate(true);

            // Save PAT if user provided it
            if (userProvidedToken) {
              savePAT(userProvidedToken);
            }
          } catch (patError: any) {
            // PAT failed - might be invalid
            if (patError.code === 'INVALID_TOKEN' || patError.code === 'INVALID_TOKEN_FORMAT') {
              // Clear invalid token
              clearPAT();
            }

            setError(patError.message || 'Failed to fetch releases');
            setErrorCode(patError.code || null);
            setNeedsPAT(true);
          }
        } else {
          // No PAT available - show PAT input
          setError(err.message || 'Repository not found');
          setErrorCode(err.code || null);
          setNeedsPAT(true);
        }
      } else {
        // Other error (owner not found, network error, etc.)
        if (err.message && (err.message.includes('fetch') || err.message.includes('Failed to fetch'))) {
          setError('Network error. Check your connection.');
        } else {
          setError(err.message || 'Failed to fetch releases');
        }
        setErrorCode(err.code || null);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchWithToken]);

  useEffect(() => {
    if (!repo) return;
    analyzeRepo(repo);
  }, [repo, analyzeRepo]);

  const retryWithPAT = useCallback((token: string) => {
    if (!repo) return;
    analyzeRepo(repo, token);
  }, [repo, analyzeRepo]);

  const clearToken = useCallback(() => {
    clearPAT();
    setNeedsPAT(false);
    setError(null);
    setErrorCode(null);
  }, []);

  return {
    data,
    loading,
    error,
    errorCode,
    needsPAT,
    cached,
    isPrivate,
    retryWithPAT,
    clearToken,
  };
}
