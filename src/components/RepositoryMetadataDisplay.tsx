"use client";

import React from 'react';
import { GitHubApiError } from '@/services/githubApi';
import { formatStarCount, formatDate, formatRelativeTime, formatDescription, formatLanguage } from '@/utils/formatters';
import type { RepositoryMetadata } from '@/lib/types';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';

interface RepositoryMetadataDisplayProps {
  metadata?: RepositoryMetadata;
  isLoading?: boolean;
  error?: string;
  repositoryName?: string;
  className?: string;
}

interface StarCountProps {
  count: number;
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  ariaLabel?: string;
}

/**
 * Star count component with formatted display
 */
function StarCount({ count }: StarCountProps) {
  return (
    <div className="flex items-center gap-2" aria-label={`${count} stars`}>
      <svg
        className="w-4 h-4 text-yellow-500"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className="font-medium text-gray-900 dark:text-gray-100">
        {formatStarCount(count)}
      </span>
    </div>
  );
}

/**
 * Individual stat item component
 */
function StatItem({ icon, label, value, href, ariaLabel }: StatItemProps) {
  const content = (
    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
      <div className="text-gray-600 dark:text-gray-400" aria-hidden="true">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate" aria-label={ariaLabel || label}>
          {label}
        </p>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
        aria-label={ariaLabel || `${label}: ${value}`}
      >
        {content}
      </a>
    );
  }

  return content;
}

/**
 * Repository metadata display component
 */
export default function RepositoryMetadataDisplay({
  metadata,
  isLoading = false,
  error,
  repositoryName,
  className = ''
}: RepositoryMetadataDisplayProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="flex items-center justify-center gap-3 py-8">
          <LoadingSpinner size="medium" />
          <div className="text-left">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
              {repositoryName ? `Analyzing ${repositoryName}...` : 'Analyzing repository...'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Fetching repository metadata
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
        <ErrorMessage
          message={error}
          isVisible={true}
          className="p-6"
        />
        {repositoryName && (
          <div className="px-6 pb-6 text-sm text-gray-600 dark:text-gray-400">
            <p>Attempted to analyze: <span className="font-mono text-gray-800 dark:text-gray-200">{repositoryName}</span></p>
            <p className="mt-1">Please verify the repository exists and is public.</p>
          </div>
        )}
      </div>
    );
  }

  // No data state
  if (!metadata) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No repository metadata available</p>
        </div>
      </div>
    );
  }

  // Success state - display repository metadata
  const createdAtDate = new Date(metadata.createdAt);
  const updatedAtDate = new Date(metadata.updatedAt);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate" aria-label={`Repository: ${metadata.name}`}>
              {metadata.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate" aria-label={`Full name: ${metadata.fullName}`}>
              {metadata.fullName}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {metadata.private ? 'Private' : 'Public'}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {formatLanguage(metadata.language)}
              </span>
            </div>
          </div>
          
          {/* Star Count */}
          <StarCount count={metadata.stargazersCount} />
        </div>

        {/* Description */}
        {metadata.description && (
          <div className="mt-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed" aria-label="Repository description">
              {formatDescription(metadata.description, 300)}
            </p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            }
            label="Stars"
            value={formatStarCount(metadata.stargazersCount)}
            ariaLabel={`Total stars: ${metadata.stargazersCount}`}
          />
          
          <StatItem
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            }
            label="Created"
            value={formatRelativeTime(createdAtDate)}
            ariaLabel={`Created on ${formatDate(createdAtDate)}`}
          />
          
          <StatItem
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            }
            label="Last updated"
            value={formatRelativeTime(updatedAtDate)}
            ariaLabel={`Last updated on ${formatDate(updatedAtDate)}`}
          />
          
          <StatItem
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
            }
            label="Repository"
            value="View on GitHub"
            href={metadata.url}
            ariaLabel={`View repository on GitHub: ${metadata.fullName}`}
          />
        </div>
      </div>
    </div>
  );
}
