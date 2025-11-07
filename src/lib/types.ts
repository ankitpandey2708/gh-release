/**
 * Type definitions for the GitHub Release Analysis application
 */

// Repository metadata types
export interface RepositoryMetadata {
  name: string;
  fullName: string;
  description: string | null;
  stargazersCount: number;
  language: string | null;
  url: string;
  private: boolean;
  createdAt: string;
  updatedAt: string;
}

// Release data types
export interface Release {
  id: number;
  tagName: string;
  name: string | null;
  body: string | null;
  publishedAt: Date;
  createdAt: Date;
  draft: boolean;
  prerelease: boolean;
  author: {
    login: string;
    avatarUrl: string;
    url: string;
  };
  zipballUrl: string;
  tarballUrl: string;
}

// API error types
export interface ApiError extends Error {
  status?: number;
  statusText?: string;
  url?: string;
  response?: any;
  rateLimitInfo?: RateLimitInfo;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  rateLimitInfo?: RateLimitInfo;
}

// Rate limit information
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}

// Chart data types
export interface ChartDataPoint {
  date: string;
  dateObj: Date;
  releases: number;
  cumulative: number;
  label: string;
}

// Metrics calculation types
export interface ReleaseMetrics {
  totalReleases: number;
  daysSinceLastRelease: number | null;
  averageTimeBetweenReleases: number | null;
  releaseVelocity: ReleaseVelocity;
  mostActivePeriod: MostActivePeriod;
  preReleaseRatio: number;
  firstRelease: Date | null;
  lastRelease: Date | null;
}

export interface ReleaseVelocity {
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
  ratePerMonth: number;
  description: string;
}

export interface MostActivePeriod {
  period: string;
  releaseCount: number;
  timeWindow: {
    start: Date;
    end: Date;
  };
}

// Filter and comparison types
export interface DateRangeFilter {
  startDate: Date | null;
  endDate: Date | null;
  preset: DateRangePreset | null;
}

export type DateRangePreset = '30days' | '90days' | '1year' | 'alltime';

export interface FilterState {
  dateRange: DateRangeFilter;
  chartType: ChartType;
  excludePreReleases: boolean;
  excludeDrafts: boolean;
}

export type ChartType = 'line' | 'bar';

// User preference types
export interface UserPreferences {
  chartType: ChartType;
  dateRangePreset: DateRangePreset;
  excludePreReleases: boolean;
  excludeDrafts: boolean;
  autoRefresh: boolean;
  showTooltips: boolean;
  compactMode: boolean;
}

// Export and sharing types
export interface ExportOptions {
  format: 'png' | 'csv' | 'json';
  includeMetadata: boolean;
  includeFilterState: boolean;
  fileName?: string;
  quality?: number;
}

export interface ShareableState {
  repository: string;
  filterState: FilterState;
  timestamp: number;
}

// Bookmark types
export interface Bookmark {
  id: string;
  repository: string;
  displayName: string;
  createdAt: Date;
  lastAnalyzed: Date | null;
  favorite: boolean;
  tags: string[];
  notes?: string;
}

// Error handling types
export interface ErrorContext {
  operation: string;
  repository?: string;
  userId?: string;
  timestamp: number;
  userAgent?: string;
}

export interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  context: ErrorContext;
  resolved: boolean;
}

// UI state types
export interface LoadingState {
  isLoading: boolean;
  operation: string | null;
  progress?: number;
  total?: number;
  message?: string;
}

export interface ValidationState {
  isValid: boolean;
  state: 'valid' | 'invalid' | 'pending' | 'empty';
  message?: string;
}

export interface FormState {
  repositoryInput: string;
  isValid: boolean;
  validation: ValidationState;
  isLoading: boolean;
  error?: string;
}

// Application state types
export interface AppState {
  repositories: Record<string, RepositoryMetadata>;
  releases: Record<string, Release[]>;
  metrics: Record<string, ReleaseMetrics>;
  filterState: FilterState;
  bookmarks: Bookmark[];
  userPreferences: UserPreferences;
  error?: string;
  loading: LoadingState;
}

// Component prop types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Navigation and routing types
export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  active?: boolean;
}

// Accessibility types
export interface AccessibilityAttributes {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  'aria-live'?: 'polite' | 'assertive';
  role?: string;
  tabIndex?: number;
}

// Performance and analytics types
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  apiResponseTime: number;
  cacheHitRate: number;
  userInteractions: number;
}

export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, any>;
}

// Configuration types
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
    rateLimitThreshold: number;
  };
  cache: {
    ttl: number;
    maxSize: number;
    enabled: boolean;
  };
  ui: {
    theme: 'light' | 'dark' | 'auto';
    chartAnimations: boolean;
    compactMode: boolean;
  };
  features: {
    bookmarks: boolean;
    comparisons: boolean;
    exports: boolean;
    sharing: boolean;
  };
}

// Theme and styling types
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
}

export interface DesignTokens {
  colors: ThemeColors;
  spacing: Record<string, string>;
  fontSizes: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
}

// Testing types
export interface TestCase {
  id: string;
  name: string;
  input: any;
  expected: any;
  category: string;
  description?: string;
}

export interface MockData {
  repositories: RepositoryMetadata[];
  releases: Release[];
  bookmarks: Bookmark[];
  errorScenarios: Array<{
    status: number;
    message: string;
    scenario: string;
  }>;
}
