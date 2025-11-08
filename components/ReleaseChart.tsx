'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Release } from '@/lib/types';
import { groupByMonth } from '@/lib/stats';

export function ReleaseChart({ releases }: { releases: Release[] }) {
  const data = groupByMonth(releases);

  if (data.length === 0) {
    return <p className="text-gray-500">No data</p>;
  }

  return (
    <div className="w-full bg-white p-6 rounded border">
      <h2 className="text-xl font-bold mb-4">Releases per Month</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
