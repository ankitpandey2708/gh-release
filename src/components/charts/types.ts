/**
 * TypeScript types for chart components
 * These types define the data structures and interfaces used throughout the chart system
 */

import { Release } from '../../lib/types';
import { ResponsiveContainerProps } from 'recharts';

/**
 * Chart data point interface
 */
export interface ChartDataPoint {
  date: string;        // ISO date string
  dateObj: Date;       // Parsed date object
  releases: number;    // Number of releases in this period
  cumulative: number;  // Cumulative release count
  label: string;       // Formatted label for display
  month: number;       // Month (1-12)
  year: number;        // Year
  [key: string]: any;  // Additional data properties
}

/**
 * Chart configuration interface
 */
export interface ChartConfig {
  width: number | string;
  height: number | string;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  animation: {
    duration: number;
    easing: string;
    delay: number;
  };
  colors: {
    primary: string;
    secondary: string;
    grid: string;
    text: string;
    background: string;
  };
}

/**
 * Chart theme configuration
 */
export interface ChartTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    grid: string;
    axis: string;
    text: string;
    textSecondary: string;
    background: string;
    tooltip: {
      background: string;
      border: string;
      text: string;
    };
  };
  fonts: {
    family: string;
    size: {
      small: number;
      medium: number;
      large: number;
    };
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
  animation: {
    duration: number;
    easing: string;
  };
}

/**
 * Chart export options
 */
export interface ChartExportOptions {
  format: 'png' | 'svg' | 'pdf';
  filename?: string;
  quality?: number;
  backgroundColor?: string;
  width?: number;
  height?: number;
  includeTitle?: boolean;
  includeLegend?: boolean;
}

/**
 * Chart tooltip configuration
 */
export interface ChartTooltipConfig {
  enabled: boolean;
  formatter?: (value: any, name: string, props: any) => [string, string];
  labelFormatter?: (label: string, payload: any[]) => string;
  separator?: string;
  offset?: number;
  position?: { x: number; y: number };
  filterNull?: boolean;
  itemStyle?: any;
  contentStyle?: any;
  labelStyle?: any;
  cursor?: boolean | string | any;
}

/**
 * Chart legend configuration
 */
export interface ChartLegendConfig {
  enabled: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  iconSize?: number;
  iconType?: 'line' | 'rect' | 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
  payload?: any[];
  formatter?: (value: string, entry: any, index: number) => React.ReactNode;
  wrapperStyle?: any;
}

/**
 * Chart accessibility configuration
 */
export interface ChartAccessibilityConfig {
  enabled: boolean;
  description?: string;
  labels?: {
    chartTitle: string;
    xAxisLabel: string;
    yAxisLabel: string;
    dataPoints: string;
  };
  announcements?: {
    onHover: string;
    onFocus: string;
    onDataChange: string;
  };
  keyboardNavigation: {
    enabled: boolean;
    shortcuts: Record<string, string>;
  };
}

/**
 * Chart responsive configuration
 */
export interface ChartResponsiveConfig {
  enabled: boolean;
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  aspectRatio?: number;
  maintainAspectRatio?: boolean;
  resizeDebounce?: number;
}

/**
 * Chart animation configuration
 */
export interface ChartAnimationConfig {
  enabled: boolean;
  duration: number;
  delay: number;
  easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  whenEntering: boolean;
  whenLeaving: boolean;
  whenMounting: boolean;
}

/**
 * Complete chart configuration interface
 */
export interface ChartConfiguration {
  id: string;
  type: 'line' | 'bar' | 'area' | 'pie' | 'scatter';
  data: ChartDataPoint[];
  title?: string;
  subtitle?: string;
  theme: ChartTheme;
  config: ChartConfig;
  tooltip: ChartTooltipConfig;
  legend: ChartLegendConfig;
  accessibility: ChartAccessibilityConfig;
  responsive: ChartResponsiveConfig;
  animation: ChartAnimationConfig;
  export: ChartExportOptions;
  dimensions: {
    width: number;
    height: number;
    minWidth?: number;
    minHeight?: number;
  };
}

/**
 * Chart state management interface
 */
export interface ChartState {
  isLoading: boolean;
  error: string | null;
  data: ChartDataPoint[];
  selectedDataPoint: ChartDataPoint | null;
  hoverDataPoint: ChartDataPoint | null;
  visibleDataKeys: string[];
  filter: {
    startDate: Date | null;
    endDate: Date | null;
    repositories: string[];
  };
  configuration: Partial<ChartConfiguration>;
}

/**
 * Chart event handlers
 */
export interface ChartEventHandlers {
  onDataPointClick?: (dataPoint: ChartDataPoint, event: any) => void;
  onDataPointHover?: (dataPoint: ChartDataPoint, event: any) => void;
  onDataPointLeave?: (dataPoint: ChartDataPoint, event: any) => void;
  onLegendClick?: (dataKey: string, event: any) => void;
  onLegendHover?: (dataKey: string, event: any) => void;
  onResize?: (dimensions: { width: number; height: number }) => void;
  onError?: (error: Error) => void;
  onDataChange?: (data: ChartDataPoint[]) => void;
}

/**
 * Chart component props interface
 */
export interface ChartProps {
  data: Release[];
  configuration?: Partial<ChartConfiguration>;
  eventHandlers?: ChartEventHandlers;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
  isLoading?: boolean;
  error?: string | null;
  theme?: 'light' | 'dark' | 'auto';
  responsive?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  showAxes?: boolean;
  animationEnabled?: boolean;
  accessibilityEnabled?: boolean;
  children?: React.ReactNode;
}

/**
 * Recharts component props extension
 */
export interface RechartsProps {
  data?: any[];
  width?: number | string;
  height?: number | string;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  children?: React.ReactNode;
}

/**
 * Chart error interface
 */
export interface ChartError {
  type: 'data' | 'render' | 'configuration' | 'accessibility' | 'export';
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
  recoverable: boolean;
}

/**
 * Chart performance metrics
 */
export interface ChartPerformanceMetrics {
  renderTime: number;
  dataProcessingTime: number;
  animationTime: number;
  totalTime: number;
  memoryUsage: number;
  frameRate?: number;
  dataPoints: number;
  svgElements: number;
}

/**
 * Chart data transformation result
 */
export interface ChartDataTransformation {
  data: ChartDataPoint[];
  statistics: {
    totalReleases: number;
    dateRange: {
      start: Date;
      end: Date;
    };
    averagePerMonth: number;
    peakMonth: {
      month: string;
      count: number;
    };
  };
  processingTime: number;
  errors: ChartError[];
}
