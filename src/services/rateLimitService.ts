/**
 * Comprehensive rate limiting service for GitHub API requests
 */

import type { RateLimitInfo } from '@/lib/types';

interface RateLimitConfig {
  warningThreshold: number; // Show warning when remaining requests are below this
  criticalThreshold: number; // Critical state when below this
  maxRetries: number; // Maximum retry attempts
  baseDelay: number; // Base delay for exponential backoff (ms)
  maxDelay: number; // Maximum delay between retries (ms)
  enableNotifications: boolean; // Show user notifications
  enableLogging: boolean; // Log rate limit events
  queueSize: number; // Maximum queue size
  processingInterval: number; // Time between queue processing (ms)
}

interface RateLimitState {
  info: RateLimitInfo | null;
  isWarning: boolean;
  isCritical: boolean;
  lastWarningTime: number;
  retryCount: number;
  queueSize: number;
  isProcessing: boolean;
}

interface RateLimitEvent {
  type: 'warning' | 'critical' | 'reset' | 'queue_full' | 'retry' | 'success';
  timestamp: number;
  remaining: number;
  resetTime: Date;
  message: string;
  details?: any;
}

class RateLimitService {
  private config: RateLimitConfig;
  private state: RateLimitState;
  private eventQueue: RateLimitEvent[] = [];
  private eventListeners: Array<(event: RateLimitEvent) => void> = [];
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;
  private lastResetCheck = 0;

  // Default configuration
  private defaultConfig: RateLimitConfig = {
    warningThreshold: 10,
    criticalThreshold: 3,
    maxRetries: 5,
    baseDelay: 1000,
    maxDelay: 30000,
    enableNotifications: true,
    enableLogging: true,
    queueSize: 50,
    processingInterval: 100,
  };

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { ...this.defaultConfig, ...config };
    this.state = {
      info: null,
      isWarning: false,
      isCritical: false,
      lastWarningTime: 0,
      retryCount: 0,
      queueSize: 0,
      isProcessing: false,
    };

    // Clean up event queue periodically
    setInterval(() => {
      this.cleanupEventQueue();
    }, 60000); // Every minute
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<RateLimitConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.log('config_updated', `Configuration updated: ${JSON.stringify(newConfig)}`);
  }

  /**
   * Update rate limit information from API response
   */
  updateRateLimitInfo(headers: Headers): void {
    const limit = headers.get('X-RateLimit-Limit');
    const remaining = headers.get('X-RateLimit-Remaining');
    const reset = headers.get('X-RateLimit-Reset');
    const used = headers.get('X-RateLimit-Used');

    if (limit && remaining && reset) {
      const newInfo: RateLimitInfo = {
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        reset: parseInt(reset),
        used: used ? parseInt(used) : 0,
      };

      const previousInfo = this.state.info;
      this.state.info = newInfo;

      // Check for state changes
      this.checkStateChanges(previousInfo, newInfo);
      
      this.log('rate_limit_updated', 'Rate limit info updated', { newInfo, previousInfo });
    }
  }

  /**
   * Check for state changes and trigger events
   */
  private checkStateChanges(previous: RateLimitInfo | null, current: RateLimitInfo): void {
    if (!previous) {
      // Initial state
      this.handleInitialState(current);
      return;
    }

    // Check for reset
    if (current.reset > previous.reset) {
      this.handleRateLimitReset();
    }

    // Check for warning state
    if (current.remaining <= this.config.criticalThreshold && previous.remaining > this.config.criticalThreshold) {
      this.handleCriticalState(current);
    } else if (current.remaining <= this.config.warningThreshold && previous.remaining > this.config.warningThreshold) {
      this.handleWarningState(current);
    }
  }

  /**
   * Handle initial state
   */
  private handleInitialState(info: RateLimitInfo): void {
    if (info.remaining <= this.config.criticalThreshold) {
      this.handleCriticalState(info);
    } else if (info.remaining <= this.config.warningThreshold) {
      this.handleWarningState(info);
    }
  }

  /**
   * Handle rate limit reset
   */
  private handleRateLimitReset(): void {
    this.state.isWarning = false;
    this.state.isCritical = false;
    this.state.retryCount = 0;
    
    this.emitEvent({
      type: 'reset',
      timestamp: Date.now(),
      remaining: this.state.info?.remaining || 0,
      resetTime: new Date(),
      message: 'Rate limit has been reset',
    });

    this.log('rate_limit_reset', 'Rate limit has been reset');
  }

  /**
   * Handle warning state
   */
  private handleWarningState(info: RateLimitInfo): void {
    const now = Date.now();
    
    // Throttle warnings to avoid spam
    if (now - this.state.lastWarningTime < 30000) { // 30 seconds
      return;
    }

    this.state.isWarning = true;
    this.state.lastWarningTime = now;

    this.emitEvent({
      type: 'warning',
      timestamp: now,
      remaining: info.remaining,
      resetTime: new Date(info.reset * 1000),
      message: `Rate limit warning: ${info.remaining} requests remaining`,
      details: {
        percentage: Math.round((info.remaining / info.limit) * 100),
        resetIn: this.getTimeUntilReset(),
      },
    });

    this.log('rate_limit_warning', `Rate limit warning: ${info.remaining} remaining`);
  }

  /**
   * Handle critical state
   */
  private handleCriticalState(info: RateLimitInfo): void {
    this.state.isCritical = true;
    this.state.isWarning = true;

    this.emitEvent({
      type: 'critical',
      timestamp: Date.now(),
      remaining: info.remaining,
      resetTime: new Date(info.reset * 1000),
      message: `Rate limit critical: Only ${info.remaining} requests remaining`,
      details: {
        percentage: Math.round((info.remaining / info.limit) * 100),
        resetIn: this.getTimeUntilReset(),
        recommendations: this.getRecommendations(),
      },
    });

    this.log('rate_limit_critical', `Rate limit critical: ${info.remaining} remaining`);
  }

  /**
   * Get time until rate limit reset
   */
  getTimeUntilReset(): number {
    if (!this.state.info) return 0;
    return Math.max(0, this.state.info.reset * 1000 - Date.now());
  }

  /**
   * Get human-readable time until reset
   */
  getTimeUntilResetText(): string {
    const ms = this.getTimeUntilReset();
    
    if (ms <= 0) return 'Rate limit reset';
    if (ms < 60000) return `${Math.ceil(ms / 1000)}s`;
    if (ms < 3600000) return `${Math.ceil(ms / 60000)}m`;
    return `${Math.ceil(ms / 3600000)}h`;
  }

  /**
   * Get recommendations based on current state
   */
  getRecommendations(): string[] {
    if (!this.state.info) return [];

    const recommendations: string[] = [];
    
    if (this.state.isCritical) {
      recommendations.push('Wait for rate limit reset');
      recommendations.push('Consider using authenticated requests');
    }
    
    if (this.state.info.remaining < this.config.warningThreshold) {
      recommendations.push('Slow down requests');
      recommendations.push('Use caching to reduce API calls');
    }

    return recommendations;
  }

  /**
   * Add request to queue
   */
  async queueRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    if (this.requestQueue.length >= this.config.queueSize) {
      this.emitEvent({
        type: 'queue_full',
        timestamp: Date.now(),
        remaining: this.state.info?.remaining || 0,
        resetTime: new Date((this.state.info?.reset || 0) * 1000),
        message: `Request queue is full (max: ${this.config.queueSize})`,
        details: { queueSize: this.requestQueue.length },
      });
      
      this.log('queue_full', `Queue is full: ${this.requestQueue.length}/${this.config.queueSize}`);
      throw new Error(`Request queue is full. Please wait and try again.`);
    }

    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          // Check if we should wait due to rate limits
          if (this.shouldWait()) {
            await this.waitForRateLimitReset();
          }
          
          const result = await requestFn();
          
          this.emitEvent({
            type: 'success',
            timestamp: Date.now(),
            remaining: this.state.info?.remaining || 0,
            resetTime: new Date((this.state.info?.reset || 0) * 1000),
            message: 'Request completed successfully',
            details: { queuePosition: this.requestQueue.indexOf(requestFn) },
          });
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }

  /**
   * Check if we should wait before making requests
   */
  private shouldWait(): boolean {
    if (!this.state.info) return false;
    
    // Wait if in critical state
    if (this.state.isCritical) return true;
    
    // Wait if only a few requests remain and we have many in queue
    if (this.state.info.remaining <= this.requestQueue.length + 2) return true;
    
    return false;
  }

  /**
   * Wait for rate limit reset
   */
  private async waitForRateLimitReset(): Promise<void> {
    const timeUntilReset = this.getTimeUntilReset();
    
    if (timeUntilReset > 0) {
      this.log('waiting_for_reset', `Waiting ${timeUntilReset}ms for rate limit reset`);
      await new Promise(resolve => setTimeout(resolve, timeUntilReset + 1000));
    }
  }

  /**
   * Process the request queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    this.state.isProcessing = true;
    
    try {
      while (this.requestQueue.length > 0) {
        // Check if we should pause processing
        if (this.shouldWait()) {
          await this.waitForRateLimitReset();
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, this.config.processingInterval));
        
        const request = this.requestQueue.shift();
        if (request) {
          this.state.queueSize = this.requestQueue.length;
          await request();
        }
      }
    } finally {
      this.isProcessingQueue = false;
      this.state.isProcessing = false;
      this.state.queueSize = 0;
    }
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateBackoffDelay(attempt: number): number {
    const delay = this.config.baseDelay * Math.pow(2, attempt - 1);
    return Math.min(delay, this.config.maxDelay);
  }

  /**
   * Handle rate limited request with exponential backoff
   */
  async executeWithRetry<T>(
    requestFn: () => Promise<T>,
    context: string = 'request'
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        this.state.retryCount = attempt;
        
        const result = await this.queueRequest(requestFn);
        
        if (attempt > 1) {
          this.log('retry_success', `Retry succeeded for ${context} on attempt ${attempt}`);
        }
        
        return result;
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (this.isRateLimitError(error)) {
          const delay = this.calculateBackoffDelay(attempt);
          
          this.emitEvent({
            type: 'retry',
            timestamp: Date.now(),
            remaining: this.state.info?.remaining || 0,
            resetTime: new Date((this.state.info?.reset || 0) * 1000),
            message: `Rate limited. Retrying in ${delay}ms (attempt ${attempt}/${this.config.maxRetries})`,
            details: { attempt, delay, context },
          });
          
          this.log('retry_attempt', `Rate limited ${context}, retrying in ${delay}ms (attempt ${attempt}/${this.config.maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          
        } else {
          // Non-rate-limit error, don't retry
          this.log('request_failed', `Request failed for ${context}: ${lastError.message}`);
          throw error;
        }
      }
    }
    
    // Max retries exceeded
    this.log('max_retries_exceeded', `Max retries exceeded for ${context}`);
    throw new Error(`Rate limit exceeded. Please wait ${this.getTimeUntilResetText()} and try again.`);
  }

  /**
   * Check if error is rate limit related
   */
  private isRateLimitError(error: any): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return message.includes('rate limit') || 
             message.includes('403') || 
             message.includes('too many requests');
    }
    return false;
  }

  /**
   * Add event listener
   */
  addEventListener(listener: (event: RateLimitEvent) => void): void {
    this.eventListeners.push(listener);
  }

  /**
   * Remove event listener
   */
  removeEventListener(listener: (event: RateLimitEvent) => void): void {
    this.eventListeners = this.eventListeners.filter(l => l !== listener);
  }

  /**
   * Emit rate limit event
   */
  private emitEvent(event: RateLimitEvent): void {
    this.eventQueue.push(event);
    
    if (this.eventQueue.length > 100) {
      this.eventQueue.shift();
    }
    
    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in rate limit event listener:', error);
      }
    });
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit: number = 10): RateLimitEvent[] {
    return this.eventQueue.slice(-limit);
  }

  /**
   * Log rate limit events
   */
  private log(type: string, message: string, details?: any): void {
    if (!this.config.enableLogging) return;
    
    const logData = {
      type,
      message,
      timestamp: new Date().toISOString(),
      rateLimitInfo: this.state.info,
      details,
    };
    
    console.log(`[RateLimit] ${type}: ${message}`, logData);
  }

  /**
   * Clean up old events
   */
  private cleanupEventQueue(): void {
    const oneHourAgo = Date.now() - 3600000;
    this.eventQueue = this.eventQueue.filter(event => event.timestamp > oneHourAgo);
  }

  /**
   * Get current state
   */
  getState(): RateLimitState {
    return { ...this.state };
  }

  /**
   * Get rate limit status for display
   */
  getStatus() {
    if (!this.state.info) {
      return {
        hasData: false,
        message: 'No rate limit information available',
        severity: 'none',
      };
    }

    const { info } = this.state;
    const percentage = Math.round((info.remaining / info.limit) * 100);
    const timeUntilReset = this.getTimeUntilResetText();

    let severity: 'normal' | 'warning' | 'critical' = 'normal';
    let message = `${info.remaining} requests remaining`;

    if (this.state.isCritical) {
      severity = 'critical';
      message = `Critical: Only ${info.remaining} requests left`;
    } else if (this.state.isWarning) {
      severity = 'warning';
      message = `Warning: ${info.remaining} requests remaining`;
    }

    return {
      hasData: true,
      severity,
      message,
      percentage,
      timeUntilReset,
      remaining: info.remaining,
      limit: info.limit,
      used: info.used,
      resetTime: new Date(info.reset * 1000),
    };
  }

  /**
   * Clear the request queue
   */
  clearQueue(): void {
    this.requestQueue.length = 0;
    this.state.queueSize = 0;
    this.log('queue_cleared', 'Request queue cleared');
  }

  /**
   * Get configuration
   */
  getConfig(): RateLimitConfig {
    return { ...this.config };
  }
}

// Default instance
export const rateLimitService = new RateLimitService();

// Factory function for custom instances
export function createRateLimitService(config: Partial<RateLimitConfig> = {}): RateLimitService {
  return new RateLimitService(config);
}

export type { RateLimitEvent, RateLimitState, RateLimitConfig };
