/**
 * Chart theme configuration for Recharts
 * This file provides custom theming for all chart components using the design system colors
 */

import { ChartTheme } from './types';
import { 
  getChartColors, 
  chartSemanticColors, 
  colorUtils, 
  type ChartColors 
} from '@/styles/colors';

/**
 * Base chart theme configuration
 */
export const createBaseChartTheme = (isDark: boolean = false): ChartTheme => {
  const colors = getChartColors(isDark);
  
  return {
    name: isDark ? 'dark' : 'light',
    colors: {
      primary: colors.primary,
      secondary: colors.secondary,
      tertiary: colors.tertiary,
      success: colors.success,
      error: colors.error,
      warning: colors.warning,
      info: colors.info,
      grid: colors.grid,
      axis: colors.axis,
      text: colors.tooltip.text,
      textSecondary: isDark ? '#D1D5DB' : '#6B7280',
      background: isDark ? '#1F2937' : '#FFFFFF',
      tooltip: {
        background: colors.tooltip.background,
        border: colors.tooltip.border,
        text: colors.tooltip.text
      }
    },
    fonts: {
      family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      size: {
        small: 12,
        medium: 14,
        large: 16
      }
    },
    spacing: {
      small: 4,
      medium: 8,
      large: 16
    },
    borderRadius: {
      small: 4,
      medium: 8,
      large: 12
    },
    shadows: {
      small: isDark ? '0 1px 2px 0 rgba(0, 0, 0, 0.3)' : '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
      medium: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      large: isDark ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    animation: {
      duration: 300,
      easing: 'ease-in-out'
    }
  };
};

/**
 * Light theme configuration
 */
export const lightTheme: ChartTheme = createBaseChartTheme(false);

/**
 * Dark theme configuration
 */
export const darkTheme: ChartTheme = createBaseChartTheme(true);

/**
 * Default theme (light theme by default)
 */
export const defaultTheme = lightTheme;

/**
 * Get theme based on user preference
 */
export function getTheme(theme: 'light' | 'dark' | 'auto' = 'light'): ChartTheme {
  if (theme === 'auto') {
    // Check system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? darkTheme : lightTheme;
  }
  
  return theme === 'dark' ? darkTheme : lightTheme;
}

/**
 * Recharts theme configuration for CSS variables
 */
export const rechartsThemeConfig = {
  // Grid configuration
  grid: {
    stroke: '#E5E7EB',
    strokeWidth: 1,
    strokeDasharray: '3 3'
  },
  
  // Axis configuration
  axis: {
    stroke: '#6B7280',
    strokeWidth: 1,
    fontSize: 12,
    fontFamily: "'Inter', sans-serif",
    fill: '#6B7280'
  },
  
  // Tooltip configuration
  tooltip: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    fill: '#F9FAFB',
    labelColor: '#D1D5DB',
    itemStyle: {
      color: '#F9FAFB'
    }
  },
  
  // Legend configuration
  legend: {
    fontSize: 12,
    fontFamily: "'Inter', sans-serif",
    fill: '#6B7280',
    iconSize: 8,
    iconType: 'line' as const
  },
  
  // Cartesian grid configuration
  cartesianGrid: {
    stroke: '#E5E7EB',
    strokeWidth: 1,
    strokeDasharray: '3 3',
    vertical: false
  }
};

/**
 * Dark theme configuration for Recharts
 */
export const rechartsDarkThemeConfig = {
  // Grid configuration
  grid: {
    stroke: '#374151',
    strokeWidth: 1,
    strokeDasharray: '3 3'
  },
  
  // Axis configuration
  axis: {
    stroke: '#9CA3AF',
    strokeWidth: 1,
    fontSize: 12,
    fontFamily: "'Inter', sans-serif",
    fill: '#9CA3AF'
  },
  
  // Tooltip configuration
  tooltip: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    fill: '#F9FAFB',
    labelColor: '#D1D5DB',
    itemStyle: {
      color: '#F9FAFB'
    }
  },
  
  // Legend configuration
  legend: {
    fontSize: 12,
    fontFamily: "'Inter', sans-serif",
    fill: '#9CA3AF',
    iconSize: 8,
    iconType: 'line' as const
  },
  
  // Cartesian grid configuration
  cartesianGrid: {
    stroke: '#374151',
    strokeWidth: 1,
    strokeDasharray: '3 3',
    vertical: false
  }
};

/**
 * Animation configurations for charts
 */
export const chartAnimations = {
  // Fast animation (200ms)
  fast: {
    duration: 200,
    delay: 0,
    easing: 'ease-in-out' as const
  },
  
  // Normal animation (300ms)
  normal: {
    duration: 300,
    delay: 0,
    easing: 'ease-in-out' as const
  },
  
  // Slow animation (500ms)
  slow: {
    duration: 500,
    delay: 100,
    easing: 'ease-in-out' as const
  },
  
  // Staggered animation for multiple elements
  staggered: {
    duration: 400,
    delay: 50,
    easing: 'ease-in-out' as const
  }
};

/**
 * Chart color palettes
 */
export const chartColorPalettes = {
  // Primary palette (blues and grays)
  primary: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB',
    gradient: ['#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8']
  },
  
  // Success palette (greens)
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
    gradient: ['#D1FAE5', '#A7F3D0', '#6EE7B7', '#34D399', '#10B981', '#059669', '#047857']
  },
  
  // Warning palette (ambers)
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
    gradient: ['#FEF3C7', '#FDE68A', '#FCD34D', '#FBBF24', '#F59E0B', '#D97706', '#B45309']
  },
  
  // Error palette (reds)
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
    gradient: ['#FEE2E2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#B91C1C']
  },
  
  // Comparison palette (multiple distinct colors)
  comparison: [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#8B5CF6', // Purple
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#EC4899', // Pink
    '#6366F1'  // Indigo
  ],
  
  // Monochrome palette (grays)
  monochrome: {
    light: '#F3F4F6',
    medium: '#9CA3AF',
    dark: '#374151',
    gradient: ['#F9FAFB', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', '#374151']
  }
};

/**
 * Get color palette for chart type
 */
export function getColorPalette(type: 'primary' | 'success' | 'warning' | 'error' | 'comparison' | 'monochrome', count: number = 5): string[] {
  const palette = chartColorPalettes[type];
  
  if (Array.isArray(palette)) {
    return palette.slice(0, count);
  } else if (typeof palette === 'object' && palette.gradient) {
    return palette.gradient.slice(0, count);
  }
  
  return chartColorPalettes.comparison.slice(0, count);
}

/**
 * Chart styling utilities
 */
export const chartStyles = {
  // Container styles
  container: {
    backgroundColor: 'transparent',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  },
  
  // Title styles
  title: {
    fontSize: '18px',
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    fill: '#111827',
    marginBottom: '8px'
  },
  
  // Subtitle styles
  subtitle: {
    fontSize: '14px',
    fontWeight: 400,
    fontFamily: "'Inter', sans-serif",
    fill: '#6B7280',
    marginBottom: '16px'
  },
  
  // Axis label styles
  axisLabel: {
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
    fill: '#6B7280'
  },
  
  // Data point styles
  dataPoint: {
    fill: '#3B82F6',
    stroke: '#FFFFFF',
    strokeWidth: 2,
    r: 4
  },
  
  // Line styles
  line: {
    strokeWidth: 2,
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const
  },
  
  // Bar styles
  bar: {
    fill: '#3B82F6',
    stroke: 'transparent',
    strokeWidth: 0
  }
};

/**
 * Dark theme chart styles
 */
export const darkChartStyles = {
  ...chartStyles,
  title: {
    ...chartStyles.title,
    fill: '#F9FAFB'
  },
  subtitle: {
    ...chartStyles.subtitle,
    fill: '#D1D5DB'
  },
  axisLabel: {
    ...chartStyles.axisLabel,
    fill: '#D1D5DB'
  },
  dataPoint: {
    ...chartStyles.dataPoint,
    fill: '#60A5FA',
    stroke: '#1F2937'
  }
};

/**
 * Export theme utilities
 */
export const themeUtils = {
  /**
   * Check if color combination meets accessibility standards
   */
  checkAccessibility: (foreground: string, background: string): boolean => {
    return colorUtils.meetsWCAG_AA(foreground, background);
  },
  
  /**
   * Get contrast ratio
   */
  getContrast: (foreground: string, background: string): number => {
    return colorUtils.getContrastRatio(foreground, background);
  },
  
  /**
   * Generate color with opacity
   */
  withOpacity: (color: string, opacity: number): string => {
    return colorUtils.hexToRgba(color, opacity);
  },
  
  /**
   * Get themed color based on theme preference
   */
  getThemedColor: (light: string, dark: string, theme: 'light' | 'dark'): string => {
    return theme === 'dark' ? dark : light;
  }
};
