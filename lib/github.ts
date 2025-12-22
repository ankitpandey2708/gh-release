import { GitHubRelease } from './types';

export class GitHubError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
  }
}

/**
 * Validates GitHub Personal Access Token format
 */
export function isValidPAT(token: string): boolean {
  if (!token || typeof token !== 'string') return false;

  // Classic PAT: ghp_xxx (40 chars total)
  // Fine-grained PAT: github_pat_xxx (variable length)
  const classicPAT = /^ghp_[a-zA-Z0-9]{36}$/;
  const fineGrainedPAT = /^github_pat_[a-zA-Z0-9_]{82}$/;

  return classicPAT.test(token) || fineGrainedPAT.test(token);
}

/**
 * Checks if a GitHub user or organization exists
 */
export async function checkOwnerExists(owner: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.github.com/users/${owner}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Releases-Dashboard',
      },
    });

    return response.status === 200;
  } catch (error) {
    // Network error - assume owner might exist
    return true;
  }
}

/**
 * Fetches releases from a GitHub repository
 * @param owner - Repository owner (user or organization)
 * @param repo - Repository name
 * @param token - Optional GitHub Personal Access Token for private repos
 */
export async function fetchReleases(
  owner: string,
  repo: string,
  token?: string
) {
  // First, check if owner exists (only if no token provided)
  // This helps distinguish between "owner doesn't exist" and "repo is private"
  if (!token) {
    const ownerExists = await checkOwnerExists(owner);
    if (!ownerExists) {
      throw new GitHubError(
        `User or organization '${owner}' not found. Please check the repository URL.`,
        404,
        'OWNER_NOT_FOUND'
      );
    }
  }

  let allReleases: GitHubRelease[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `https://api.github.com/repos/${owner}/${repo}/releases?per_page=100&page=${page}`;

    // Build headers
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Releases-Dashboard',
    };

    // Add authentication if token is provided
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    const response = await fetch(url, { headers });

    // Enhanced error handling
    if (response.status === 401) {
      throw new GitHubError(
        'Invalid or expired GitHub token. Please enter a valid Personal Access Token.',
        401,
        'INVALID_TOKEN'
      );
    }

    if (response.status === 404) {
      // Owner exists (we checked above), but repo 404s
      if (!token) {
        throw new GitHubError(
          `Repository '${owner}/${repo}' not found. This could be a private repository. Please provide a GitHub Personal Access Token if you have access.`,
          404,
          'REPO_NOT_FOUND_OR_PRIVATE'
        );
      } else {
        throw new GitHubError(
          `Repository '${owner}/${repo}' not found or you don't have access. Please verify the repository name and your token permissions.`,
          404,
          'REPO_NOT_FOUND_OR_NO_ACCESS'
        );
      }
    }

    if (response.status === 403) {
      const resetTime = response.headers.get('X-RateLimit-Reset');
      const remaining = response.headers.get('X-RateLimit-Remaining');

      if (remaining === '0') {
        const message = resetTime
          ? `Rate limit exceeded. Try again in a few minutes.`
          : 'Rate limit exceeded. Consider adding a GitHub token for higher limits (5,000 req/hour).';
        throw new GitHubError(message, 403, 'RATE_LIMIT');
      }

      throw new GitHubError(
        'Access forbidden. Your token may lack required permissions (needs "repo" scope for private repositories).',
        403,
        'FORBIDDEN'
      );
    }

    if (response.status === 422) {
      // GitHub API limit: only first 1000 results are available
      // Break gracefully and return what we have
      break;
    }

    if (!response.ok) {
      throw new GitHubError(
        `Failed to fetch releases: ${response.statusText}`,
        response.status
      );
    }

    const data: GitHubRelease[] = await response.json();
    allReleases = [...allReleases, ...data];

    // Check for more pages using Link header (proper GitHub pagination)
    const linkHeader = response.headers.get('Link');
    hasMore = linkHeader ? linkHeader.includes('rel="next"') : false;
    page++;
  }

  return allReleases.filter(r => !r.draft).map(r => ({
    version: r.tag_name,
    date: new Date(r.published_at),
    // prerelease: r.prerelease,
    url: r.html_url,
  }));
}
