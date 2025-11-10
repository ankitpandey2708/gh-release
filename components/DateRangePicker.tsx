"use client";

import React from "react";
import { format } from "date-fns";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClear: () => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
}: DateRangePickerProps) {
  // Get today's date in YYYY-MM-DD format for max attribute
  const today = format(new Date(), "yyyy-MM-dd");

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onStartDateChange(value);

    // If end date is before the new start date, clear it
    if (endDate && value && new Date(value) > new Date(endDate)) {
      onEndDateChange("");
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onEndDateChange(value);

    // If start date is after the new end date, clear it
    if (startDate && value && new Date(value) < new Date(startDate)) {
      onStartDateChange("");
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <label htmlFor="start-date" className="text-sm font-medium text-neutral-700 whitespace-nowrap">
          From:
        </label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          max={endDate || today}
          className="px-3 py-2 border border-neutral-200 rounded-lg bg-white text-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="end-date" className="text-sm font-medium text-neutral-700 whitespace-nowrap">
          To:
        </label>
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          min={startDate}
          max={today}
          className="px-3 py-2 border border-neutral-200 rounded-lg bg-white text-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 text-sm"
        />
      </div>

      {(startDate || endDate) && (
        <button
          type="button"
          onClick={onClear}
          className="text-sm text-primary-600 hover:text-primary-500 underline transition-colors font-medium"
        >
          Clear
        </button>
      )}
    </div>
  );
}
