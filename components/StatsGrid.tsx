'use client';

import { useMemo, useState, useEffect } from 'react';
import { Release } from '@/lib/types';
import { calculateStats } from '@/lib/stats';

export function StatsGrid({ releases }: { releases: Release[] }) {
  const stats = useMemo(() => calculateStats(releases), [releases]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard label="Total releases" value={stats.total} delay={0} visible={visible} />
      <StatCard label="Average days between releases" value={stats.avgDays} delay={50} visible={visible} />
      <StatCard label="Avg Releases per month" value={stats.perMonth} delay={100} visible={visible} />
      <StatCard label="Last release" value={stats.lastReleaseDate} secondaryValue={stats.lastRelease} delay={150} visible={visible} />
      <StatCard label="Consistency of release schedule*" value={stats.consistency} delay={200} visible={visible} />
    </div>
  );
}

function StatCard({ label, value, secondaryValue, delay, visible }: { label: string; value: string | number; secondaryValue?: string; delay: number; visible: boolean }) {
  return (
    <div
      className={`bg-white p-6 rounded-md border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Label - smaller, muted */}
      <p className="text-body-sm text-neutral-600 mb-2 font-medium">{label}</p>

      {/* Primary value - large, bold, high contrast */}
      <p className="text-h1 font-bold text-neutral-900 leading-none">{value}</p>

      {/* Secondary value - even smaller, more muted */}
      {secondaryValue && (
        <p className="text-body-sm text-neutral-500 mt-2">{secondaryValue}</p>
      )}
    </div>
  );
}
