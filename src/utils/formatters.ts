/**
 * Formatting utilities for the GitHub Release Analyzer
 */

/**
 * Format star count with K/M abbreviations
 * @param count - The number of stars
 * @returns Formatted string (e.g., "1.2K", "3.4M")
 */
export function formatStarCount(count: number): string {
  if (count < 1000) {
    return count.toString();
  }
  
  if (count < 1000000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  
  return `${(count / 1000000).toFixed(1)}M`;
}

/**
 * Format number with locale-specific formatting
 * @param number - The number to format
 * @param locale - The locale to use (default: 'en-US')
 * @returns Formatted number string
 */
export function formatNumberWithLocale(number: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(number);
}

/**
 * Format date to a readable string
 * @param date - The date to format
 * @param locale - The locale to use (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, locale: string = 'en-US'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Format relative time (e.g., "2 days ago", "3 months ago")
 * @param date - The date to format relatively
 * @param locale - The locale to use (default: 'en-US')
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string, locale: string = 'en-US'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
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
 * Format repository language with proper casing
 * @param language - The programming language
 * @returns Properly formatted language name
 */
export function formatLanguage(language: string | null): string {
  if (!language) {
    return 'Not specified';
  }
  
  // Common language name corrections
  const languageMap: Record<string, string> = {
    'JavaScript': 'JavaScript',
    'TypeScript': 'TypeScript',
    'Python': 'Python',
    'Java': 'Java',
    'C#': 'C#',
    'C++': 'C++',
    'Go': 'Go',
    'Rust': 'Rust',
    'Ruby': 'Ruby',
    'PHP': 'PHP',
    'Swift': 'Swift',
    'Kotlin': 'Kotlin',
    'Dart': 'Dart',
    'HTML': 'HTML',
    'CSS': 'CSS',
    'Shell': 'Shell',
    'PowerShell': 'PowerShell',
  };
  
  return languageMap[language] || language;
}

/**
 * Format file size with appropriate units
 * @param bytes - Size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Truncate text to a maximum length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default: 100)
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Format repository description with fallbacks
 * @param description - Repository description
 * @param maxLength - Maximum length for truncation
 * @returns Formatted description
 */
export function formatDescription(description: string | null, maxLength: number = 200): string {
  if (!description) {
    return 'No description available';
  }
  
  return truncateText(description, maxLength);
}

/**
 * Format repository URL for display
 * @param url - GitHub repository URL
 * @returns Display-friendly URL
 */
export function formatRepositoryUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + urlObj.pathname;
  } catch {
    return url;
  }
}
