import { Release, Stats } from './types';
import { format, differenceInDays, formatDistanceToNow } from 'date-fns';

export function groupByMonth(releases: Release[]) {
  const groups = new Map<string, number>();

  releases.forEach(release => {
    const month = format(release.date, 'MMM yyyy');
    groups.set(month, (groups.get(month) || 0) + 1);
  });

  // Sort oldest to newest for chronological display (left to right)
  return Array.from(groups.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
}

export function calculateStats(releases: Release[]): Stats {
  if (releases.length === 0) {
    return {
      total: 0,
      avgDays: 0,
      perMonth: '0',
      lastRelease: 'N/A',
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
      lastRelease: formatDistanceToNow(last, { addSuffix: true }),
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
    lastRelease: formatDistanceToNow(last, { addSuffix: true }),
    lastReleaseDate: format(last, 'MMM d, yyyy'),
    consistency: consistencyScore
  };
}
