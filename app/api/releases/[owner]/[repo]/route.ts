import { NextRequest, NextResponse } from 'next/server';
import { fetchReleases, GitHubError, isValidPAT } from '@/lib/github';
import { sanitize } from '@/lib/validation';
import type { ReleasesErrorBody, ReleasesErrorCode } from '@/lib/types';

function errorResponse(error: string, code: ReleasesErrorCode, status: number) {
  const body: ReleasesErrorBody = {
    error,
    code,
    needsPAT: code === 'REPO_NOT_FOUND_OR_PRIVATE',
  };
  return NextResponse.json(body, { status });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  const { owner: ownerParam, repo: repoParam } = await params;
  const owner = sanitize(ownerParam).toLowerCase();
  const repo = sanitize(repoParam).toLowerCase();

  // Check for GitHub PAT in header
  const userToken = request.headers.get('x-github-token');
  const isPrivateRepoRequest = !!userToken;

  // Validate token format if provided
  if (userToken && !isValidPAT(userToken)) {
    return errorResponse(
      'Invalid GitHub token format. Please use a valid Personal Access Token (ghp_xxx or github_pat_xxx).',
      'INVALID_TOKEN_FORMAT',
      400
    );
  }

  try {
    const releases = await fetchReleases(owner, repo, userToken || undefined);
    const response = {
      owner,
      repo,
      releases,
      isPrivate: isPrivateRepoRequest,
    };

    return NextResponse.json(response, {
      headers: isPrivateRepoRequest
        ? { 'Cache-Control': 'private, no-store' }
        : {
            // Public release data: let the CDN serve repeat lookups instantly
            // and refresh in the background (also spares the 60 req/h GitHub quota).
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            Vary: 'x-github-token',
          },
    });
  } catch (error) {
    if (error instanceof GitHubError) {
      return errorResponse(error.message, error.code, error.statusCode);
    }
    return errorResponse('Internal error', 'INTERNAL_ERROR', 500);
  }
}
