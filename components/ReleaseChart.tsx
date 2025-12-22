'use client';

import { useMemo, useState, useEffect } from 'react';
import { LineChart, Line, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Release } from '@/lib/types';
import { groupByMonth } from '@/lib/stats';
import { format } from 'date-fns';

// Two colors: one for regular releases, one for major releases
const REGULAR_RELEASE_COLOR = '#6366f1'; // Indigo-500
const MAJOR_RELEASE_COLOR = '#ef4444';   // Red-500

// Get color based on whether it's a major release month
function getDotColor(isMajorRelease: boolean): string {
  return isMajorRelease ? MAJOR_RELEASE_COLOR : REGULAR_RELEASE_COLOR;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      month: string;
      count: number;
      isMajorRelease: boolean;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-neutral-200/60">
        <p className="font-semibold text-neutral-900">{data.month}</p>
        <p className="text-sm text-neutral-600 mt-1">
          {payload[0].value} {payload[0].value === 1 ? 'release' : 'releases'}
        </p>
      </div>
    );
  }
  return null;
};

// Custom dot component that colors based on whether it's a major release
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (payload.count === 0) return null;

  const color = getDotColor(payload.isMajorRelease);

  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill={color}
      stroke="none"
      style={{ cursor: 'pointer' }}
    />
  );
};

// Custom active dot for hover state
const CustomActiveDot = (props: any) => {
  const { cx, cy, payload } = props;
  const color = getDotColor(payload.isMajorRelease);

  return (
    <circle
      cx={cx}
      cy={cy}
      r={6}
      fill={color}
      stroke="white"
      strokeWidth={2}
      style={{ cursor: 'pointer' }}
    />
  );
};

// Custom legend renderer
const renderLegend = () => {
  return (
    <div className="flex justify-end items-center gap-4 mb-2">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MAJOR_RELEASE_COLOR }}></div>
        <span className="text-xs font-medium text-neutral-700">Major Release</span>
      </div>
    </div>
  );
};

export function ReleaseChart({ releases }: { releases: Release[] }) {
  const data = useMemo(() => groupByMonth(releases), [releases]);
  const [visible, setVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  useEffect(() => {
    setVisible(true);
  }, []);

  // Get releases for selected month
  const selectedMonthReleases = useMemo(() => {
    if (!selectedMonth) return [];
    const filtered = releases.filter(release => {
      const releaseMonth = format(release.date, 'MMM yyyy');
      return releaseMonth === selectedMonth;
    }).sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort newest first
    return filtered;
  }, [selectedMonth, releases]);

  const handleChartClick = (event: any) => {
    // activeLabel contains the month string (e.g., "Aug 2025")
    if (event && event.activeLabel) {
      setSelectedMonth(event.activeLabel);
    }
  };

  const closeModal = () => {
    setSelectedMonth(null);
  };

  if (releases.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-neutral-200/60">
        <svg className="w-16 h-16 text-neutral-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">No releases</h3>
        <p className="text-base text-neutral-600">This repository has no releases yet</p>
      </div>
    );
  }

  if (data.length === 0) {
    return <p className="text-base text-neutral-600">No data available</p>;
  }

  return (
    <>
      <div className={`w-full bg-white p-4 md:p-6 rounded-lg border border-neutral-200/60 shadow-md hover:shadow-lg transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <h2 className="text-2xl font-bold mb-6 text-neutral-900 tracking-tight">Releases per month</h2>
        <div className="h-64 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              onClick={handleChartClick}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e7eb" vertical={false} />
              <XAxis
                dataKey="month"
                angle={-45}
                textAnchor="end"
                height={80}
                reversed={true}
                stroke="#9aa5b1"
                style={{ fontSize: '0.75rem', fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#9aa5b1"
                style={{ fontSize: '0.75rem', fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderLegend} verticalAlign="top" align="right" />
              <Area
                type="monotone"
                dataKey="count"
                fill="url(#colorValue)"
                stroke="none"
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={<CustomDot />}
                activeDot={<CustomActiveDot />}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal for showing releases */}
      {selectedMonth && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-neutral-900">
                Releases in {selectedMonth}
              </h3>
              <button
                onClick={closeModal}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {selectedMonthReleases.length > 0 ? (
                <div className="space-y-3">
                  {selectedMonthReleases.map((release, index) => (
                      <a
                        key={index}
                        href={release.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="block p-4 border border-neutral-200 rounded-lg hover:border-primary-500 hover:bg-primary-50/50 transition-all group cursor-pointer"
                      >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                              {release.version}
                            </h4>
                            {/* {release.prerelease && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                                Pre-release
                              </span>
                            )} */}
                            <svg
                              className="w-4 h-4 text-neutral-400 group-hover:text-primary-500 transition-colors"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </div>
                          <p className="text-sm text-neutral-600 mt-1">
                            {format(release.date, 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      </a>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-600 text-center py-8">
                  No releases found for this month
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
