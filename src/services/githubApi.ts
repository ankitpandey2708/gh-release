/**
 * GitHub API Client for repository and release data fetching
 */

import type { 
  RepositoryMetadata, 
  Release, 
  RateLimitInfo, 
  ApiError,
  ApiResponse 
} from '@/lib/types';

// Configuration
const GITHUB_API_BASE_URL = 'https://api.github.com';
const DEFAULT_TIMEOUT = 10000; // 10 seconds
const DEFAULT_HEADERS = {
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'GitHub-Release-Analyzer/1.0.0',
};

/**
 * API Error class for GitHub API specific errors
 */
export class GitHubApiError extends Error implements ApiError {
  public status?: number;
  public statusText?: string;
  public url?: string;
  public response?: any;
  public rateLimitInfo?: RateLimitInfo;

  constructor(
    message: string, 
    status?: number, 
    statusText?: string, 
    url?: string,
    response?: any
  ) {
    super(message);
    this.name = 'GitHubApiError';
    this.status = status;
    this.statusText = statusText;
    this.url = url;
    this.response = response;
  }
}

/**
 * Rate limit information interface
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}

/**
 * Request configuration interface
 */
export interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

/**
 * GitHub API Client class
 */
export class GitHubApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private authToken?: string;
  private rateLimitInfo?: RateLimitInfo;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;

  constructor(config: {
    baseURL?: string;
    authToken?: string;
    defaultHeaders?: Record<string, string>;
  } = {}) {
    this.baseURL = config.baseURL || GITHUB_API_BASE_URL;
    this.defaultHeaders = { ...DEFAULT_HEADERS, ...config.defaultHeaders };
    this.authToken = config.authToken || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    
    if (this.authToken) {
      this.defaultHeaders.Authorization = `token ${this.authToken}`;
    }
  }

  /**
   * Update authentication token
   */
  setAuthToken(token: string) {
    this.authToken = token;
    if (token) {
      this.defaultHeaders.Authorization = `token ${token}`;
    } else {
      delete this.defaultHeaders.Authorization;
    }
  }

  /**
   * Get current rate limit information
   */
  getRateLimitInfo(): RateLimitInfo | undefined {
    return this.rateLimitInfo;
  }

  /**
   * Check if we're approaching rate limits
   */
  isApproachingRateLimit(threshold: number = 10): boolean {
    if (!this.rateLimitInfo) return false;
    return this.rateLimitInfo.remaining <= threshold;
  }

  /**
   * Get rate limit reset time
   */
  getRateLimitResetTime(): Date | undefined {
    if (!this.rateLimitInfo) return undefined;
    return new Date(this.rateLimitInfo.reset * 1000);
  }

  /**
   * Configure request with timeout
   */
  private createRequestController(timeout: number = DEFAULT_TIMEOUT): AbortController {
    return new AbortController();
  }

  /**
   * Add request to queue for rate limiting
   */
  private queueRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await requestFn();
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
   * Process queued requests with rate limiting
   */
  private async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    while (this.requestQueue.length > 0) {
      // Check rate limits before processing next request
      if (this.isApproachingRateLimit()) {
        const resetTime = this.getRateLimitResetTime();
        if (resetTime) {
          const waitTime = Math.max(0, resetTime.getTime() - Date.now() + 1000);
          console.warn(`Rate limit approaching. Waiting ${waitTime}ms before next request.`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
      
      const request = this.requestQueue.shift();
      if (request) {
        await request();
        // Small delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    this.isProcessingQueue = false;
  }

  /**
   * Generic request method with retry logic
   */
  private async request<T>(
    endpoint: string, 
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      timeout = DEFAULT_TIMEOUT,
      retries = 3,
      retryDelay = 1000,
      headers = {}
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    const finalHeaders = { ...this.defaultHeaders, ...headers };
    const controller = this.createRequestController(timeout);

    const attemptRequest = async (attempt: number = 1): Promise<T> => {
      try {
        console.log(`[GitHub API] Making request to: ${url} (attempt ${attempt})`);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: finalHeaders,
          signal: controller.signal,
        });

        // Update rate limit information
        this.updateRateLimitInfo(response);

        // Handle rate limiting
        if (response.status === 403) {
          const remaining = response.headers.get('X-RateLimit-Remaining');
          const reset = response.headers.get('X-RateLimit-Reset');
          
          if (remaining === '0') {
            const resetTime = reset ? new Date(parseInt(reset) * 1000) : undefined;
            throw new GitHubApiError(
              'GitHub API rate limit exceeded',
              403,
              'Rate Limit Exceeded',
              url,
              { remaining, reset }
            );
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new GitHubApiError(
            `GitHub API error: ${response.status} ${response.statusText}`,
            response.status,
            response.statusText,
            url,
            errorData
          );
        }

        const data = await response.json();
        console.log(`[GitHub API] Success: ${url}`);
        return data as T;

      } catch (error) {
        if (error instanceof GitHubApiError) {
          throw error;
        }

        // Handle timeout
        if (error instanceof Error && error.name === 'AbortError') {
          throw new GitHubApiError(
            'Request timeout',
            408,
            'Request Timeout',
            url
          );
        }

        // Handle network errors
        if (attempt < retries) {
          console.warn(`[GitHub API] Request failed (attempt ${attempt}), retrying...`, error);
          
          // Exponential backoff
          const delay = retryDelay * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          return attemptRequest(attempt + 1);
        }

        throw new GitHubApiError(
          `Request failed after ${retries} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`,
          0,
          'Network Error',
          url,
          error
        );
      }
    };

    // Use queue for rate limiting
    return this.queueRequest(() => attemptRequest());
  }

  /**
   * Update rate limit information from response headers
   */
  private updateRateLimitInfo(response: Response) {
    const limit = response.headers.get('X-RateLimit-Limit');
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    const used = response.headers.get('X-RateLimit-Used');

    if (limit && remaining && reset) {
      this.rateLimitInfo = {
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        reset: parseInt(reset),
        used: used ? parseInt(used) : 0,
      };
    }
  }

  /**
   * Fetch repository metadata
   */
  async fetchRepository(owner: string, repo: string): Promise<RepositoryMetadata> {
    const data = await this.request<any>(`/repos/${owner}/${repo}`);
    
    return {
      name: data.name,
      fullName: data.full_name,
      description: data.description,
      stargazersCount: data.stargazers_count,
      language: data.language,
      url: data.html_url,
      private: data.private,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  /**
   * Fetch releases for a repository with pagination
   */
  async fetchReleases(
    owner: string, 
    repo: string, 
    page: number = 1,
    perPage: number = 30
  ): Promise<{
    releases: Release[];
    hasNextPage: boolean;
    nextPageUrl?: string;
  }> {
    const data = await this.request<any[]>(
      `/repos/${owner}/${repo}/releases?page=${page}&per_page=${perPage}`
    );

    // Process and sort releases by date (newest first)
    const releases: Release[] = data.map(release => ({
      id: release.id,
      tagName: release.tag_name,
      name: release.name,
      body: release.body,
      publishedAt: new Date(release.published_at),
      createdAt: new Date(release.created_at),
      draft: release.draft,
      prerelease: release.prerelease,
      author: {
        login: release.author?.login || 'Unknown',
        avatarUrl: release.author?.avatar_url || '',
        url: release.author?.html_url || '',
      },
      zipballUrl: release.zipball_url,
      tarballUrl: release.tarball_url,
    }));

    releases.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    // Check for next page using Link header (this would be handled by the calling code)
    // For now, assume if we got data, there might be more
    const hasNextPage = data.length === perPage;

    return {
      releases,
      hasNextPage,
      nextPageUrl: hasNextPage ? `page=${page + 1}` : undefined,
    };
  }

  /**
   * Fetch all releases for a repository (with pagination)
   */
  async fetchAllReleases(
    owner: string, 
    repo: string,
    onProgress?: (current: number, total?: number) => void
  ): Promise<Release[]> {
    const allReleases: Release[] = [];
    let page = 1;
    const perPage = 30;
    let hasMore = true;

    while (hasMore) {
      try {
        const { releases, hasNextPage } = await this.fetchReleases(owner, repo, page, perPage);
        
        allReleases.push(...releases);
        hasMore = hasNextPage;
        page++;

        // Report progress
        if (onProgress) {
          onProgress(allReleases.length);
        }

        // Add delay between pages to respect rate limits
        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }

      } catch (error) {
        if (error instanceof GitHubApiError && error.status === 404) {
          throw new GitHubApiError(
            `Repository "${owner}/${repo}" not found or has no releases`,
            404,
            'Not Found'
          );
        }
        throw error;
      }
    }

    return allReleases;
  }

  /**
   * Check if a repository exists
   */
  async checkRepositoryExists(owner: string, repo: string): Promise<boolean> {
    try {
      await this.request(`/repos/${owner}/${repo}`, { timeout: 5000 });
      return true;
    } catch (error) {
      if (error instanceof GitHubApiError && error.status === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Validate client configuration
   */
  validateConfiguration(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.baseURL) {
      errors.push('Base URL is required');
    }

    if (!this.defaultHeaders['Accept']) {
      errors.push('Accept header is required');
    }

    if (!this.defaultHeaders['User-Agent']) {
      errors.push('User-Agent header is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Default client instance
 */
export const githubApiClient = new GitHubApiClient();

/**
 * Factory function to create a new client instance
 */
export function createGitHubClient(config: {
  baseURL?: string;
  authToken?: string;
  defaultHeaders?: Record<string, string>;
} = {}): GitHubApiClient {
  return new GitHubApiClient(config);
}

/**
 * Export utility functions
 */
export {
  GITHUB_API_BASE_URL,
  DEFAULT_TIMEOUT,
  DEFAULT_HEADERS,
};
