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
    return { total: 0, avgDays: 0, perMonth: '0', lastRelease: 'N/A' };
  }

  const sorted = [...releases].sort((a, b) => a.date.getTime() - b.date.getTime());
  const total = sorted.length;
  const first = sorted[0].date;
  const last = sorted[total - 1].date;

  const totalDays = differenceInDays(last, first);
  const avgDays = total > 1 ? Math.round(totalDays / (total - 1)) : 0;
  const perMonth = totalDays > 30 ? (total / (totalDays / 30)).toFixed(1) : '0';

  return {
    total,
    avgDays,
    perMonth,
    lastRelease: formatDistanceToNow(last, { addSuffix: true }),
  };
}
