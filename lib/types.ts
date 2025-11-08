export interface GitHubRelease {
  tag_name: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
}

export interface Release {
  version: string;
  date: Date;
  prerelease: boolean;
}

export interface Stats {
  total: number;
  avgDays: number;
  perMonth: string;
  lastRelease: string;
  velocity: string;
  consistency: string;
}
