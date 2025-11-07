/**
 * Metric calculations for GitHub Release Analysis application
 * These utilities provide comprehensive release metrics calculations
 */

import { Release } from '@/lib/types';
import { daysDifference, monthsDifference } from './dateUtils';

/**
 * Release metrics interface
 */
export interface ReleaseMetrics {
  totalReleases: number;
  daysSinceLastRelease: number | null;
  averageTimeBetweenReleases: number | null;
  releaseVelocity: ReleaseVelocity;
  mostActivePeriod: MostActivePeriod;
  preReleaseRatio: number;
  firstRelease: Date | null;
  lastRelease: Date | null;
}

/**
 * Release velocity analysis
 */
export interface ReleaseVelocity {
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
  ratePerMonth: number;
  description: string;
  periods: {
    recent: number;   // Last 3 months
    previous: number; // Previous 3 months
    yearly: number;   // Last 12 months
  };
}

/**
 * Most active period analysis
 */
export interface MostActivePeriod {
  period: string;
  releaseCount: number;
  timeWindow: {
    start: Date;
    end: Date;
  };
  monthlyAverage: number;
}

/**
 * Calculate total number of releases
 * @param releases - Array of release objects
 * @returns Total release count
 */
export function calculateTotalReleases(releases: Release[]): number {
  if (!releases || releases.length === 0) {
    return 0;
  }
  
  return releases.length;
}

/**
 * Calculate days since last release
 * @param releases - Array of release objects
 * @returns Number of days since last release, null if no releases
 */
export function calculateDaysSinceLastRelease(releases: Release[]): number | null {
  if (!releases || releases.length === 0) {
    return null;
  }
  
  // Sort releases by published date (newest first)
  const sortedReleases = [...releases].sort((a, b) => 
    b.publishedAt.getTime() - a.publishedAt.getTime()
  );
  
  const lastRelease = sortedReleases[0];
  return daysDifference(lastRelease.publishedAt, new Date());
}

/**
 * Calculate average time between releases
 * @param releases - Array of release objects
 * @returns Average time in days, null if insufficient releases
 */
export function calculateAverageTimeBetweenReleases(releases: Release[]): number | null {
  if (!releases || releases.length < 2) {
    return null;
  }
  
  // Sort releases by published date (oldest first)
  const sortedReleases = [...releases].sort((a, b) => 
    a.publishedAt.getTime() - b.publishedAt.getTime()
  );
  
  let totalDays = 0;
  let intervals = 0;
  
  // Calculate intervals between consecutive releases
  for (let i = 1; i < sortedReleases.length; i++) {
    const interval = daysDifference(
      sortedReleases[i - 1].publishedAt,
      sortedReleases[i].publishedAt
    );
    totalDays += interval;
    intervals++;
  }
  
  return intervals > 0 ? Math.round(totalDays / intervals) : null;
}

/**
 * Calculate release velocity trends
 * @param releases - Array of release objects
 * @returns Release velocity analysis
 */
export function calculateReleaseVelocity(releases: Release[]): ReleaseVelocity {
  if (!releases || releases.length === 0) {
    return {
      trend: 'stable',
      confidence: 0,
      ratePerMonth: 0,
      description: 'No releases to analyze',
      periods: { recent: 0, previous: 0, yearly: 0 }
    };
  }
  
  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate());
  
  // Count releases in different time periods
  const recentReleases = releases.filter(r => r.publishedAt >= threeMonthsAgo).length;
  const previousReleases = releases.filter(r => 
    r.publishedAt >= sixMonthsAgo && r.publishedAt < threeMonthsAgo
  ).length;
  const yearlyReleases = releases.filter(r => r.publishedAt >= twelveMonthsAgo).length;
  
  // Calculate rates per month
  const recentRate = recentReleases / 3; // 3 months
  const previousRate = previousReleases / 3; // 3 months
  const yearlyRate = yearlyReleases / 12; // 12 months
  
  // Determine trend
  let trend: 'increasing' | 'decreasing' | 'stable';
  let confidence: number;
  let description: string;
  
  const rateChange = recentRate - previousRate;
  const changePercentage = previousRate > 0 ? (rateChange / previousRate) * 100 : 0;
  
  if (Math.abs(changePercentage) < 20) { // Less than 20% change
    trend = 'stable';
    confidence = 0.7;
    description = 'Release velocity is stable';
  } else if (rateChange > 0) {
    trend = 'increasing';
    confidence = Math.min(0.9, Math.abs(changePercentage) / 100);
    description = `Release velocity is increasing (${changePercentage.toFixed(1)}% faster)`;
  } else {
    trend = 'decreasing';
    confidence = Math.min(0.9, Math.abs(changePercentage) / 100);
    description = `Release velocity is decreasing (${Math.abs(changePercentage).toFixed(1)}% slower)`;
  }
  
  return {
    trend,
    confidence,
    ratePerMonth: Math.round(recentRate * 100) / 100,
    description,
    periods: {
      recent: recentReleases,
      previous: previousReleases,
      yearly: yearlyReleases
    }
  };
}

/**
 * Find the most active period
 * @param releases - Array of release objects
 * @returns Most active period analysis
 */
export function findMostActivePeriod(releases: Release[]): MostActivePeriod {
  if (!releases || releases.length === 0) {
    return {
      period: 'No releases',
      releaseCount: 0,
      timeWindow: { start: new Date(), end: new Date() },
      monthlyAverage: 0
    };
  }
  
  // Group releases by month-year
  const monthlyCounts: Record<string, { count: number; date: Date; releases: Date[] }> = {};
  
  releases.forEach(release => {
    const monthKey = `${release.publishedAt.getFullYear()}-${(release.publishedAt.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!monthlyCounts[monthKey]) {
      monthlyCounts[monthKey] = {
        count: 0,
        date: new Date(release.publishedAt.getFullYear(), release.publishedAt.getMonth(), 1),
        releases: []
      };
    }
    
    monthlyCounts[monthKey].count++;
    monthlyCounts[monthKey].releases.push(release.publishedAt);
  });
  
  // Find month with most releases
  let maxCount = 0;
  let maxKey = '';
  
  Object.entries(monthlyCounts).forEach(([key, data]) => {
    if (data.count > maxCount) {
      maxCount = data.count;
      maxKey = key;
    }
  });
  
  const mostActiveData = monthlyCounts[maxKey];
  const totalMonths = Object.keys(monthlyCounts).length;
  const monthlyAverage = Math.round((releases.length / totalMonths) * 100) / 100;
  
  return {
    period: mostActiveData ? formatMonthYear(mostActiveData.date) : 'Unknown',
    releaseCount: maxCount,
    timeWindow: mostActiveData ? {
      start: mostActiveData.date,
      end: new Date(mostActiveData.date.getFullYear(), mostActiveData.date.getMonth() + 1, 0)
    } : { start: new Date(), end: new Date() },
    monthlyAverage
  };
}

/**
 * Calculate pre-release ratio
 * @param releases - Array of release objects
 * @returns Ratio of pre-releases (0-1)
 */
export function calculatePreReleaseRatio(releases: Release[]): number {
  if (!releases || releases.length === 0) {
    return 0;
  }
  
  const preReleases = releases.filter(release => release.prerelease).length;
  return Math.round((preReleases / releases.length) * 1000) / 1000; // Round to 3 decimal places
}

/**
 * Get comprehensive release metrics
 * @param releases - Array of release objects
 * @returns Complete release metrics object
 */
export function calculateReleaseMetrics(releases: Release[]): ReleaseMetrics {
  if (!releases || releases.length === 0) {
    return {
      totalReleases: 0,
      daysSinceLastRelease: null,
      averageTimeBetweenReleases: null,
      releaseVelocity: {
        trend: 'stable',
        confidence: 0,
        ratePerMonth: 0,
        description: 'No releases to analyze',
        periods: { recent: 0, previous: 0, yearly: 0 }
      },
      mostActivePeriod: {
        period: 'No releases',
        releaseCount: 0,
        timeWindow: { start: new Date(), end: new Date() },
        monthlyAverage: 0
      },
      preReleaseRatio: 0,
      firstRelease: null,
      lastRelease: null
    };
  }
  
  // Sort releases for date-based calculations
  const sortedReleases = [...releases].sort((a, b) => 
    a.publishedAt.getTime() - b.publishedAt.getTime()
  );
  
  return {
    totalReleases: calculateTotalReleases(releases),
    daysSinceLastRelease: calculateDaysSinceLastRelease(releases),
    averageTimeBetweenReleases: calculateAverageTimeBetweenReleases(releases),
    releaseVelocity: calculateReleaseVelocity(releases),
    mostActivePeriod: findMostActivePeriod(releases),
    preReleaseRatio: calculatePreReleaseRatio(releases),
    firstRelease: sortedReleases[0]?.publishedAt || null,
    lastRelease: sortedReleases[sortedReleases.length - 1]?.publishedAt || null
  };
}

/**
 * Format month and year for display
 * @param date - Date object
 * @returns Formatted month-year string
 */
function formatMonthYear(date: Date): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Format number with K/M abbreviations
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumberAbbreviation(num: number): string {
  if (num === 0) return '0';
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
  return `${(num / 1000000).toFixed(1)}M`;
}

/**
 * Calculate quality score based on release patterns
 * @param releases - Array of release objects
 * @returns Quality score (0-100)
 */
export function calculateQualityScore(releases: Release[]): number {
  if (!releases || releases.length === 0) return 0;
  
  let score = 50; // Base score
  
  const metrics = calculateReleaseMetrics(releases);
  
  // Bonus for regular release schedule
  if (metrics.averageTimeBetweenReleases) {
    if (metrics.averageTimeBetweenReleases <= 30) score += 20; // Monthly releases
    else if (metrics.averageTimeBetweenReleases <= 90) score += 15; // Quarterly releases
    else if (metrics.averageTimeBetweenReleases <= 180) score += 10; // Semi-annual releases
  }
  
  // Bonus for consistent velocity
  if (metrics.releaseVelocity.trend === 'stable' && metrics.releaseVelocity.confidence > 0.7) {
    score += 15;
  }
  
  // Penalty for high pre-release ratio
  if (metrics.preReleaseRatio > 0.5) {
    score -= 20;
  } else if (metrics.preReleaseRatio > 0.3) {
    score -= 10;
  }
  
  // Bonus for recent activity
  if (metrics.daysSinceLastRelease !== null && metrics.daysSinceLastRelease <= 30) {
    score += 10;
  } else if (metrics.daysSinceLastRelease !== null && metrics.daysSinceLastRelease <= 90) {
    score += 5;
  }
  
  // Penalty for very long periods without releases
  if (metrics.daysSinceLastRelease !== null && metrics.daysSinceLastRelease > 365) {
    score -= 15;
  }
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Get release health status
 * @param releases - Array of release objects
 * @returns Health status and description
 */
export function getReleaseHealthStatus(releases: Release[]): {
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'inactive';
  description: string;
  color: string;
} {
  const qualityScore = calculateQualityScore(releases);
  const metrics = calculateReleaseMetrics(releases);
  
  if (qualityScore >= 80) {
    return {
      status: 'excellent',
      description: 'Excellent release patterns with consistent, high-quality releases',
      color: 'green'
    };
  } else if (qualityScore >= 60) {
    return {
      status: 'good',
      description: 'Good release patterns with regular updates',
      color: 'blue'
    };
  } else if (qualityScore >= 40) {
    return {
      status: 'fair',
      description: 'Fair release patterns, could be more consistent',
      color: 'yellow'
    };
  } else if (releases.length > 0) {
    return {
      status: 'poor',
      description: 'Poor release patterns with long gaps between releases',
      color: 'orange'
    };
  } else {
    return {
      status: 'inactive',
      description: 'No releases found for this repository',
      color: 'red'
    };
  }
}
