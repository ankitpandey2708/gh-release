export interface GitHubRelease {
  tag_name: string;
  published_at: string;
  draft: boolean;
  html_url: string;
}

export interface Release {
  version: string;
  date: Date;
  url: string;
}

/**
 * Every failure the releases API (or the client calling it) can produce.
 * Shared by server and client so error handling branches on codes, not message text.
 */
export type ReleasesErrorCode =
  | 'OWNER_NOT_FOUND'
  | 'REPO_NOT_FOUND_OR_PRIVATE'
  | 'REPO_NOT_FOUND_OR_NO_ACCESS'
  | 'INVALID_TOKEN'
  | 'INVALID_TOKEN_FORMAT'
  | 'RATE_LIMIT'
  | 'FORBIDDEN'
  | 'UPSTREAM_ERROR'
  | 'INTERNAL_ERROR'
  | 'NETWORK_ERROR';

export interface ReleasesErrorBody {
  error: string;
  code: ReleasesErrorCode;
  needsPAT: boolean;
}

export interface Stats {
  total: number;
  avgDays: number | string;
  perMonth: string;
  lastReleaseDate: string;
  consistency: string;
}
