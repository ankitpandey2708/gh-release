"use client";

import React from "react";
import { ValidationState } from "@/utils/validation";

interface ValidationIconProps {
  state: ValidationState;
  className?: string;
}

export default function ValidationIcon({ state, className = "" }: ValidationIconProps) {
  const renderIcon = () => {
    switch (state) {
      case 'valid':
        return (
          <svg
            className="w-5 h-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case 'invalid':
        return (
          <svg
            className="w-5 h-5 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      case 'pending':
        return (
          <div className="w-5 h-5">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        );
      case 'empty':
      default:
        return null;
    }
  };

  if (state === 'empty') {
    return null;
  }

  return (
    <div
      className={`
        absolute right-3 top-1/2 transform -translate-y-1/2
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        ${className}
      `}
      aria-live="polite"
      role="status"
    >
      {renderIcon()}
    </div>
  );
}
