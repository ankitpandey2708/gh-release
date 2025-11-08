'use client';

import { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Release } from '@/lib/types';
import { groupByMonth } from '@/lib/stats';

export function ReleaseChart({ releases }: { releases: Release[] }) {
  const data = useMemo(() => groupByMonth(releases), [releases]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  if (releases.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded border-2 border-dashed border-gray-300 dark:border-gray-700">
        <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Releases</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">This repo has no releases yet</p>
      </div>
    );
  }

  if (data.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">No data</p>;
  }

  return (
    <div className={`w-full bg-white dark:bg-gray-800 p-4 md:p-6 rounded border border-gray-300 dark:border-gray-700 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-900 dark:text-white">Releases per Month</h2>
      <div className="h-64 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
