/**
 * Release data caching mechanism with TTL and memory management
 */

import { ReleaseDataManager, type ReleaseStatistics } from './releaseDataProcessor';
import type { Release } from '@/lib/types';

interface CacheEntry {
  releases: Release[];
  statistics: ReleaseStatistics;
  timestamp: number;
  accessCount: number;
  lastAccess: number;
  repositoryKey: string;
}

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of cached repositories
  maxReleasesPerRepo: number; // Maximum releases per repository
  enableStatistics: boolean;
}

interface CacheStats {
  hitRate: number;
  totalHits: number;
  totalMisses: number;
  cacheSize: number;
  averageAccessTime: number;
  oldestEntry: number;
  newestEntry: number;
}

class ReleaseDataCache {
  private cache: Map<string, CacheEntry> = new Map();
  private config: CacheConfig;
  private totalHits = 0;
  private totalMisses = 0;
  private accessTimes: number[] = [];

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      ttl: 5 * 60 * 1000, // 5 minutes
      maxSize: 100, // 100 repositories
      maxReleasesPerRepo: 1000, // 1000 releases per repo
      enableStatistics: true,
      ...config
    };
  }

  /**
   * Generate cache key for repository
   */
  private generateKey(owner: string, repo: string, options?: any): string {
    const optionHash = options ? JSON.stringify(options) : '';
    return `${owner}/${repo}:${optionHash}`;
  }

  /**
   * Check if entry is expired
   */
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > this.config.ttl;
  }

  /**
   * Evict oldest or least recently used entries
   */
  private evictEntries(requiredSpace: number = 1): void {
    if (this.cache.size + requiredSpace <= this.config.maxSize) {
      return;
    }

    // Sort entries by last access time (LRU)
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.lastAccess - b.lastAccess);

    const toEvict = this.cache.size + requiredSpace - this.config.maxSize;
    
    for (let i = 0; i < toEvict && i < entries.length; i++) {
      const [key] = entries[i];
      this.cache.delete(key);
    }
  }

  /**
   * Update entry access statistics
   */
  private updateAccess(entry: CacheEntry): void {
    entry.accessCount++;
    entry.lastAccess = Date.now();
  }

  /**
   * Clean expired entries
   */
  private cleanupExpired(): void {
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cached releases for a repository
   */
  get(owner: string, repo: string, options?: any): Release[] | null {
    const startTime = performance.now();
    
    // Cleanup expired entries
    this.cleanupExpired();
    
    const key = this.generateKey(owner, repo, options);
    const entry = this.cache.get(key);

    if (!entry || this.isExpired(entry)) {
      this.totalMisses++;
      return null;
    }

    // Update access statistics
    this.updateAccess(entry);
    this.totalHits++;

    // Track access time
    const accessTime = performance.now() - startTime;
    this.accessTimes.push(accessTime);
    if (this.accessTimes.length > 100) {
      this.accessTimes.shift(); // Keep only last 100 measurements
    }

    // Return a copy to prevent external modification
    return [...entry.releases];
  }

  /**
   * Get cached statistics for a repository
   */
  getStatistics(owner: string, repo: string, options?: any): ReleaseStatistics | null {
    const key = this.generateKey(owner, repo, options);
    const entry = this.cache.get(key);

    if (!entry || this.isExpired(entry)) {
      return null;
    }

    this.updateAccess(entry);
    return { ...entry.statistics };
  }

  /**
   * Store releases in cache
   */
  set(owner: string, repo: string, releases: Release[], options?: any): void {
    const startTime = performance.now();
    const key = this.generateKey(owner, repo, options);
    
    // Validate and limit releases
    const validatedReleases = releases.slice(0, this.config.maxReleasesPerRepo);
    
    // Calculate statistics if enabled
    let statistics: ReleaseStatistics = {
      totalCount: 0,
      draftCount: 0,
      prereleaseCount: 0,
      finalReleaseCount: 0,
      dateRange: { earliest: null, latest: null },
      averageTimeBetweenReleases: null,
      mostActivePeriod: null
    };

    if (this.config.enableStatistics && validatedReleases.length > 0) {
      // Import dynamically to avoid circular dependencies
      import('./releaseDataProcessor').then(({ calculateReleaseStatistics }) => {
        statistics = calculateReleaseStatistics(validatedReleases);
      }).catch(console.error);
    }

    // Evict old entries if needed
    this.evictEntries();

    // Create cache entry
    const entry: CacheEntry = {
      releases: validatedReleases,
      statistics,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccess: Date.now(),
      repositoryKey: key
    };

    this.cache.set(key, entry);
  }

  /**
   * Remove entry from cache
   */
  delete(owner: string, repo: string, options?: any): boolean {
    const key = this.generateKey(owner, repo, options);
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const accessTimes = this.accessTimes;
    const totalRequests = this.totalHits + this.totalMisses;
    
    return {
      hitRate: totalRequests > 0 ? this.totalHits / totalRequests : 0,
      totalHits: this.totalHits,
      totalMisses: this.totalMisses,
      cacheSize: this.cache.size,
      averageAccessTime: accessTimes.length > 0 
        ? accessTimes.reduce((sum, time) => sum + time, 0) / accessTimes.length 
        : 0,
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : 0,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : 0
    };
  }

  /**
   * Get all cached repositories
   */
  getCachedRepositories(): string[] {
    return Array.from(this.cache.keys()).map(key => key.split(':')[0]);
  }

  /**
   * Invalidate cache entries older than specified time
   */
  invalidateOlderThan(maxAge: number): number {
    const cutoff = Date.now() - maxAge;
    let invalidated = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < cutoff) {
        this.cache.delete(key);
        invalidated++;
      }
    }
    
    return invalidated;
  }

  /**
   * Preload cache for popular repositories
   */
  async preload(repositories: Array<{ owner: string; repo: string; options?: any }>, fetcher: (owner: string, repo: string) => Promise<Release[]>): Promise<void> {
    const promises = repositories.map(async ({ owner, repo, options }) => {
      try {
        // Check if already cached
        if (this.get(owner, repo, options)) {
          return; // Already cached
        }
        
        // Fetch and cache
        const releases = await fetcher(owner, repo);
        this.set(owner, repo, releases, options);
      } catch (error) {
        console.warn(`Failed to preload ${owner}/${repo}:`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Export cache to JSON for debugging
   */
  export(): string {
    const data = {
      config: this.config,
      stats: this.getStats(),
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        releasesCount: entry.releases.length,
        timestamp: entry.timestamp,
        accessCount: entry.accessCount,
        lastAccess: entry.lastAccess
      }))
    };
    
    return JSON.stringify(data, null, 2);
  }
}

// Default cache instance
export const releaseDataCache = new ReleaseDataCache();

// Factory function for custom cache instances
export function createReleaseCache(config: Partial<CacheConfig> = {}): ReleaseDataCache {
  return new ReleaseDataCache(config);
}

// Cache configuration presets
export const CachePresets = {
  development: {
    ttl: 1 * 60 * 1000, // 1 minute
    maxSize: 50,
    maxReleasesPerRepo: 500,
    enableStatistics: true
  },
  production: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100,
    maxReleasesPerRepo: 1000,
    enableStatistics: true
  },
  testing: {
    ttl: 10 * 1000, // 10 seconds
    maxSize: 10,
    maxReleasesPerRepo: 100,
    enableStatistics: false
  }
};
