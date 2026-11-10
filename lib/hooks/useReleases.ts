'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Release, ReleasesErrorBody, ReleasesErrorCode } from '../types';
import { getSavedPAT, savePAT, clearPAT, saveRecentSearch } from '../localStorage';

/**
 * Fetch lifecycle for one repository. Exactly one status holds at a time:
 *
 *   idle ──(repo set)──▶ loading ──ok──────────────────────────────▶ success
 *                          │  ├──private repo / token rejected──▶ needs-token ──retryWithPAT──▶ loading
 *                          │  └──any other failure──────────────▶ error
 *                          └── superseded by a newer load ──▶ (aborted, result ignored)
 *
 * Every load aborts the in-flight one, so a stale response can never
 * overwrite the state of the repo currently on screen.
 */
type ReleasesState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; releases: Release[]; isPrivate: boolean }
  | { status: 'needs-token'; message: string; code: ReleasesErrorCode }
  | { status: 'error'; message: string; code: ReleasesErrorCode };

type ReleaseDTO = Omit<Release, 'date'> & { date: string };

type FetchResult =
  | { ok: true; releases: Release[]; isPrivate: boolean }
  | { ok: false; message: string; code: ReleasesErrorCode; needsPAT: boolean };

/** Codes meaning the token itself is bad, so a saved copy should be forgotten. */
const TOKEN_REJECTED = new Set<ReleasesErrorCode>(['INVALID_TOKEN', 'INVALID_TOKEN_FORMAT']);

/** Calls the releases API. Never throws except when `signal` is aborted. */
async function requestReleases(repoPath: string, token: string | undefined, signal: AbortSignal): Promise<FetchResult> {
  let response: Response;
  let body: unknown;
  try {
    response = await fetch(`/api/releases/${repoPath}`, {
      headers: token ? { 'x-github-token': token } : {},
      signal,
    });
  } catch (err) {
    if (signal.aborted) throw err;
    return { ok: false, message: 'Network error. Check your connection.', code: 'NETWORK_ERROR', needsPAT: false };
  }

  try {
    body = await response.json();
  } catch (err) {
    if (signal.aborted) throw err;
    return { ok: false, message: `Failed to fetch releases (HTTP ${response.status})`, code: 'UPSTREAM_ERROR', needsPAT: false };
  }

  const errorBody = body as Partial<ReleasesErrorBody>;
  if (!response.ok || errorBody.error) {
    const code = errorBody.code ?? 'UPSTREAM_ERROR';
    return {
      ok: false,
      message: errorBody.error || 'Failed to fetch releases',
      code,
      needsPAT: !!errorBody.needsPAT || code === 'REPO_NOT_FOUND_OR_PRIVATE',
    };
  }

  const data = body as { releases: ReleaseDTO[]; isPrivate?: boolean };
  return {
    ok: true,
    releases: data.releases.map(r => ({ ...r, date: new Date(r.date) })),
    isPrivate: !!data.isPrivate,
  };
}

export function useReleases(repo: string | null) {
  const [state, setState] = useState<ReleasesState>(() => (repo ? { status: 'loading' } : { status: 'idle' }));
  const [hasSavedToken, setHasSavedToken] = useState(false);
  const inFlight = useRef<AbortController | null>(null);

  useEffect(() => {
    setHasSavedToken(!!getSavedPAT());
  }, []);

  const load = useCallback(async (repoPath: string, userToken?: string, rememberToken?: boolean) => {
    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;
    const { signal } = controller;

    setState({ status: 'loading' });

    try {
      // A user-supplied token is only offered after the public request already failed,
      // so go straight to the authenticated request.
      let usedToken = userToken;
      let result = await requestReleases(repoPath, userToken, signal);

      if (!userToken && !result.ok && result.needsPAT) {
        const savedToken = getSavedPAT();
        if (savedToken) {
          usedToken = savedToken;
          result = await requestReleases(repoPath, savedToken, signal);
        }
      }

      if (signal.aborted) return;

      if (result.ok) {
        if (userToken && rememberToken) {
          savePAT(userToken);
          setHasSavedToken(true);
        }
        saveRecentSearch(repoPath);
        setState({ status: 'success', releases: result.releases, isPrivate: usedToken ? true : result.isPrivate });
        return;
      }

      if (usedToken && TOKEN_REJECTED.has(result.code)) {
        clearPAT();
        setHasSavedToken(false);
      }

      // Once a token is in play, any non-network failure means "try another token".
      const needsToken = usedToken ? result.code !== 'NETWORK_ERROR' : result.needsPAT;
      setState({ status: needsToken ? 'needs-token' : 'error', message: result.message, code: result.code });
    } catch {
      if (signal.aborted) return;
      setState({ status: 'error', message: 'Failed to fetch releases', code: 'INTERNAL_ERROR' });
    }
  }, []);

  useEffect(() => {
    if (!repo) {
      setState({ status: 'idle' });
      return;
    }
    load(repo);
    return () => inFlight.current?.abort();
  }, [repo, load]);

  const retryWithPAT = useCallback(
    (token: string, remember: boolean = true) => {
      if (repo) load(repo, token, remember);
    },
    [repo, load]
  );

  /** Forgets the saved token. Does not disturb what is on screen. */
  const clearToken = useCallback(() => {
    clearPAT();
    setHasSavedToken(false);
  }, []);

  return { state, hasSavedToken, retryWithPAT, clearToken };
}
