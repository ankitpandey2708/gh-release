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
      <div className="bg-white p-2 rounded-md shadow-md border border-neutral-300">
        <p className="font-medium text-neutral-900 text-body-sm">{payload[0].payload.month}</p>
        <p className="text-body-sm text-neutral-600 mt-0.5">
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
      <div className="h-80 flex flex-col items-center justify-center bg-neutral-50 rounded-md border-2 border-dashed border-neutral-300">
        <svg className="w-12 h-12 text-neutral-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-h3 font-semibold text-neutral-900 mb-1">No releases</h3>
        <p className="text-body text-neutral-600">This repository has no releases yet</p>
      </div>
    );
  }

  if (data.length === 0) {
    return <p className="text-body text-neutral-600">No data available</p>;
  }

  return (
    <div className={`w-full bg-white p-3 md:p-3 rounded-md border border-neutral-200 shadow-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <h2 className="text-h2 font-bold mb-3 text-neutral-900">Releases per month</h2>
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              angle={-45}
              textAnchor="end"
              height={80}
              reversed={true}
              style={{ fontSize: '0.875rem', fill: '#64748b' }}
            />
            <YAxis
              style={{ fontSize: '0.875rem', fill: '#64748b' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ fill: '#2563eb', r: 4 }}
              activeDot={{ r: 6, fill: '#1d4ed8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
