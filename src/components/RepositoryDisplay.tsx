"use client";

import React from 'react';
import { 
  formatStarCount, 
  formatLanguage, 
  formatRepositoryDisplayName, 
  formatRepositoryDescription,
  formatAccessStatus,
  formatDate,
  formatRelativeTime 
} from '@/utils/format';
import type { RepositoryMetadata } from '@/lib/types';

interface RepositoryDisplayProps {
  repository: RepositoryMetadata;
  className?: string;
}

export default function RepositoryDisplay({ repository, className = "" }: RepositoryDisplayProps) {
  const {
    name,
    fullName,
    description,
    stargazersCount,
    language,
    url,
    private: isPrivate,
    createdAt,
    updatedAt,
  } = repository;

  const displayName = formatRepositoryDisplayName(fullName);
  const displayDescription = formatRepositoryDescription(description, fullName);
  const displayLanguage = formatLanguage(language);
  const formattedStarCount = formatStarCount(stargazersCount);
  const accessStatus = formatAccessStatus(isPrivate);
  const createdDate = formatDate(createdAt);
  const updatedDate = formatDate(updatedAt);
  const relativeUpdatedDate = formatRelativeTime(updatedAt);

  return (
    <div 
      className={`
        bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
        p-6 shadow-sm hover:shadow-md transition-shadow duration-200
        ${className}
      `}
      role="region"
      aria-label={`Repository information for ${displayName}`}
    >
      {/* Repository Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label={`Visit ${displayName} on GitHub`}
            >
              {displayName}
            </a>
          </h2>
          
          {/* Access Status Badge */}
          <div className="flex items-center gap-2 mt-1">
            <span 
              className={`
                inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                ${isPrivate 
                  ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' 
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }
              `}
              aria-label={`Repository visibility: ${accessStatus}`}
            >
              {accessStatus}
            </span>
            
            {/* Language */}
            {language && (
              <span 
                className="text-sm text-gray-600 dark:text-gray-400"
                aria-label={`Primary language: ${displayLanguage}`}
              >
                {displayLanguage}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Repository Description */}
      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {displayDescription}
        </p>
      </div>

      {/* Repository Stats */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
        {/* Stars */}
        <div className="flex items-center gap-1">
          <svg 
            className="w-4 h-4 text-yellow-500" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span 
            className="font-medium text-gray-900 dark:text-gray-100"
            aria-label={`${stargazersCount} stars`}
          >
            {formattedStarCount}
          </span>
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-1">
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span 
            title={`Created on ${createdDate}, last updated ${relativeUpdatedDate}`}
            aria-label={`Created on ${createdDate}, last updated ${relativeUpdatedDate}`}
          >
            Created {createdDate}
          </span>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-1">
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span 
            aria-label={`Last updated ${relativeUpdatedDate}`}
          >
            Updated {relativeUpdatedDate}
          </span>
        </div>
      </div>

      {/* Repository URL */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors"
          aria-label={`Open ${displayName} on GitHub`}
        >
          <svg 
            className="w-4 h-4" 
            fill="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          View on GitHub
        </a>
      </div>
    </div>
  );
}
