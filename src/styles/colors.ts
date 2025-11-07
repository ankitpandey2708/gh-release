/**
 * Design system colors for the GitHub Release Analysis application
 * These colors are used throughout the application for consistent theming
 */

export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  muted: string;
}

export interface ChartColors {
  primary: string;
  secondary: string;
  tertiary: string;
  quaternary: string;
  quinary: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  gradient: string[];
  tooltip: {
    background: string;
    border: string;
    text: string;
  };
  grid: string;
  axis: string;
}

/**
 * Light theme colors
 */
export const lightTheme: ThemeColors = {
  primary: '#3B82F6',        // Brand blue
  secondary: '#6B7280',      // Brand gray
  success: '#10B981',        // Green
  error: '#EF4444',          // Red
  warning: '#F59E0B',        // Amber
  info: '#3B82F6',           // Blue
  background: '#FFFFFF',     // White
  surface: '#F9FAFB',        // Light gray
  text: '#111827',           // Dark gray
  textSecondary: '#6B7280',  // Medium gray
  border: '#E5E7EB',         // Border gray
  accent: '#8B5CF6',         // Purple
  muted: '#9CA3AF',          // Muted gray
};

/**
 * Dark theme colors
 */
export const darkTheme: ThemeColors = {
  primary: '#60A5FA',        // Lighter blue
  secondary: '#9CA3AF',      // Lighter gray
  success: '#34D399',        // Lighter green
  error: '#F87171',          // Lighter red
  warning: '#FBBF24',        // Lighter amber
  info: '#60A5FA',           // Lighter blue
  background: '#111827',     // Dark background
  surface: '#1F2937',        // Dark surface
  text: '#F9FAFB',           // Light text
  textSecondary: '#D1D5DB',  // Light secondary text
  border: '#374151',         // Dark border
  accent: '#A78BFA',         // Light purple
  muted: '#6B7280',          // Muted dark
};

/**
 * Chart-specific colors optimized for data visualization
 */
export const chartColors: ChartColors = {
  primary: '#3B82F6',        // Brand blue
  secondary: '#6B7280',      // Brand gray
  tertiary: '#10B981',       // Green
  quaternary: '#F59E0B',     // Amber
  quinary: '#8B5CF6',        // Purple
  success: '#10B981',        // Green
  error: '#EF4444',          // Red
  warning: '#F59E0B',        // Amber
  info: '#3B82F6',           // Blue
  gradient: [
    '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE',
    '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6',
    '#10B981', '#34D399', '#6EE7B7', '#A7F3D0',
    '#F59E0B', '#FBBF24', '#FCD34D', '#FEF3C7',
    '#8B5CF6', '#A78BFA', '#C4B5FD', '#EDE9FE'
  ],
  tooltip: {
    background: '#1F2937',   // Dark tooltip background
    border: '#374151',       // Dark tooltip border
    text: '#F9FAFB',         // Light tooltip text
  },
  grid: '#E5E7EB',           // Light grid
  axis: '#6B7280',           // Axis color
};

/**
 * Dark theme chart colors
 */
export const darkChartColors: ChartColors = {
  primary: '#60A5FA',        // Lighter primary
  secondary: '#9CA3AF',      // Lighter secondary
  tertiary: '#34D399',       // Lighter tertiary
  quaternary: '#FBBF24',     // Lighter quaternary
  quinary: '#A78BFA',        // Lighter quinary
  success: '#34D399',        // Lighter success
  error: '#F87171',          // Lighter error
  warning: '#FBBF24',        // Lighter warning
  info: '#60A5FA',           // Lighter info
  gradient: [
    '#60A5FA', '#93C5FD', '#DBEAFE', '#EFF6FF',
    '#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6',
    '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5',
    '#FBBF24', '#FCD34D', '#FEF3C7', '#FFFBEB',
    '#A78BFA', '#C4B5FD', '#EDE9FE', '#F5F3FF'
  ],
  tooltip: {
    background: '#374151',   // Light tooltip background
    border: '#4B5563',       // Light tooltip border
    text: '#F9FAFB',         // Light tooltip text
  },
  grid: '#374151',           // Dark grid
  axis: '#9CA3AF',           // Light axis
};

/**
 * Semantic color mappings for different chart use cases
 */
export const chartSemanticColors = {
  releases: {
    stable: '#3B82F6',       // Blue for stable releases
    preRelease: '#F59E0B',   // Amber for pre-releases
    draft: '#6B7280',        // Gray for drafts
  },
  trends: {
    increasing: '#10B981',   // Green for increasing
    decreasing: '#EF4444',   // Red for decreasing
    stable: '#6B7280',       // Gray for stable
  },
  metrics: {
    total: '#3B82F6',        // Blue for total count
    average: '#8B5CF6',      // Purple for average
    velocity: '#10B981',     // Green for velocity
  },
  comparison: [
    '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', 
    '#EF4444', '#06B6D4', '#84CC16', '#F97316'
  ]
};

/**
 * Get theme-based colors
 * @param isDark - Whether to use dark theme
 * @returns Theme colors object
 */
export function getThemeColors(isDark: boolean = false): ThemeColors {
  return isDark ? darkTheme : lightTheme;
}

/**
 * Get chart-specific colors for the current theme
 * @param isDark - Whether to use dark theme
 * @returns Chart colors object
 */
export function getChartColors(isDark: boolean = false): ChartColors {
  return isDark ? darkChartColors : chartColors;
}

/**
 * Color utility functions
 */
export const colorUtils = {
  /**
   * Convert hex color to RGBA with opacity
   */
  hexToRgba: (hex: string, opacity: number = 1): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  /**
   * Darken a color by a percentage
   */
  darken: (hex: string, percent: number = 10): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    const newR = Math.max(0, r - (r * percent / 100));
    const newG = Math.max(0, g - (g * percent / 100));
    const newB = Math.max(0, b - (b * percent / 100));
    
    return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
  },

  /**
   * Lighten a color by a percentage
   */
  lighten: (hex: string, percent: number = 10): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    const newR = Math.min(255, r + (255 - r) * percent / 100);
    const newG = Math.min(255, g + (255 - g) * percent / 100);
    const newB = Math.min(255, b + (255 - b) * percent / 100);
    
    return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
  },

  /**
   * Get contrast ratio between two colors
   */
  getContrastRatio: (color1: string, color2: string): number => {
    const getLuminance = (hex: string): number => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      
      const [rs, gs, bs] = [r, g, b].map(c => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  },

  /**
   * Check if color combination meets WCAG AA standards
   */
  meetsWCAG_AA: (foreground: string, background: string): boolean => {
    return colorUtils.getContrastRatio(foreground, background) >= 4.5;
  }
};

/**
 * Export default theme (light theme by default)
 */
export default lightTheme;
