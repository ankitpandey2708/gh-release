import { NextRequest, NextResponse } from 'next/server';
import { fetchReleases, GitHubError, isValidPAT } from '@/lib/github';
import { sanitize } from '@/lib/validation';

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
    return NextResponse.json(
      {
        error: 'Invalid GitHub token format. Please use a valid Personal Access Token (ghp_xxx or github_pat_xxx).',
        code: 'INVALID_TOKEN_FORMAT',
      },
      { status: 400 }
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

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof GitHubError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          needsPAT: error.code === 'REPO_NOT_FOUND_OR_PRIVATE',
        },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
  }
}
