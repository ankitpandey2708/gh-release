import { NextRequest, NextResponse } from 'next/server';
import { fetchReleases, GitHubError } from '@/lib/github';
import { getCached, setCached } from '@/lib/cache';
import { sanitize } from '@/lib/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  const { owner: ownerParam, repo: repoParam } = await params;
  const owner = sanitize(ownerParam);
  const repo = sanitize(repoParam);
  const cacheKey = `releases:${owner}:${repo}`;

  // Try cache first
  const cached = await getCached(cacheKey);
  if (cached) {
    return NextResponse.json({ ...cached, cached: true });
  }

  try {
    const releases = await fetchReleases(owner, repo);
    const response = { owner, repo, releases };
    await setCached(cacheKey, response);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof GitHubError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
  }
}
