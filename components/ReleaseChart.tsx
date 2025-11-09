'use client';

import { useMemo, useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Release } from '@/lib/types';
import { groupByMonth } from '@/lib/stats';

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
      <div className="bg-white p-4 rounded-lg shadow-lg border border-neutral-200">
        <p className="font-semibold text-neutral-900">{payload[0].payload.month}</p>
        <p className="text-sm text-neutral-600 mt-1">
          {payload[0].value} {payload[0].value === 1 ? 'release' : 'releases'}
        </p>
      </div>
    );
  }
  return null;
};

export function ReleaseChart({ releases }: { releases: Release[] }) {
  const data = useMemo(() => groupByMonth(releases), [releases]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  if (releases.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-neutral-200">
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
    <div className={`w-full bg-white p-4 md:p-6 rounded-lg border border-neutral-200 shadow-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <h2 className="text-2xl font-bold mb-6 text-neutral-900 tracking-tight">Releases per month</h2>
      <div className="h-64 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
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
            <Line
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={{ fill: '#6366f1', r: 4 }}
              activeDot={{ r: 6, fill: '#4f46e5' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
