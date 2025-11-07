"use client";

import React from "react";
import type { RepositoryMetadata } from "@/lib/types";
import {
  formatStarCount,
  formatRelativeTime,
  formatDateShort,
  formatRepositoryLanguage,
  formatBoolean,
  truncateText,
  createRepositoryMetadataLabels
} from "@/utils/format";
import LoadingSpinner from "./LoadingSpinner";

// Icon components
const StarIcon = ({ className = "w-4 h-4", ...props }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" {...props}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const GlobeIcon = ({ className = "w-4 h-4", ...props }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);

const LockIcon = ({ className = "w-4 h-4", ...props }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
  </svg>
);

const CalendarIcon = ({ className = "w-4 h-4", ...props }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
  </svg>
);

const CodeIcon = ({ className = "w-4 h-4", ...props }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
  </svg>
);

const FileTextIcon = ({ className = "w-4 h-4", ...props }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
  </svg>
);

interface RepositoryMetadataDisplayProps {
  metadata?: RepositoryMetadata | null;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

export default function RepositoryMetadataDisplay({
  metadata,
  isLoading = false,
  error,
  className = ""
}: RepositoryMetadataDisplayProps) {
  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="flex items-center justify-center space-x-3">
          <LoadingSpinner size="medium" />
          <span className="text-gray-600 dark:text-gray-400">Loading repository information...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 ${className}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <FileTextIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Repository Not Found</h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!metadata) {
    return null;
  }

  const labels = createRepositoryMetadataLabels(metadata);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <span className="truncate" title={metadata.fullName}>
              {metadata.name}
            </span>
            <div className="flex items-center space-x-1">
              {metadata.private ? (
                <div title="Private repository">
                  <LockIcon className="w-4 h-4 text-amber-500" />
                </div>
              ) : (
                <div title="Public repository">
                  <GlobeIcon className="w-4 h-4 text-green-500" />
                </div>
              )}
            </div>
          </h2>
          <p 
            className="text-sm text-gray-600 dark:text-gray-400 mt-1"
            title={metadata.fullName}
          >
            {metadata.fullName}
          </p>
        </div>
        
        {/* Star Count */}
        <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg">
          <StarIcon className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {formatStarCount(metadata.stargazersCount)}
          </span>
        </div>
      </div>

      {/* Description */}
      {metadata.description && (
        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {truncateText(metadata.description, 200)}
          </p>
        </div>
      )}

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Language */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <CodeIcon className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Language</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {formatRepositoryLanguage(metadata.language)}
            </p>
          </div>
        </div>

        {/* Visibility */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          {metadata.private ? (
            <LockIcon className="w-4 h-4 text-amber-500" />
          ) : (
            <GlobeIcon className="w-4 h-4 text-green-500" />
          )}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Visibility</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {formatBoolean(metadata.private, 'Private', 'Public')}
            </p>
          </div>
        </div>

        {/* Created */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <CalendarIcon className="w-4 h-4 text-purple-500" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {formatDateShort(metadata.createdAt)}
            </p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <CalendarIcon className="w-4 h-4 text-indigo-500" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Last Updated</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {formatRelativeTime(metadata.updatedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Repository Link */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <a
          href={metadata.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200"
          aria-label={`View ${metadata.fullName} on GitHub`}
        >
          <GlobeIcon className="w-4 h-4" />
          <span>View on GitHub</span>
        </a>
      </div>

      {/* Accessibility Labels (Hidden) */}
      <div className="sr-only">
        <div aria-label={labels.name}></div>
        <div aria-label={labels.description}></div>
        <div aria-label={labels.stars}></div>
        <div aria-label={labels.language}></div>
        <div aria-label={labels.visibility}></div>
        <div aria-label={labels.created}></div>
        <div aria-label={labels.updated}></div>
      </div>
    </div>
  );
}
