export interface GitHubRelease {
  tag_name: string;
  published_at: string;
  // prerelease: boolean;
  draft: boolean;
  html_url: string;
}

export interface Release {
  version: string;
  date: Date;
  // prerelease: boolean;
  url: string;
}

export interface Stats {
  total: number;
  avgDays: number | string;
  perMonth: string;
  lastRelease: string;
  lastReleaseDate: string;
  consistency: string;
}
