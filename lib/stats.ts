import { Release, Stats } from './types';
import { format, differenceInDays, startOfMonth, addMonths, isBefore, isAfter } from 'date-fns';

// Extract major version from a version string (e.g., "v2.1.3" -> 2, "3.0.0-beta" -> 3, "v0.1.0" -> 0)
// Returns null only if cannot be parsed
function extractMajorVersion(versionString: string): number | null {
  // Remove leading 'v' or 'V' if present
  const cleanVersion = versionString.replace(/^v/i, '');

  // Extract first number before a dot or dash
  const match = cleanVersion.match(/^(\d+)/);
  if (!match) return null;

  const majorVersion = parseInt(match[1], 10);

  return majorVersion;
}

export function groupByMonth(releases: Release[]) {
  if (releases.length === 0) {
    return [];
  }

  // Sort releases chronologically (oldest first)
  const sortedReleases = [...releases].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Track which months have major releases (when first integer changes)
  const monthsWithMajorReleases = new Set<string>();
  let highestMajorVersionSeen = -1; // Start at -1 so 0 is considered a major release

  sortedReleases.forEach(release => {
    const majorVersion = extractMajorVersion(release.version);
    if (majorVersion !== null && majorVersion > highestMajorVersionSeen) {
      const month = format(release.date, 'MMM yyyy');
      monthsWithMajorReleases.add(month);
      highestMajorVersionSeen = majorVersion;
    }
  });

  // Count all releases per month
  const groups = new Map<string, number>();
  releases.forEach(release => {
    const month = format(release.date, 'MMM yyyy');
    groups.set(month, (groups.get(month) || 0) + 1);
  });

  // Find earliest and latest release dates
  const dates = releases.map(r => r.date);
  const earliest = new Date(Math.min(...dates.map(d => d.getTime())));
  const latest = new Date(Math.max(...dates.map(d => d.getTime())));

  // Generate all months from earliest to latest
  const allMonths: Array<{ month: string; count: number; isMajorRelease: boolean }> = [];
  let currentMonth = startOfMonth(earliest);
  const endMonth = startOfMonth(latest);

  while (isBefore(currentMonth, endMonth) || currentMonth.getTime() === endMonth.getTime()) {
    const monthKey = format(currentMonth, 'MMM yyyy');
    const count = groups.get(monthKey) || 0;
    const isMajorRelease = monthsWithMajorReleases.has(monthKey);

    allMonths.push({
      month: monthKey,
      count,
      isMajorRelease
    });
    currentMonth = addMonths(currentMonth, 1);
  }

  // Reverse so newest is first (chart has reversed={true} to show newest on right)
  return allMonths.reverse();
}

export function calculateStats(releases: Release[]): Stats {
  if (releases.length === 0) {
    return {
      total: 0,
      avgDays: 0,
      perMonth: '0',
      lastReleaseDate: 'N/A',
      consistency: 'N/A'
    };
  }

  const sorted = [...releases].sort((a, b) => a.date.getTime() - b.date.getTime());
  const total = sorted.length;
  const first = sorted[0].date;
  const last = sorted[total - 1].date;

  const totalDays = differenceInDays(last, first);

  // Single release - can't calculate rates or consistency
  if (total === 1) {
    return {
      total: 1,
      avgDays: 'N/A',
      perMonth: 'N/A',
      lastReleaseDate: format(last, 'MMM d, yyyy'),
      consistency: 'N/A'
    };
  }

  // Calculate days between releases (used for mean and consistency)
  const daysBetween = [];
  for (let i = 1; i < sorted.length; i++) {
    daysBetween.push(differenceInDays(sorted[i].date, sorted[i - 1].date));
  }

  // Calculate mean (avg days between releases) - keep full precision for internal use
  const mean = daysBetween.reduce((a, b) => a + b, 0) / daysBetween.length;
  const avgDays = Math.round(mean); // Rounded only for display

  // Use accurate month length: 365.25 / 12 = 30.4375 days per month
  const perMonth = totalDays > 0 ? Math.round(total / (totalDays / 30.4375)).toString() : 'N/A';



  // Calculate consistency using Coefficient of Variation (CV)
  const variance = daysBetween.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / daysBetween.length;
  const stdDev = Math.sqrt(variance);

  // CV = (standard deviation / mean) * 100
  // Use precise mean, not rounded avgDays
  const coefficientOfVariation = (stdDev / mean) * 100;

  // Realistic CV thresholds for release consistency
  // CV < 100%: stdDev < mean (quite regular, e.g., 10±8 days)
  // CV < 200%: stdDev < 2x mean (moderately regular, e.g., 10±18 days)
  // CV >= 200%: stdDev >= 2x mean (irregular, e.g., 10±25+ days)
  const consistencyScore =
    coefficientOfVariation < 100 ? 'High' :
    coefficientOfVariation < 200 ? 'Medium' : 'Low';

  return {
    total,
    avgDays,
    perMonth,
    lastReleaseDate: format(last, 'MMM d, yyyy'),
    consistency: consistencyScore
  };
}
