/**
 * Utility functions for formatting numbers and text display
 */

/**
 * Format large numbers with K, M, B abbreviations
 * @param count - The number to format
 * @returns Formatted string (e.g., "1.2K", "3.4M")
 */
export function formatStarCount(count: number): string {
  if (count === 0) return "0";
  
  const billion = Math.pow(10, 9);
  const million = Math.pow(10, 6);
  const thousand = Math.pow(10, 3);

  if (count >= billion) {
    return (count / billion).toFixed(1).replace(/\.0$/, '') + 'B';
  } else if (count >= million) {
    return (count / million).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (count >= thousand) {
    return (count / thousand).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  
  return count.toString();
}

/**
 * Format repository star count with proper locale support
 * @param count - The star count number
 * @param locale - Locale string for number formatting (default: 'en-US')
 * @returns Formatted string with proper separators
 */
export function formatStarCountWithLocale(count: number, locale: string = 'en-US'): string {
  if (count === 0) return "0";
  
  if (count >= 1000) {
    return formatStarCount(count);
  }
  
  return new Intl.NumberFormat(locale).format(count);
}

/**
 * Format date to a human-readable relative time
 * @param date - The date to format
 * @param locale - Locale string for date formatting (default: 'en-US')
 * @returns Human-readable relative time string
 */
export function formatRelativeTime(date: string | Date, locale: string = 'en-US'): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
}

/**
 * Format date to a short date string
 * @param date - The date to format
 * @param locale - Locale string for date formatting (default: 'en-US')
 * @returns Formatted date string (e.g., "Jan 15, 2023")
 */
export function formatDateShort(date: string | Date, locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
}

/**
 * Format a boolean value for display
 * @param value - The boolean value
 * @param trueText - Text to show when true (default: 'Yes')
 * @param falseText - Text to show when false (default: 'No')
 * @returns Display text for the boolean value
 */
export function formatBoolean(value: boolean, trueText: string = 'Yes', falseText: string = 'No'): string {
  return value ? trueText : falseText;
}

/**
 * Truncate text to a specified length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @param suffix - Suffix to add when truncating (default: '...')
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Format repository language for display
 * @param language - The language string (can be null)
 * @returns Display text for the language
 */
export function formatRepositoryLanguage(language: string | null): string {
  if (!language) return 'Not specified';
  return language;
}

/**
 * Format repository name for display
 * @param fullName - The full repository name (owner/repo)
 * @returns Display name without owner prefix
 */
export function formatRepositoryDisplayName(fullName: string): string {
  return fullName.split('/').pop() || fullName;
}

/**
 * Format repository description with fallback
 * @param description - Repository description (can be null)
 * @param repoName - Repository name for fallback
 * @returns Formatted description or default text
 */
export function formatRepositoryDescription(description: string | null, repoName: string): string {
  if (description) {
    return truncateText(description, 150);
  }
  return `This repository ${repoName} doesn't have a description yet.`;
}

/**
 * Format access status for repository
 * @param isPrivate - Whether repository is private
 * @returns Formatted access status text
 */
export function formatAccessStatus(isPrivate: boolean): string {
  return isPrivate ? 'Private' : 'Public';
}

/**
 * Format date to readable format
 * @param date - Date string or Date object
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

/**
 * Format language for display
 * @param language - Language string (can be null)
 * @returns Formatted language string
 */
export function formatLanguage(language: string | null): string {
  return formatRepositoryLanguage(language);
}

/**
 * Create accessible label text for repository metadata
 * @param metadata - Repository metadata object
 * @returns Object with accessible labels for screen readers
 */
export function createRepositoryMetadataLabels(metadata: any) {
  return {
    name: `Repository name: ${metadata.name}`,
    description: metadata.description 
      ? `Description: ${truncateText(metadata.description, 100)}`
      : 'No description provided',
    stars: `Stargazers count: ${formatStarCountWithLocale(metadata.stargazersCount)}`,
    language: `Primary language: ${formatRepositoryLanguage(metadata.language)}`,
    visibility: `Visibility: ${formatBoolean(metadata.private, 'Private', 'Public')}`,
    created: `Created: ${formatDateShort(metadata.createdAt)}`,
    updated: `Last updated: ${formatRelativeTime(metadata.updatedAt)}`
  };
}
