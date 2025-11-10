"use client";

import React, { useState, useRef, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/style.css";

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
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const range: DateRange | undefined = {
    from: startDate ? new Date(startDate) : undefined,
    to: endDate ? new Date(endDate) : undefined,
  };

  const handleRangeSelect = (selectedRange: DateRange | undefined) => {
    if (selectedRange?.from) {
      onStartDateChange(format(selectedRange.from, "yyyy-MM-dd"));
    } else {
      onStartDateChange("");
    }

    if (selectedRange?.to) {
      onEndDateChange(format(selectedRange.to, "yyyy-MM-dd"));
    } else {
      onEndDateChange("");
    }

    // Close the picker when both dates are selected
    if (selectedRange?.from && selectedRange?.to) {
      setIsOpen(false);
    }
  };

  const formatDateDisplay = () => {
    if (startDate && endDate) {
      return `${format(new Date(startDate), "MMM dd, yyyy")} - ${format(
        new Date(endDate),
        "MMM dd, yyyy"
      )}`;
    } else if (startDate) {
      return `${format(new Date(startDate), "MMM dd, yyyy")} - ...`;
    }
    return "Select date range";
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-3 border border-neutral-200 rounded-lg bg-white text-neutral-900 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-200 text-left min-w-[280px] flex items-center justify-between"
        >
          <span className={startDate || endDate ? "text-neutral-900" : "text-neutral-400"}>
            {formatDateDisplay()}
          </span>
          <svg
            className="w-5 h-5 text-neutral-400"
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
        </button>
        {(startDate || endDate) && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-primary-600 hover:text-primary-500 underline transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-lg shadow-lg border border-neutral-200 p-4">
          <style jsx global>{`
            .rdp {
              --rdp-accent-color: #3b82f6;
              --rdp-background-color: #dbeafe;
              --rdp-accent-color-dark: #2563eb;
              --rdp-background-color-dark: #1e40af;
              --rdp-outline: 2px solid var(--rdp-accent-color);
              --rdp-outline-selected: 2px solid var(--rdp-accent-color);
            }
            .rdp-day_button {
              border-radius: 0.375rem;
            }
            .rdp-day_button:hover:not([disabled]):not(.rdp-day_selected) {
              background-color: #f3f4f6;
            }
            .rdp-selected {
              background-color: #3b82f6 !important;
              color: white !important;
            }
            .rdp-range_middle {
              background-color: #dbeafe !important;
            }
          `}</style>
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleRangeSelect}
            numberOfMonths={2}
          />
        </div>
      )}
    </div>
  );
}
