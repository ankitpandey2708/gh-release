"use client";

import type { RepositoryMetadata, Release } from "@/lib/types";

// GitHub API Configuration
const GITHUB_API_BASE_URL = "https://api.github.com";
const GITHUB_API_VERSION = "application/vnd.github.v3+json";
const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

// Rate Limiting Configuration
const RATE_LIMIT_WARNING_THRESHOLD = 0.8; // 80% of rate limit
const RATE_LIMIT_CRITICAL_THRESHOLD = 0.95; // 95% of rate limit

// API Response Types
export interface GitHubApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface GitHubRateLimit {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
  resource: string;
}

export interface GitHubRateLimitResponse {
  resources: {
    core: GitHubRateLimit;
    search: GitHubRateLimit;
    graphql: GitHubRateLimit;
    integration_manifest: GitHubRateLimit;
  };
  rate: GitHubRateLimit;
}

// Error Types
export class GitHubApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public url: string,
    public response?: any
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

export class RateLimitError extends GitHubApiError {
  constructor(
    message: string,
    status: number,
    statusText: string,
    url: string,
    public rateLimitInfo?: GitHubRateLimit | null
  ) {
    super(message, status, statusText, url);
    this.name = "RateLimitError";
  }
}

export class AuthenticationError extends GitHubApiError {
  constructor(message: string, url: string) {
    super(message, 401, "Unauthorized", url);
    this.name = "AuthenticationError";
  }
}

export class NotFoundError extends GitHubApiError {
  constructor(message: string, url: string) {
    super(message, 404, "Not Found", url);
    this.name = "NotFoundError";
  }
}

// Configuration and Authentication
interface GitHubApiConfig {
  token?: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
  enableLogging?: boolean;
}

class GitHubApiClient {
  private config: Required<GitHubApiConfig>;
  private rateLimitInfo: GitHubRateLimit | null = null;

  constructor(config: GitHubApiConfig = {}) {
    this.config = {
      token: (process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.GITHUB_TOKEN) ?? "",
      baseUrl: config.baseUrl || GITHUB_API_BASE_URL,
      timeout: config.timeout || REQUEST_TIMEOUT,
      maxRetries: config.maxRetries || MAX_RETRIES,
      enableLogging: config.enableLogging || process.env.NODE_ENV === "development"
    };
    
    this.validateConfiguration();
  }

  private validateConfiguration(): void {
    if (!this.config.token) {
      console.warn("GitHub API token not provided. API calls will be rate-limited to 60 requests/hour.");
    }
  }

  private getDefaultHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Accept": GITHUB_API_VERSION,
      "User-Agent": "GitHub-Release-Tracker/1.0.0",
      "Content-Type": "application/json"
    };

    if (this.config.token) {
      headers["Authorization"] = `token ${this.config.token}`;
    }

    return headers;
  }

  private logRequest(url: string, options: RequestInit): void {
    if (!this.config.enableLogging) return;
    
    console.log(`[GitHub API] ${options.method || "GET"} ${url}`);
    if (this.config.token) {
      console.log("[GitHub API] Using authentication token");
    }
  }

  private logResponse(response: Response, url: string): void {
    if (!this.config.enableLogging) return;
    
    const statusColor = response.status >= 400 ? "\x1b[31m" : "\x1b[32m";
    console.log(`[GitHub API] ${statusColor}${response.status} ${response.statusText}\x1b[0m ${url}`);
    
    // Log rate limit info if available
    const rateLimit = response.headers.get("X-RateLimit-Remaining");
    const rateLimitReset = response.headers.get("X-RateLimit-Reset");
    if (rateLimit) {
      console.log(`[GitHub API] Rate limit remaining: ${rateLimit}${rateLimitReset ? ` (resets at ${new Date(Number(rateLimitReset) * 1000).toISOString()})` : ""}`);
    }
  }

  private updateRateLimitInfo(headers: Headers): void {
    const remaining = headers.get("X-RateLimit-Remaining");
    const limit = headers.get("X-RateLimit-Limit");
    const reset = headers.get("X-RateLimit-Reset");
    const used = headers.get("X-RateLimit-Used");

    if (remaining && limit && reset) {
      this.rateLimitInfo = {
        limit: Number(limit),
        remaining: Number(remaining),
        reset: Number(reset),
        used: used ? Number(used) : 0,
        resource: "core"
      };
    }
  }

  private getRateLimitStatus(): { warning: boolean; critical: boolean; message: string } {
    if (!this.rateLimitInfo) {
      return { warning: false, critical: false, message: "Rate limit info not available" };
    }

    const { limit, remaining } = this.rateLimitInfo;
    const usageRatio = (limit - remaining) / limit;

    if (usageRatio >= RATE_LIMIT_CRITICAL_THRESHOLD) {
      return {
        warning: true,
        critical: true,
        message: `Critical rate limit warning: ${remaining}/${limit} requests remaining`
      };
    } else if (usageRatio >= RATE_LIMIT_WARNING_THRESHOLD) {
      return {
        warning: true,
        critical: false,
        message: `Rate limit warning: ${remaining}/${limit} requests remaining`
      };
    }

    return {
      warning: false,
      critical: false,
      message: `Rate limit: ${remaining}/${limit} requests remaining`
    };
  }

  private async executeWithRetry(
    url: string, 
    options: RequestInit, 
    retryCount: number = 0
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      this.logRequest(url, options);
      
      const finalOptions: RequestInit = {
        ...options,
        headers: {
          ...this.getDefaultHeaders(),
          ...options.headers
        },
        signal: controller.signal
      };

      const response = await fetch(url, finalOptions);
      clearTimeout(timeoutId);
      
      this.logResponse(response, url);
      this.updateRateLimitInfo(response.headers);

      // Handle rate limiting
      if (response.status === 403) {
        const remaining = response.headers.get("X-RateLimit-Remaining");
        if (remaining === "0") {
          const rateLimitInfo = this.rateLimitInfo;
          throw new RateLimitError(
            "Rate limit exceeded",
            response.status,
            response.statusText,
            url,
            rateLimitInfo
          );
        }
      }

      // Handle authentication errors
      if (response.status === 401) {
        throw new AuthenticationError("Invalid GitHub token", url);
      }

      // Handle not found errors
      if (response.status === 404) {
        throw new NotFoundError("Resource not found", url);
      }

      // Handle other error responses
      if (!response.ok) {
        const errorText = await response.text();
        throw new GitHubApiError(
          `GitHub API error: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText,
          url,
          errorText
        );
      }

      return response;

    } catch (error) {
      clearTimeout(timeoutId);

      // Handle abort timeout
      if (error instanceof Error && error.name === "AbortError") {
        throw new GitHubApiError(
          "Request timeout",
          408,
          "Request Timeout",
          url
        );
      }

      // Retry logic for temporary failures
      if (retryCount < this.config.maxRetries && 
          error instanceof GitHubApiError && 
          [408, 429, 500, 502, 503, 504].includes(error.status)) {
        
        const delay = RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
        console.log(`[GitHub API] Retry ${retryCount + 1}/${this.config.maxRetries} after ${delay}ms delay`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.executeWithRetry(url, options, retryCount + 1);
      }

      throw error;
    }
  }

  private async parseResponse<T>(response: Response): Promise<GitHubApiResponse<T>> {
    let data: T;
    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      data = await response.json() as T;
    } else {
      const text = await response.text();
      data = text as unknown as T;
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    };
  }

  // Repository Metadata Fetching
  async fetchRepository(owner: string, repo: string): Promise<GitHubApiResponse<RepositoryMetadata>> {
    const url = `${this.config.baseUrl}/repos/${owner}/${repo}`;
    
    try {
      const response = await this.executeWithRetry(url, { method: "GET" });
      return await this.parseResponse<RepositoryMetadata>(response);
    } catch (error) {
      console.error(`[GitHub API] Failed to fetch repository: ${owner}/${repo}`, error);
      throw error;
    }
  }

  // Release Data Fetching with Pagination
  async fetchReleases(owner: string, repo: string, page: number = 1, perPage: number = 30): Promise<GitHubApiResponse<Release[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      sort: "created",
      direction: "desc"
    });
    
    const url = `${this.config.baseUrl}/repos/${owner}/${repo}/releases?${params}`;
    
    try {
      const response = await this.executeWithRetry(url, { method: "GET" });
      return await this.parseResponse<Release[]>(response);
    } catch (error) {
      console.error(`[GitHub API] Failed to fetch releases: ${owner}/${repo} (page ${page})`, error);
      throw error;
    }
  }

  // Fetch all releases with pagination
  async fetchAllReleases(owner: string, repo: string): Promise<Release[]> {
    const allReleases: Release[] = [];
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      try {
        const response = await this.fetchReleases(owner, repo, page);
        const releases = response.data;

        if (releases.length === 0) {
          hasMorePages = false;
        } else {
          allReleases.push(...releases);
          page++;
          
          // Check rate limits
          const rateLimitStatus = this.getRateLimitStatus();
          if (rateLimitStatus.critical) {
            console.warn(`[GitHub API] ${rateLimitStatus.message}. Stopping pagination.`);
            hasMorePages = false;
          }
        }
      } catch (error) {
        if (error instanceof RateLimitError) {
          console.warn("[GitHub API] Rate limit exceeded during pagination");
          hasMorePages = false;
        } else {
          console.error(`[GitHub API] Error during pagination at page ${page}:`, error);
          hasMorePages = false;
        }
      }
    }

    return allReleases;
  }

  // Get current rate limit information
  getRateLimitInfo(): GitHubRateLimit | null {
    return this.rateLimitInfo;
  }

  // Get rate limit status
  getRateLimitStatusMessage(): { warning: boolean; critical: boolean; message: string } {
    return this.getRateLimitStatus();
  }

  // Get time until rate limit reset
  getRateLimitResetTime(): Date | null {
    if (!this.rateLimitInfo) return null;
    return new Date(this.rateLimitInfo.reset * 1000);
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!this.config.token;
  }

  // Get client configuration (for debugging)
  getConfig(): Required<GitHubApiConfig> {
    return { ...this.config };
  }
}

// Export singleton instance
export const githubApi = new GitHubApiClient();

// Export helper functions for specific use cases
export const createGitHubApiClient = (config: GitHubApiConfig): GitHubApiClient => {
  return new GitHubApiClient(config);
};

export const fetchRepositoryMetadata = (owner: string, repo: string): Promise<GitHubApiResponse<RepositoryMetadata>> => {
  return githubApi.fetchRepository(owner, repo);
};

export const fetchRepositoryReleases = (owner: string, repo: string, page: number = 1, perPage: number = 30): Promise<GitHubApiResponse<Release[]>> => {
  return githubApi.fetchReleases(owner, repo, page, perPage);
};

// Export types for external use
export type { GitHubApiConfig };
