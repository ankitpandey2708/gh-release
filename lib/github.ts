import { GitHubRelease, ReleasesErrorCode } from './types';

export class GitHubError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: ReleasesErrorCode = 'UPSTREAM_ERROR'
  ) {
    super(message);
  }
}

const USER_AGENT = 'GitHub-Releases-Dashboard';
const PER_PAGE = 100;
/** GitHub only serves the first 1000 results of a list endpoint. */
const MAX_PAGES = 10;

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
async function checkOwnerExists(owner: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.github.com/users/${owner}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': USER_AGENT,
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
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': USER_AGENT,
  };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  /** Fetches one page of releases; null means GitHub's 1000-result cap was hit (422). */
  const fetchPage = async (page: number): Promise<{ data: GitHubRelease[]; lastPage: number } | null> => {
    const url = `https://api.github.com/repos/${owner}/${repo}/releases?per_page=${PER_PAGE}&page=${page}`;
    const response = await fetch(url, { headers });

    if (response.status === 401) {
      throw new GitHubError(
        'Invalid or expired GitHub token. Please enter a valid Personal Access Token.',
        401,
        'INVALID_TOKEN'
      );
    }

    if (response.status === 404) {
      if (token) {
        throw new GitHubError(
          `Repository '${owner}/${repo}' not found or you don't have access. Please verify the repository name and your token permissions.`,
          404,
          'REPO_NOT_FOUND_OR_NO_ACCESS'
        );
      }
      // Only now pay for the owner lookup, to tell "no such owner" from "private repo".
      if (!(await checkOwnerExists(owner))) {
        throw new GitHubError(
          `User or organization '${owner}' not found. Please check the repository URL.`,
          404,
          'OWNER_NOT_FOUND'
        );
      }
      throw new GitHubError(
        `Repository '${owner}/${repo}' not found. This could be a private repository. Please provide a GitHub Personal Access Token if you have access.`,
        404,
        'REPO_NOT_FOUND_OR_PRIVATE'
      );
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
      return null;
    }

    if (!response.ok) {
      throw new GitHubError(
        `Failed to fetch releases: ${response.statusText}`,
        response.status
      );
    }

    const lastMatch = response.headers.get('Link')?.match(/[?&]page=(\d+)[^>]*>;\s*rel="last"/);
    return { data: await response.json(), lastPage: lastMatch ? Number(lastMatch[1]) : page };
  };

  // Page 1 tells us how many pages exist; fetch the rest in parallel.
  const first = await fetchPage(1);
  if (!first) return [];
  const lastPage = Math.min(first.lastPage, MAX_PAGES);
  const rest = await Promise.all(
    Array.from({ length: lastPage - 1 }, (_, i) => fetchPage(i + 2))
  );
  const allReleases = [first, ...rest].flatMap(p => p?.data ?? []);

  return allReleases.filter(r => !r.draft).map(r => ({
    version: r.tag_name,
    date: new Date(r.published_at),
    url: r.html_url,
  }));
}
