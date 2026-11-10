"use client";

import { useRef, useEffect } from "react";
import AirDatepicker from "air-datepicker";
import localeEn from "air-datepicker/locale/en";
import "air-datepicker/air-datepicker.css";
import { format, parseISO } from "date-fns";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClear: () => void;
}

function CalendarIcon() {
  return (
    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
}: DateRangePickerProps) {
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  const startPickerRef = useRef<AirDatepicker<HTMLInputElement> | null>(null);
  const endPickerRef = useRef<AirDatepicker<HTMLInputElement> | null>(null);
  // Latest callbacks, so the pickers (created once) never call a stale closure.
  const onStartRef = useRef(onStartDateChange);
  const onEndRef = useRef(onEndDateChange);
  onStartRef.current = onStartDateChange;
  onEndRef.current = onEndDateChange;

  // Props are the single source of truth. Pickers only report user input upward;
  // the effect below pushes selection + min/max bounds back down.
  useEffect(() => {
    if (!startInputRef.current || !endInputRef.current) return;

    const toValue = (date: Date | Date[] | undefined) =>
      date instanceof Date ? format(date, "yyyy-MM-dd") : "";

    startPickerRef.current = new AirDatepicker(startInputRef.current, {
      locale: localeEn,
      dateFormat: "MMM dd, yyyy",
      onSelect: ({ date }) => onStartRef.current(toValue(date)),
    });

    endPickerRef.current = new AirDatepicker(endInputRef.current, {
      locale: localeEn,
      dateFormat: "MMM dd, yyyy",
      onSelect: ({ date }) => onEndRef.current(toValue(date)),
    });

    return () => {
      startPickerRef.current?.destroy();
      endPickerRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    const startPicker = startPickerRef.current;
    const endPicker = endPickerRef.current;
    if (!startPicker || !endPicker) return;

    const start = startDate ? parseISO(startDate) : null;
    const end = endDate ? parseISO(endDate) : null;

    startPicker.update({ maxDate: end ?? new Date() });
    endPicker.update({ minDate: start ?? false, maxDate: new Date() });

    if (start) startPicker.selectDate(start, { silent: true });
    else startPicker.clear({ silent: true });

    if (end) endPicker.selectDate(end, { silent: true });
    else endPicker.clear({ silent: true });
  }, [startDate, endDate]);

  return (
    <div className="flex items-center gap-6 w-full">
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

      <div className="flex-1 flex items-center gap-2">
        <label htmlFor="start-date" className="text-sm font-medium text-neutral-700 whitespace-nowrap">
          From:
        </label>
        <div className="relative flex-1">
          <input
            id="start-date"
            ref={startInputRef}
            type="text"
            readOnly
            placeholder="Select start date"
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-white text-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 text-sm cursor-pointer"
          />
          <CalendarIcon />
        </div>
      </div>

      <div className="flex-1 flex items-center gap-2">
        <label htmlFor="end-date" className="text-sm font-medium text-neutral-700 whitespace-nowrap">
          To:
        </label>
        <div className="relative flex-1">
          <input
            id="end-date"
            ref={endInputRef}
            type="text"
            readOnly
            placeholder="Select end date"
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-white text-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 text-sm cursor-pointer"
          />
          <CalendarIcon />
        </div>
      </div>

      {(startDate || endDate) && (
        <button
          type="button"
          onClick={onClear}
          className="text-sm text-primary-600 hover:text-primary-500 underline transition-colors font-medium whitespace-nowrap"
        >
          Clear
        </button>
      )}
    </div>
  );
}
