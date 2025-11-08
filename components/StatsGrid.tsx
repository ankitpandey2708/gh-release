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
      <StatCard label="Total" value={stats.total} delay={0} visible={visible} tooltip="Total number of releases" />
      <StatCard label="Avg Days" value={stats.avgDays} delay={50} visible={visible} tooltip="Average days between releases" />
      <StatCard label="Per Month" value={stats.perMonth} delay={100} visible={visible} tooltip="Average releases per month" />
      <StatCard label="Last Release" value={stats.lastRelease} delay={150} visible={visible} tooltip="Time since last release" />
      <StatCard label="Velocity" value={stats.velocity} delay={200} visible={visible} tooltip="Recent release rate (last 3 months)" />
      <StatCard label="Consistency" value={stats.consistency} delay={250} visible={visible} tooltip="How consistent the release schedule is" />
    </div>
  );
}

function StatCard({ label, value, delay, visible, tooltip }: { label: string; value: string | number; delay: number; visible: boolean; tooltip: string }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`bg-white dark:bg-gray-800 p-6 rounded border border-gray-300 dark:border-gray-700 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} relative cursor-help`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
        </div>
      )}
    </div>
  );
}
