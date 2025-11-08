import { Release } from './types';
import { format, differenceInDays, formatDistanceToNow } from 'date-fns';

export function groupByMonth(releases: Release[]) {
  const groups = new Map<string, number>();

  releases.forEach(release => {
    const month = format(release.date, 'MMM yyyy');
    groups.set(month, (groups.get(month) || 0) + 1);
  });

  return Array.from(groups.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
}

export function calculateStats(releases: Release[]) {
  if (releases.length === 0) {
    return {
      total: 0,
      avgDays: 0,
      perMonth: '0',
      lastRelease: 'N/A',
      lastReleaseDate: 'N/A',
      velocity: 'N/A',
      consistency: 'N/A'
    };
  }

  const sorted = [...releases].sort((a, b) => a.date.getTime() - b.date.getTime());
  const total = sorted.length;
  const first = sorted[0].date;
  const last = sorted[total - 1].date;

  const totalDays = differenceInDays(last, first);
  const avgDays = total > 1 ? Math.round(totalDays / (total - 1)) : 0;
  const perMonth = totalDays > 30 ? (total / (totalDays / 30)).toFixed(1) : '0';

  // Calculate velocity (releases per week in last 3 months)
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const recentReleases = sorted.filter(r => r.date >= threeMonthsAgo);
  const recentDays = differenceInDays(new Date(), threeMonthsAgo);
  const velocity = recentDays > 0 ? ((recentReleases.length / recentDays) * 7).toFixed(2) : '0';

  // Calculate consistency (standard deviation of days between releases)
  if (total < 2) {
    return {
      total,
      avgDays,
      perMonth,
      lastRelease: formatDistanceToNow(last, { addSuffix: true }),
      lastReleaseDate: format(last, 'MMM d, yyyy'),
      velocity: velocity + '/wk',
      consistency: 'N/A'
    };
  }

  const daysBetween = [];
  for (let i = 1; i < sorted.length; i++) {
    daysBetween.push(differenceInDays(sorted[i].date, sorted[i - 1].date));
  }

  const mean = daysBetween.reduce((a, b) => a + b, 0) / daysBetween.length;
  const variance = daysBetween.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / daysBetween.length;
  const stdDev = Math.sqrt(variance);

  // Consistency score: lower stdDev = more consistent
  const consistencyScore = stdDev < avgDays * 0.3 ? 'High' : stdDev < avgDays * 0.7 ? 'Medium' : 'Low';

  return {
    total,
    avgDays,
    perMonth,
    lastRelease: formatDistanceToNow(last, { addSuffix: true }),
    lastReleaseDate: format(last, 'MMM d, yyyy'),
    velocity: velocity + '/wk',
    consistency: consistencyScore
  };
}
