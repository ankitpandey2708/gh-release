'use client';

import { useMemo, useState, useEffect } from 'react';
import { Release } from '@/lib/types';
import { calculateStats } from '@/lib/stats';

export function StatsGrid({ releases, totalReleases }: { releases: Release[]; totalReleases: number }) {
  const stats = useMemo(() => calculateStats(releases), [releases]);
  const [visible, setVisible] = useState(false);
  const isFiltered = releases.length < totalReleases;
  const hasInsufficientData = releases.length < 2;

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className="space-y-4">
      {isFiltered && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900">Filtered View</p>
            <p className="text-sm text-blue-800 mt-1">
              Showing stats for {releases.length} of {totalReleases} total releases.
              {hasInsufficientData && ' At least 2 releases are needed to calculate averages and consistency.'}
            </p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          label="Total releases"
          value={stats.total}
          delay={0}
          visible={visible}
          tooltip={isFiltered ? `${releases.length} in selected range` : undefined}
        />
        <StatCard
          label="Average days between releases"
          value={stats.avgDays}
          delay={50}
          visible={visible}
          tooltip={hasInsufficientData ? "Need at least 2 releases" : undefined}
        />
        <StatCard
          label="Avg Releases per month"
          value={stats.perMonth}
          delay={100}
          visible={visible}
          tooltip={hasInsufficientData ? "Need at least 2 releases" : undefined}
        />
        <StatCard
          label="Last release"
          value={stats.lastReleaseDate}
          secondaryValue={stats.lastRelease}
          delay={150}
          visible={visible}
          tooltip={isFiltered ? "Most recent in selected range" : undefined}
        />
        <StatCard
          label="Consistency of release schedule*"
          value={stats.consistency}
          delay={200}
          visible={visible}
          tooltip={hasInsufficientData ? "Need at least 2 releases" : undefined}
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  secondaryValue,
  delay,
  visible,
  tooltip
}: {
  label: string;
  value: string | number;
  secondaryValue?: string;
  delay: number;
  visible: boolean;
  tooltip?: string;
}) {
  return (
    <div
      className={`bg-white p-6 rounded-lg border border-neutral-200/60 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} ${tooltip ? 'relative group' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Label - smaller, muted */}
      <p className="text-sm text-neutral-600 mb-2 font-semibold">{label}</p>

      {/* Primary value - large, bold, high contrast */}
      <p className={`text-4xl font-bold leading-none ${value === 'N/A' ? 'text-neutral-400' : 'text-neutral-900'}`}>
        {value}
      </p>

      {/* Secondary value - even smaller, more muted */}
      {secondaryValue && (
        <p className="text-sm text-neutral-500 mt-2">{secondaryValue}</p>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          <div className="bg-neutral-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
            {tooltip}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
              <div className="border-4 border-transparent border-t-neutral-900"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
