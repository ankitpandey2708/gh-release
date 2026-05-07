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

export interface Stats {
  total: number;
  avgDays: number | string;
  perMonth: string;
  lastReleaseDate: string;
  consistency: string;
}
