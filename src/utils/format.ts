/**
 * Utility functions for formatting numbers and data display
 */

/**
 * Format star count with K/M abbreviations
 * @param count - The star count number
 * @returns Formatted string (e.g., "1.2K", "5.6M", "42")
 */
export function formatStarCount(count: number): string {
  if (count === 0) return "0";
  
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    // Thousands
    const thousands = count / 1000;
    return `${thousands.toFixed(thousands < 10 ? 1 : 0)}K`;
  } else {
    // Millions
    const millions = count / 1000000;
    return `${millions.toFixed(millions < 10 ? 1 : 0)}M`;
  }
}

/**
 * Format numbers with locale-aware formatting
 * @param number - The number to format
 * @param locale - The locale to use (default: 'en-US')
 * @returns Formatted number string
 */
export function formatNumberWithLocale(number: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(number);
}

/**
 * Format date in a human-readable format
 * @param date - Date string or Date object
 * @param format - Format style: 'short', 'medium', 'long', 'full'
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, format: 'short' | 'medium' | 'long' | 'full' = 'medium'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: any = {
    year: 'numeric',
    month: format === 'short' ? 'numeric' : 'short',
    day: 'numeric',
  };
  
  if (format === 'long' || format === 'full') {
    options.weekday = 'long';
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Format relative time (e.g., "2 days ago", "in 3 hours")
 * @param date - Date string or Date object
 * @param referenceDate - Reference date (default: now)
 * @returns Relative time string
 */
export function formatRelativeTime(
  date: string | Date, 
  referenceDate: Date = new Date()
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = referenceDate;
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 0) {
    // Future date
    return formatFutureTime(Math.abs(diffInSeconds));
  } else {
    // Past date
    return formatPastTime(diffInSeconds);
  }
}

function formatPastTime(seconds: number): string {
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'just now';
}

function formatFutureTime(seconds: number): string {
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `in ${count} ${interval.label}${count > 1 ? 's' : ''}`;
    }
  }
  
  return 'in a moment';
}

/**
 * Format repository language with proper capitalization
 * @param language - Language string from GitHub API
 * @returns Properly formatted language string
 */
export function formatLanguage(language: string | null): string {
  if (!language) return 'Not specified';
  
  // Special cases for common language names
  const languageMap: Record<string, string> = {
    'c#': 'C#',
    'c++': 'C++',
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'html': 'HTML',
    'css': 'CSS',
    'php': 'PHP',
    'ruby': 'Ruby',
    'python': 'Python',
    'java': 'Java',
    'go': 'Go',
    'rust': 'Rust',
    'swift': 'Swift',
    'kotlin': 'Kotlin',
    'dart': 'Dart',
    'scala': 'Scala',
    'haskell': 'Haskell',
    'elixir': 'Elixir',
    'clojure': 'Clojure',
    'f#': 'F#',
  };
  
  const lowerLang = language.toLowerCase();
  return languageMap[lowerLang] || language.charAt(0).toUpperCase() + language.slice(1);
}

/**
 * Truncate text to a specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add (default: '...')
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Format file size in human-readable format
 * @param bytes - Size in bytes
 * @param decimals - Number of decimal places
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Generate repository display name
 * @param fullName - Repository full name (owner/repo)
 * @returns Display name for UI
 */
export function formatRepositoryDisplayName(fullName: string): string {
  return fullName;
}

/**
 * Generate repository description with fallback
 * @param description - Repository description
 * @param fullName - Repository full name for fallback
 * @returns Display description
 */
export function formatRepositoryDescription(
  description: string | null, 
  fullName: string
): string {
  if (description && description.trim()) {
    return description.trim();
  }
  
  return `Repository ${fullName} - no description available`;
}

/**
 * Format access status (public/private)
 * @param isPrivate - Whether repository is private
 * @returns Access status text
 */
export function formatAccessStatus(isPrivate: boolean): string {
  return isPrivate ? 'Private' : 'Public';
}

/**
 * Format commit message for display
 * @param message - Commit message
 * @param maxLength - Maximum length
 * @returns Formatted commit message
 */
export function formatCommitMessage(message: string, maxLength: number = 80): string {
  const cleanMessage = message.replace(/\n/g, ' ').trim();
  return truncateText(cleanMessage, maxLength);
}

/**
 * Format duration in milliseconds to human readable
 * @param duration - Duration in milliseconds
 * @returns Formatted duration string
 */
export function formatDuration(duration: number): string {
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Format percentage with proper decimal places
 * @param value - Value between 0 and 1
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format large numbers with appropriate units
 * @param value - The numeric value
 * @returns Formatted string with appropriate units
 */
export function formatLargeNumber(value: number): string {
  if (value < 1000) {
    return value.toString();
  } else if (value < 1000000) {
    return `${(value / 1000).toFixed(1)}K`;
  } else if (value < 1000000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
}
