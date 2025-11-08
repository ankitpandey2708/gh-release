import { GitHubRelease } from './types';

export class GitHubError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

export async function fetchReleases(owner: string, repo: string) {
  const url = `https://api.github.com/repos/${owner}/${repo}/releases`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Releases-Dashboard',
    },
  });

  if (response.status === 404) {
    throw new GitHubError('Repository not found', 404);
  }
  if (response.status === 403) {
    throw new GitHubError('Rate limit exceeded', 403);
  }
  if (!response.ok) {
    throw new GitHubError('Failed to fetch releases', response.status);
  }

  const data: GitHubRelease[] = await response.json();
  return data.filter(r => !r.draft).map(r => ({
    version: r.tag_name,
    date: new Date(r.published_at),
    prerelease: r.prerelease,
  }));
}
