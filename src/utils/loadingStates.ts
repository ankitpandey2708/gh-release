/**
 * Loading state text messages and utilities
 * Provides consistent loading text messages for different stages of the application
 */

export interface LoadingTextConfig {
  message: string;
  description?: string;
  duration?: number; // Optional duration for animated messages
}

export type LoadingStage = 
  | 'initializing'
  | 'fetching_repository'
  | 'fetching_releases'
  | 'analyzing_releases'
  | 'calculating_metrics'
  | 'generating_chart'
  | 'processing_data'
  | 'saving_results'
  | 'error'
  | 'success';

/**
 * Loading text configurations for different stages
 */
export const LOADING_MESSAGES: Record<LoadingStage, LoadingTextConfig> = {
  initializing: {
    message: 'Initializing...',
    description: 'Setting up the application'
  },
  
  fetching_repository: {
    message: 'Fetching repository data...',
    description: 'Retrieving repository information from GitHub'
  },
  
  fetching_releases: {
    message: 'Analyzing releases...',
    description: 'Loading release history and metadata'
  },
  
  analyzing_releases: {
    message: 'Analyzing release patterns...',
    description: 'Processing release data and calculating metrics'
  },
  
  calculating_metrics: {
    message: 'Calculating metrics...',
    description: 'Computing release statistics and trends'
  },
  
  generating_chart: {
    message: 'Generating visualization...',
    description: 'Creating release timeline chart'
  },
  
  processing_data: {
    message: 'Processing data...',
    description: 'Transforming raw data into insights'
  },
  
  saving_results: {
    message: 'Saving results...',
    description: 'Storing analysis results'
  },
  
  error: {
    message: 'Something went wrong...',
    description: 'An error occurred during processing'
  },
  
  success: {
    message: 'Analysis complete!',
    description: 'All data has been processed successfully'
  }
};

/**
 * Get loading text for a specific stage
 */
export function getLoadingText(stage: LoadingStage): LoadingTextConfig {
  return LOADING_MESSAGES[stage] || LOADING_MESSAGES.initializing;
}

/**
 * Get loading message only (shorter version)
 */
export function getLoadingMessage(stage: LoadingStage): string {
  return getLoadingText(stage).message;
}

/**
 * Get loading description (longer explanatory text)
 */
export function getLoadingDescription(stage: LoadingStage): string | undefined {
  return getLoadingText(stage).description;
}

/**
 * Animate through multiple loading stages with progress indication
 */
export class LoadingSequence {
  private stages: LoadingStage[];
  private currentIndex: number = 0;
  private onUpdate?: (stage: LoadingStage, progress: number) => void;
  private intervalId?: NodeJS.Timeout;
  
  constructor(stages: LoadingStage[], onUpdate?: (stage: LoadingStage, progress: number) => void) {
    this.stages = stages;
    this.onUpdate = onUpdate;
  }
  
  start(): void {
    this.currentIndex = 0;
    this.next();
  }
  
  next(): void {
    if (this.currentIndex >= this.stages.length) {
      this.stop();
      return;
    }
    
    const stage = this.stages[this.currentIndex];
    const progress = (this.currentIndex / this.stages.length) * 100;
    
    this.onUpdate?.(stage, progress);
    
    if (this.currentIndex < this.stages.length - 1) {
      this.intervalId = setTimeout(() => {
        this.currentIndex++;
        this.next();
      }, 2000); // 2 seconds per stage
    }
  }
  
  stop(): void {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = undefined;
    }
  }
  
  reset(): void {
    this.stop();
    this.currentIndex = 0;
  }
}

/**
 * Typewriter effect for loading messages
 */
export class TypewriterEffect {
  private text: string;
  private element?: HTMLElement;
  private index: number = 0;
  private speed: number;
  private onComplete?: () => void;
  
  constructor(text: string, speed: number = 50, onComplete?: () => void) {
    this.text = text;
    this.speed = speed;
    this.onComplete = onComplete;
  }
  
  start(element: HTMLElement): void {
    this.element = element;
    this.index = 0;
    this.type();
  }
  
  private type(): void {
    if (!this.element) return;
    
    if (this.index < this.text.length) {
      this.element.textContent = this.text.substring(0, this.index + 1);
      this.index++;
      setTimeout(() => this.type(), this.speed);
    } else {
      this.onComplete?.();
    }
  }
  
  stop(): void {
    if (this.element) {
      this.element.textContent = this.text;
    }
  }
}

/**
 * Loading progress estimation based on common patterns
 */
export function estimateProgress(stage: LoadingStage): number {
  const progressMap: Record<LoadingStage, number> = {
    initializing: 0,
    fetching_repository: 10,
    fetching_releases: 30,
    analyzing_releases: 50,
    calculating_metrics: 70,
    generating_chart: 85,
    processing_data: 90,
    saving_results: 95,
    error: 100,
    success: 100
  };
  
  return progressMap[stage] ?? 0;
}

/**
 * Format duration for display
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Get estimated time remaining based on progress
 */
export function getEstimatedTimeRemaining(
  startTime: number, 
  currentStage: LoadingStage
): string {
  const elapsed = Date.now() - startTime;
  const progress = estimateProgress(currentStage);
  
  if (progress <= 0) return 'calculating...';
  
  const estimatedTotal = elapsed / (progress / 100);
  const remaining = estimatedTotal - elapsed;
  
  if (remaining < 0 || !isFinite(remaining)) {
    return 'estimating...';
  }
  
  return formatDuration(remaining);
}

/**
 * Loading state for different contexts
 */
export const CONTEXT_LOADING_MESSAGES = {
  form: {
    validating: 'Validating repository format...',
    submitting: 'Submitting analysis request...',
    processing: 'Processing your request...'
  },
  
  chart: {
    loading: 'Loading chart data...',
    rendering: 'Rendering visualization...',
    updating: 'Updating chart...'
  },
  
  api: {
    connecting: 'Connecting to GitHub...',
    fetching: 'Fetching data...',
    retrying: 'Retrying request...'
  },
  
  cache: {
    checking: 'Checking cached data...',
    updating: 'Updating cache...',
    clearing: 'Clearing cache...'
  }
};

/**
 * Error messages for different failure scenarios
 */
export const ERROR_MESSAGES = {
  network: 'Network connection failed. Please check your internet connection.',
  timeout: 'Request timed out. The server may be busy.',
  notFound: 'Repository not found. Please check the repository name.',
  rateLimit: 'GitHub API rate limit exceeded. Please try again later.',
  unauthorized: 'Access denied. Repository may be private.',
  serverError: 'Server error occurred. Please try again.',
  validation: 'Invalid repository format. Please check the input.',
  unknown: 'An unexpected error occurred. Please try again.'
};

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  analysis: 'Repository analysis completed successfully!',
  dataLoaded: 'All data loaded successfully!',
  cached: 'Data retrieved from cache.',
  exported: 'Export completed successfully!'
};
