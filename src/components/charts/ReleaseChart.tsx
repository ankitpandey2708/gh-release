"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { Release } from "@/lib/types";
import { formatChartDate } from "@/utils/dateUtils";
import { formatNumberAbbreviation } from "@/utils/metrics";

// Chart data interface
interface ChartDataPoint {
  date: string;
  formattedDate: string;
  cumulativeCount: number;
  releases: number;
  year: number;
  month: number;
}

// Custom tooltip component
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-gray-900 dark:text-gray-100 font-medium">
          {data.formattedDate}
        </p>
        <p className="text-blue-600 dark:text-blue-400">
          Total Releases: <span className="font-semibold">{data.cumulativeCount}</span>
        </p>
        {data.releases > 0 && (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {data.releases} release{data.releases !== 1 ? 's' : ''} in this month
          </p>
        )}
      </div>
    );
  }
  return null;
};

interface ReleaseChartProps {
  releases: Release[];
  repositoryName?: string;
  isLoading?: boolean;
  error?: string | null;
}

// Custom date tick formatter
const formatXAxisTick = (value: string) => {
  const date = new Date(value);
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
};

export default function ReleaseChart({ 
  releases, 
  repositoryName = "Repository", 
  isLoading = false,
  error = null 
}: ReleaseChartProps) {
  
  // Transform release data for chart
  const chartData = useMemo(() => {
    if (!releases || releases.length === 0) {
      return [];
    }

    // Group releases by month and calculate cumulative count
    const monthlyData = new Map<string, { count: number; releases: Date[] }>();
    
    releases.forEach(release => {
      const monthKey = `${release.publishedAt.getFullYear()}-${(release.publishedAt.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { count: 0, releases: [] });
      }
      
      const monthData = monthlyData.get(monthKey)!;
      monthData.count++;
      monthData.releases.push(release.publishedAt);
    });

    // Sort months and calculate cumulative count
    const sortedMonths = Array.from(monthlyData.entries()).sort();
    const chartPoints: ChartDataPoint[] = [];
    let cumulativeCount = 0;
    
    sortedMonths.forEach(([monthKey, data]) => {
      cumulativeCount += data.count;
      const [year, month] = monthKey.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      
      chartPoints.push({
        date: date.toISOString(),
        formattedDate: formatChartDate(date, 'monthly'),
        cumulativeCount,
        releases: data.count,
        year: parseInt(year),
        month: parseInt(month)
      });
    });

    return chartPoints;
  }, [releases]);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading chart data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-900 dark:text-gray-100 font-medium">Chart Error</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!releases || releases.length === 0 || chartData.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-900 dark:text-gray-100 font-medium">No Release Data</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">No releases found for this repository</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Release Timeline - {repositoryName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Cumulative releases over time ({releases.length} total releases)
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            className="opacity-30"
            stroke="#6B7280"
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxisTick}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={{ stroke: '#6B7280' }}
            tickLine={{ stroke: '#6B7280' }}
            minTickGap={50}
          />
          <YAxis
            tickFormatter={formatNumberAbbreviation}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={{ stroke: '#6B7280' }}
            tickLine={{ stroke: '#6B7280' }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="cumulativeCount"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ 
              fill: '#3B82F6', 
              strokeWidth: 2, 
              r: 4,
              className: "hover:r-6 transition-all duration-200"
            }}
            activeDot={{ 
              r: 6, 
              stroke: '#3B82F6', 
              strokeWidth: 2,
              fill: '#FFFFFF'
            }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Chart legend/info */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span>Cumulative Releases</span>
          </div>
        </div>
        <div>
          {chartData.length > 0 && (
            <span>
              {formatChartDate(new Date(chartData[0].date), 'monthly')} - {formatChartDate(new Date(chartData[chartData.length - 1].date), 'monthly')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
