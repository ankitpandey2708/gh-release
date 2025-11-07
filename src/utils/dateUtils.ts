/**
 * Date formatting utilities for GitHub Release Analysis application
 * These utilities provide consistent date formatting and parsing across the application
 */

import { format as formatDate, parseISO, isValid, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';

/**
 * Chart-specific date formatting configuration
 */
export interface ChartDateFormat {
  xAxis: string;      // Format for X-axis labels (e.g., "MMM YYYY")
  tooltip: string;    // Format for tooltip display
  tick: string;       // Format for tick marks
  full: string;       // Full date format
}

/**
 * Date formatting presets for different use cases
 */
export const CHART_DATE_FORMATS: Record<string, ChartDateFormat> = {
  // Monthly format for release analysis
  monthly: {
    xAxis: 'MMM yyyy',
    tooltip: 'MMM dd, yyyy',
    tick: 'MMM',
    full: 'MMM dd, yyyy'
  },
  
  // Quarterly format for longer time spans
  quarterly: {
    xAxis: 'MMM yyyy',
    tooltip: 'MMM dd, yyyy',
    tick: 'MMM',
    full: 'MMM dd, yyyy'
  },
  
  // Yearly format for very long time spans
  yearly: {
    xAxis: 'yyyy',
    tooltip: 'MMM dd, yyyy',
    tick: 'MMM',
    full: 'MMM dd, yyyy'
  }
};

/**
 * Format date for chart X-axis
 * @param date - Date to format
 * @param format - Date format preset
 * @returns Formatted date string
 */
export function formatChartDate(date: Date | string, formatType: string = 'monthly'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid Date';
    }
    
    return formatDate(dateObj, CHART_DATE_FORMATS[formatType]?.xAxis || CHART_DATE_FORMATS.monthly.xAxis);
  } catch (error) {
    console.warn('Error formatting chart date:', error);
    return 'Invalid Date';
  }
}

/**
 * Format date for chart tooltip
 * @param date - Date to format
 * @param format - Date format preset
 * @returns Formatted date string
 */
export function formatTooltipDate(date: Date | string, formatType: string = 'monthly'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid Date';
    }
    
    return formatDate(dateObj, CHART_DATE_FORMATS[formatType]?.tooltip || CHART_DATE_FORMATS.monthly.tooltip);
  } catch (error) {
    console.warn('Error formatting tooltip date:', error);
    return 'Invalid Date';
  }
}

/**
 * Format date for tick marks
 * @param date - Date to format
 * @param format - Date format preset
 * @returns Formatted date string
 */
export function formatTickDate(date: Date | string, formatType: string = 'monthly'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid';
    }
    
    return formatDate(dateObj, CHART_DATE_FORMATS[formatType]?.tick || CHART_DATE_FORMATS.monthly.tick);
  } catch (error) {
    console.warn('Error formatting tick date:', error);
    return 'Invalid';
  }
}

/**
 * Format date for display
 * @param date - Date to format
 * @param format - Date format string
 * @returns Formatted date string
 */
export function formatDisplayDate(date: Date | string, format: string = 'MMM dd, yyyy'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid Date';
    }
    
    return formatDate(dateObj, format);
  } catch (error) {
    console.warn('Error formatting display date:', error);
    return 'Invalid Date';
  }
}

/**
 * Parse GitHub API date string
 * @param dateString - Date string from GitHub API
 * @returns Parsed Date object
 */
export function parseGitHubDate(dateString: string): Date {
  try {
    // GitHub API returns dates in ISO format
    const date = parseISO(dateString);
    
    if (!isValid(date)) {
      throw new Error('Invalid date string');
    }
    
    return date;
  } catch (error) {
    console.warn('Error parsing GitHub date:', error);
    return new Date(); // Return current date as fallback
  }
}

/**
 * Calculate time difference in days
 * @param date1 - First date
 * @param date2 - Second date (defaults to current date)
 * @returns Number of days difference
 */
export function daysDifference(date1: Date | string, date2: Date | string = new Date()): number {
  try {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    
    if (!isValid(d1) || !isValid(d2)) {
      return 0;
    }
    
    return Math.abs(differenceInDays(d2, d1));
  } catch (error) {
    console.warn('Error calculating days difference:', error);
    return 0;
  }
}

/**
 * Calculate time difference in months
 * @param date1 - First date
 * @param date2 - Second date (defaults to current date)
 * @returns Number of months difference
 */
export function monthsDifference(date1: Date | string, date2: Date | string = new Date()): number {
  try {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    
    if (!isValid(d1) || !isValid(d2)) {
      return 0;
    }
    
    return Math.abs(differenceInMonths(d2, d1));
  } catch (error) {
    console.warn('Error calculating months difference:', error);
    return 0;
  }
}

/**
 * Calculate time difference in years
 * @param date1 - First date
 * @param date2 - Second date (defaults to current date)
 * @returns Number of years difference
 */
export function yearsDifference(date1: Date | string, date2: Date | string = new Date()): number {
  try {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    
    if (!isValid(d1) || !isValid(d2)) {
      return 0;
    }
    
    return Math.abs(differenceInYears(d2, d1));
  } catch (error) {
    console.warn('Error calculating years difference:', error);
    return 0;
  }
}

/**
 * Get human readable time difference
 * @param date - Date to compare with current date
 * @returns Human readable string
 */
export function getTimeAgo(date: Date | string): string {
  try {
    const targetDate = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(targetDate)) {
      return 'Unknown';
    }
    
    const now = new Date();
    const days = daysDifference(targetDate, now);
    
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return '1 day ago';
    } else if (days < 7) {
      return `${days} days ago`;
    } else if (days < 30) {
      const weeks = Math.floor(days / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else if (days < 365) {
      const months = Math.floor(days / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
      const years = Math.floor(days / 365);
      return years === 1 ? '1 year ago' : `${years} years ago`;
    }
  } catch (error) {
    console.warn('Error calculating time ago:', error);
    return 'Unknown';
  }
}

/**
 * Get relative time for dates (e.g., "in 3 days", "2 months ago")
 * @param date - Date to compare
 * @param referenceDate - Reference date (defaults to current date)
 * @returns Relative time string
 */
export function getRelativeTime(date: Date | string, referenceDate: Date | string = new Date()): string {
  try {
    const targetDate = typeof date === 'string' ? parseISO(date) : date;
    const refDate = typeof referenceDate === 'string' ? parseISO(referenceDate) : referenceDate;
    
    if (!isValid(targetDate) || !isValid(refDate)) {
      return 'Invalid date';
    }
    
    const days = differenceInDays(targetDate, refDate);
    
    if (days === 0) {
      return 'Today';
    } else if (days > 0) {
      if (days === 1) {
        return 'Tomorrow';
      } else if (days < 7) {
        return `In ${days} days`;
      } else if (days < 30) {
        const weeks = Math.floor(days / 7);
        return weeks === 1 ? 'In 1 week' : `In ${weeks} weeks`;
      } else if (days < 365) {
        const months = Math.floor(days / 30);
        return months === 1 ? 'In 1 month' : `In ${months} months`;
      } else {
        const years = Math.floor(days / 365);
        return years === 1 ? 'In 1 year' : `In ${years} years`;
      }
    } else {
      // Past dates
      const absDays = Math.abs(days);
      if (absDays === 1) {
        return '1 day ago';
      } else if (absDays < 7) {
        return `${absDays} days ago`;
      } else if (absDays < 30) {
        const weeks = Math.floor(absDays / 7);
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
      } else if (absDays < 365) {
        const months = Math.floor(absDays / 30);
        return months === 1 ? '1 month ago' : `${months} months ago`;
      } else {
        const years = Math.floor(absDays / 365);
        return years === 1 ? '1 year ago' : `${years} years ago`;
      }
    }
  } catch (error) {
    console.warn('Error calculating relative time:', error);
    return 'Unknown';
  }
}

/**
 * Get date range preset
 * @param preset - Preset name ('30days', '90days', '1year', 'alltime')
 * @returns Object with start and end dates
 */
export function getDateRangePreset(preset: string): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Normalize to start of day
  
  switch (preset) {
    case '30days':
      return {
        start: new Date(end.getTime() - (30 * 24 * 60 * 60 * 1000)),
        end
      };
    
    case '90days':
      return {
        start: new Date(end.getTime() - (90 * 24 * 60 * 60 * 1000)),
        end
      };
    
    case '1year':
      return {
        start: new Date(end.getTime() - (365 * 24 * 60 * 60 * 1000)),
        end
      };
    
    case 'alltime':
    default:
      // Return a very old date for all time
      return {
        start: new Date(2008, 0, 1), // GitHub was founded in 2008
        end
      };
  }
}

/**
 * Check if a date is within a given range
 * @param date - Date to check
 * @param startDate - Start of range
 * @param endDate - End of range
 * @returns True if date is within range
 */
export function isDateInRange(date: Date | string, startDate: Date, endDate: Date): boolean {
  try {
    const targetDate = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(targetDate)) {
      return false;
    }
    
    return targetDate >= startDate && targetDate <= endDate;
  } catch (error) {
    console.warn('Error checking date range:', error);
    return false;
  }
}

/**
 * Format date for different time zones
 * @param date - Date to format
 * @param timeZone - Time zone string
 * @param format - Date format string
 * @returns Formatted date string
 */
export function formatDateInTimeZone(date: Date | string, timeZone: string, format: string = 'MMM dd, yyyy'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid Date';
    }
    
    // Use Intl.DateTimeFormat for timezone support
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: format.includes('MMM') ? 'short' : '2-digit',
      day: '2-digit',
      ...(format.includes('yyyy') ? {} : { year: undefined })
    }).format(dateObj);
  } catch (error) {
    console.warn('Error formatting date in timezone:', error);
    return 'Invalid Date';
  }
}

/**
 * Get month and year from date
 * @param date - Date to parse
 * @returns Object with month and year
 */
export function getMonthYear(date: Date | string): { month: number; year: number } {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return { month: 0, year: 0 };
    }
    
    return {
      month: dateObj.getMonth() + 1, // JavaScript months are 0-indexed
      year: dateObj.getFullYear()
    };
  } catch (error) {
    console.warn('Error getting month year:', error);
    return { month: 0, year: 0 };
  }
}

/**
 * Create date from month and year
 * @param month - Month (1-12)
 * @param year - Year
 * @returns Date object
 */
export function createDateFromMonthYear(month: number, year: number): Date {
  try {
    return new Date(year, month - 1, 1); // JavaScript months are 0-indexed
  } catch (error) {
    console.warn('Error creating date from month year:', error);
    return new Date();
  }
}
