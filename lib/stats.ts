import { Release } from './types';
import { format } from 'date-fns';

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
