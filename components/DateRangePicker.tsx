"use client";

import React, { useRef, useEffect } from "react";
import AirDatepicker from "air-datepicker";
import localeEn from "air-datepicker/locale/en";
import "air-datepicker/air-datepicker.css";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const datepickerRef = useRef<AirDatepicker<HTMLInputElement> | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    // Initialize Air Datepicker with range mode
    datepickerRef.current = new AirDatepicker(inputRef.current, {
      locale: localeEn,
      range: true,
      multipleDatesSeparator: " - ",
      dateFormat: "MMM dd, yyyy",
      maxDate: new Date(),
      onSelect: ({ datepicker }) => {
        const selectedDates = datepicker.selectedDates;

        if (selectedDates.length === 2) {
          const start = selectedDates[0];
          const end = selectedDates[1];
          onStartDateChange(format(start, "yyyy-MM-dd"));
          onEndDateChange(format(end, "yyyy-MM-dd"));
        } else if (selectedDates.length === 0) {
          onStartDateChange("");
          onEndDateChange("");
        }
      },
    });

    // Set initial selected dates if they exist
    const initialDates: Date[] = [];
    if (startDate) {
      initialDates.push(new Date(startDate));
    }
    if (endDate) {
      initialDates.push(new Date(endDate));
    }
    if (initialDates.length > 0) {
      datepickerRef.current.selectDate(initialDates);
    }

    // Cleanup
    return () => {
      if (datepickerRef.current) {
        datepickerRef.current.destroy();
      }
    };
  }, []);

  // Update selected dates when props change
  useEffect(() => {
    if (!datepickerRef.current) return;

    const dates: Date[] = [];
    if (startDate) {
      dates.push(new Date(startDate));
    }
    if (endDate) {
      dates.push(new Date(endDate));
    }

    datepickerRef.current.clear({ silent: true });
    if (dates.length > 0) {
      datepickerRef.current.selectDate(dates, { silent: true });
    }
  }, [startDate, endDate]);

  const handleClear = () => {
    if (datepickerRef.current) {
      datepickerRef.current.clear();
    }
    onClear();
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <style jsx global>{`
        .air-datepicker {
          --adp-color: #3b82f6;
          --adp-background-color: #ffffff;
          --adp-background-color-hover: #f3f4f6;
          --adp-background-color-selected: #3b82f6;
          --adp-background-color-selected-other-month-focused: #2563eb;
          --adp-background-color-in-range: #dbeafe;
          --adp-font-size: 14px;
          --adp-border-radius: 0.375rem;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
          border: 1px solid #e5e7eb;
        }
        .air-datepicker-cell.-selected- {
          background: #3b82f6;
          color: white;
        }
        .air-datepicker-cell.-in-range- {
          background: #dbeafe;
          color: #1f2937;
        }
        .air-datepicker-cell.-range-from-,
        .air-datepicker-cell.-range-to- {
          background: #3b82f6;
          color: white;
        }
      `}</style>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-neutral-700 whitespace-nowrap">
          Date Range:
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            readOnly
            placeholder="Select date range"
            className="px-3 py-2 border border-neutral-200 rounded-lg bg-white text-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 text-sm cursor-pointer min-w-[280px]"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      {(startDate || endDate) && (
        <button
          type="button"
          onClick={handleClear}
          className="text-sm text-primary-600 hover:text-primary-500 underline transition-colors font-medium"
        >
          Clear
        </button>
      )}
    </div>
  );
}
