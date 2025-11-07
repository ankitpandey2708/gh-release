/**
 * Release data processing and validation utilities
 */

import type { Release } from '@/lib/types';

/**
 * Release data validation options
 */
export interface ReleaseValidationOptions {
  excludeDrafts?: boolean;
  excludePreReleases?: boolean;
  maxAge?: Date;
  minAge?: Date;
  requireTags?: boolean;
  validateDates?: boolean;
}

/**
 * Release data processing options
 */
export interface ReleaseProcessingOptions {
  sortBy?: 'date' | 'name' | 'tag';
  sortOrder?: 'asc' | 'desc';
  groupBy?: 'year' | 'month' | 'quarter';
  dateFormat?: 'iso' | 'display' | 'relative';
}

/**
 * Release data statistics
 */
export interface ReleaseStatistics {
  totalCount: number;
  draftCount: number;
  prereleaseCount: number;
  finalReleaseCount: number;
  dateRange: {
    earliest: Date | null;
    latest: Date | null;
  };
  averageTimeBetweenReleases: number | null;
  mostActivePeriod: {
    period: string;
    count: number;
  } | null;
}

/**
 * Validate release data structure and content
 */
export function validateRelease(release: any): release is Release {
  return (
    typeof release === 'object' &&
    typeof release.id === 'number' &&
    typeof release.tagName === 'string' &&
    release.publishedAt instanceof Date &&
    typeof release.draft === 'boolean' &&
    typeof release.prerelease === 'boolean' &&
    release.author &&
    typeof release.author.login === 'string'
  );
}

/**
 * Validate an array of releases
 */
export function validateReleases(releases: any[]): Release[] {
  if (!Array.isArray(releases)) {
    throw new Error('Releases must be an array');
  }

  const validated: Release[] = [];
  const errors: string[] = [];

  for (let i = 0; i < releases.length; i++) {
    const release = releases[i];
    try {
      if (validateRelease(release)) {
        validated.push(release);
      } else {
        errors.push(`Release at index ${i} failed validation`);
      }
    } catch (error) {
      errors.push(`Release at index ${i}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  if (errors.length > 0) {
    console.warn('Release validation warnings:', errors);
  }

  return validated;
}

/**
 * Filter releases based on options
 */
export function filterReleases(releases: Release[], options: ReleaseValidationOptions = {}): Release[] {
  const {
    excludeDrafts = true,
    excludePreReleases = false,
    maxAge,
    minAge,
    requireTags = false,
    validateDates = true
  } = options;

  return releases.filter(release => {
    // Filter drafts
    if (excludeDrafts && release.draft) {
      return false;
    }

    // Filter pre-releases
    if (excludePreReleases && release.prerelease) {
      return false;
    }

    // Filter by tag requirement
    if (requireTags && !release.tagName) {
      return false;
    }

    // Filter by date range
    if (maxAge && release.publishedAt > maxAge) {
      return false;
    }

    if (minAge && release.publishedAt < minAge) {
      return false;
    }

    // Validate dates
    if (validateDates) {
      const now = new Date();
      if (release.publishedAt > now) {
        console.warn(`Release ${release.tagName} has future publication date:`, release.publishedAt);
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort releases according to options
 */
export function sortReleases(releases: Release[], options: ReleaseProcessingOptions = {}): Release[] {
  const { sortBy = 'date', sortOrder = 'desc' } = options;

  return [...releases].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = a.publishedAt.getTime() - b.publishedAt.getTime();
        break;
      case 'name':
        comparison = a.name?.localeCompare(b.name || '') || 0;
        break;
      case 'tag':
        comparison = a.tagName.localeCompare(b.tagName);
        break;
      default:
        comparison = a.publishedAt.getTime() - b.publishedAt.getTime();
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });
}

/**
 * Group releases by time period
 */
export function groupReleasesByPeriod(releases: Release[], groupBy: 'year' | 'month' | 'quarter' = 'month'): Record<string, Release[]> {
  const groups: Record<string, Release[]> = {};

  for (const release of releases) {
    const date = release.publishedAt;
    let key: string;

    switch (groupBy) {
      case 'year':
        key = date.getFullYear().toString();
        break;
      case 'month':
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        break;
      case 'quarter':
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        key = `${date.getFullYear()}-Q${quarter}`;
        break;
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(release);
  }

  return groups;
}

/**
 * Calculate release statistics
 */
export function calculateReleaseStatistics(releases: Release[]): ReleaseStatistics {
  if (releases.length === 0) {
    return {
      totalCount: 0,
      draftCount: 0,
      prereleaseCount: 0,
      finalReleaseCount: 0,
      dateRange: { earliest: null, latest: null },
      averageTimeBetweenReleases: null,
      mostActivePeriod: null
    };
  }

  const sortedReleases = sortReleases(releases, { sortBy: 'date', sortOrder: 'asc' });
  const draftCount = releases.filter(r => r.draft).length;
  const prereleaseCount = releases.filter(r => r.prerelease).length;
  const finalReleaseCount = releases.filter(r => !r.draft && !r.prerelease).length;

  // Date range
  const earliest = sortedReleases[0]?.publishedAt || null;
  const latest = sortedReleases[sortedReleases.length - 1]?.publishedAt || null;

  // Average time between releases
  let averageTimeBetweenReleases: number | null = null;
  if (sortedReleases.length > 1) {
    const timeDiffs: number[] = [];
    for (let i = 1; i < sortedReleases.length; i++) {
      const diff = sortedReleases[i].publishedAt.getTime() - sortedReleases[i - 1].publishedAt.getTime();
      timeDiffs.push(diff);
    }
    const avgDiff = timeDiffs.reduce((sum, diff) => sum + diff, 0) / timeDiffs.length;
    averageTimeBetweenReleases = Math.round(avgDiff / (1000 * 60 * 60 * 24)); // Convert to days
  }

  // Most active period
  const monthlyGroups = groupReleasesByPeriod(releases, 'month');
  const mostActiveEntry = Object.entries(monthlyGroups)
    .reduce((max, [period, periodReleases]) => 
      periodReleases.length > (max?.count || 0) ? { period, count: periodReleases.length } : max
    , null as { period: string; count: number } | null);

  return {
    totalCount: releases.length,
    draftCount,
    prereleaseCount,
    finalReleaseCount,
    dateRange: { earliest, latest },
    averageTimeBetweenReleases,
    mostActivePeriod: mostActiveEntry
  };
}

/**
 * Sanitize release data for safe display
 */
export function sanitizeRelease(release: Release): Release {
  return {
    ...release,
    name: release.name?.replace(/[^\w\s\-\.\(\)\[\]#@!&+,=]/g, '').trim() || null,
    body: release.body?.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim() || null,
    tagName: release.tagName.trim(),
  };
}

/**
 * Sanitize array of releases
 */
export function sanitizeReleases(releases: Release[]): Release[] {
  return releases.map(sanitizeRelease);
}

/**
 * Memory management for large release datasets
 */
export class ReleaseDataManager {
  private releases: Release[] = [];
  private maxCacheSize: number;
  private cacheKey: string;
  private lastAccess: number;

  constructor(cacheKey: string, maxCacheSize: number = 1000) {
    this.cacheKey = cacheKey;
    this.maxCacheSize = maxCacheSize;
    this.lastAccess = Date.now();
  }

  /**
   * Load releases into memory with size management
   */
  loadReleases(newReleases: Release[]): void {
    this.lastAccess = Date.now();

    // Validate and sanitize releases
    const validatedReleases = validateReleases(newReleases);
    const sanitizedReleases = sanitizeReleases(validatedReleases);

    // If adding would exceed cache size, implement LRU strategy
    if (this.releases.length + sanitizedReleases.length > this.maxCacheSize) {
      // Keep only the most recent releases
      const keepCount = Math.max(0, this.maxCacheSize - sanitizedReleases.length);
      const recentReleases = sanitizedReleases.slice(-keepCount);
      this.releases = [...sanitizedReleases, ...recentReleases];
    } else {
      this.releases = [...this.releases, ...sanitizedReleases];
    }

    // Sort by date for efficient access
    this.releases = sortReleases(this.releases, { sortBy: 'date', sortOrder: 'desc' });
  }

  /**
   * Get releases with optional filtering
   */
  getReleases(options?: ReleaseValidationOptions & ReleaseProcessingOptions): Release[] {
    this.lastAccess = Date.now();
    let result = [...this.releases];

    if (options?.excludeDrafts || options?.excludePreReleases) {
      result = filterReleases(result, options);
    }

    if (options?.sortBy || options?.sortOrder) {
      result = sortReleases(result, options);
    }

    return result;
  }

  /**
   * Get statistics about cached releases
   */
  getStatistics(): ReleaseStatistics {
    return calculateReleaseStatistics(this.releases);
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.releases = [];
  }

  /**
   * Get cache info
   */
  getCacheInfo(): { size: number; maxSize: number; lastAccess: number; cacheKey: string } {
    return {
      size: this.releases.length,
      maxSize: this.maxCacheSize,
      lastAccess: this.lastAccess,
      cacheKey: this.cacheKey
    };
  }
}
