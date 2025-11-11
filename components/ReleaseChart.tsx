'use client';

import { useMemo, useState, useEffect } from 'react';
import { LineChart, Line, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Release } from '@/lib/types';
import { groupByMonth } from '@/lib/stats';
import { format } from 'date-fns';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      month: string;
      count: number;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-neutral-200/60">
        <p className="font-semibold text-neutral-900">{payload[0].payload.month}</p>
        <p className="text-sm text-neutral-600 mt-1">
          {payload[0].value} {payload[0].value === 1 ? 'release' : 'releases'}
        </p>
        <p className="text-xs text-neutral-500 mt-1">Click to view details</p>
      </div>
    );
  }
  return null;
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
    console.log('[ReleaseChart] selectedMonth changed:', selectedMonth);
    if (!selectedMonth) return [];
    const filtered = releases.filter(release => {
      const releaseMonth = format(release.date, 'MMM yyyy');
      return releaseMonth === selectedMonth;
    }).sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort newest first
    console.log('[ReleaseChart] selectedMonthReleases:', filtered);
    return filtered;
  }, [selectedMonth, releases]);

  const handleChartClick = (event: any) => {
    console.log('[ReleaseChart] handleChartClick called with event:', event);
    console.log('[ReleaseChart] event.activeLabel:', event?.activeLabel);

    // activeLabel contains the month string (e.g., "Aug 2025")
    if (event && event.activeLabel) {
      console.log('[ReleaseChart] Setting selectedMonth to:', event.activeLabel);
      setSelectedMonth(event.activeLabel);
    } else {
      console.log('[ReleaseChart] No activeLabel found');
    }
  };

  const closeModal = () => {
    console.log('[ReleaseChart] Closing modal');
    setSelectedMonth(null);
  };

  console.log('[ReleaseChart] Render - selectedMonth:', selectedMonth);
  console.log('[ReleaseChart] Render - should show modal:', !!selectedMonth);
  console.log('[ReleaseChart] Chart data:', data);

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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Releases per month</h2>
          <button
            onClick={() => {
              console.log('[ReleaseChart] Test button clicked');
              const testMonth = data[0]?.month;
              console.log('[ReleaseChart] Test month:', testMonth);
              if (testMonth) {
                setSelectedMonth(testMonth);
              }
            }}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Modal
          </button>
        </div>
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
                dot={{ fill: '#6366f1', r: 4, cursor: 'pointer' }}
                activeDot={{ r: 6, fill: '#4f46e5', cursor: 'pointer' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal for showing releases */}
      {selectedMonth && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            console.log('[ReleaseChart] Modal backdrop clicked');
            closeModal();
          }}
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
                    <div
                      key={index}
                      className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-neutral-900">
                              {release.version}
                            </h4>
                            {release.prerelease && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                                Pre-release
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-neutral-600 mt-1">
                            {format(release.date, 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
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
