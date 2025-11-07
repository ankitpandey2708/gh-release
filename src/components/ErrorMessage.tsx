"use client";

import React from "react";

interface ErrorMessageProps {
  message?: string;
  className?: string;
  isVisible?: boolean;
}

export default function ErrorMessage({ 
  message, 
  className = "",
  isVisible = true 
}: ErrorMessageProps) {
  if (!isVisible || !message) {
    return null;
  }

  return (
    <div
      className={`
        mt-2 p-3 bg-red-50 dark:bg-red-900/20 
        border border-red-200 dark:border-red-800
        rounded-lg text-red-700 dark:text-red-400
        text-sm transition-all duration-300 ease-in-out
        ${className}
      `}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start gap-2">
        <svg
          className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
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
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p>{message}</p>
      </div>
    </div>
  );
}
