"use client";

import { useState, useCallback } from "react";
import type { RepositoryMetadata } from "@/lib/types";
import { fetchRepositoryMetadata } from "@/services/githubApi";
import { NotFoundError, AuthenticationError, RateLimitError } from "@/services/githubApi";

export interface UseRepositoryMetadataResult {
  metadata: RepositoryMetadata | null;
  isLoading: boolean;
  error: string | null;
  fetchMetadata: (owner: string, repo: string) => Promise<void>;
  clearMetadata: () => void;
  clearError: () => void;
}

export function useRepositoryMetadata(): UseRepositoryMetadataResult {
  const [metadata, setMetadata] = useState<RepositoryMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetadata = useCallback(async (owner: string, repo: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate input
      if (!owner || !repo) {
        throw new Error("Owner and repository name are required");
      }

      // Basic validation for GitHub repository format
      const repoPattern = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;
      if (!repoPattern.test(`${owner}/${repo}`)) {
        throw new Error("Invalid repository format. Expected format: username/repository-name");
      }

      // Fetch repository metadata
      const response = await fetchRepositoryMetadata(owner, repo);
      
      if (response.status === 200) {
        setMetadata(response.data);
      } else {
        throw new Error(`Failed to fetch repository: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      let errorMessage = "An unexpected error occurred";
      
      if (err instanceof NotFoundError) {
        errorMessage = `Repository "${owner}/${repo}" not found. Please check the repository name and owner.`;
      } else if (err instanceof AuthenticationError) {
        errorMessage = "GitHub API authentication failed. Please check your API token.";
      } else if (err instanceof RateLimitError) {
        const resetTime = err.rateLimitInfo ? new Date(err.rateLimitInfo.reset * 1000) : null;
        errorMessage = `GitHub API rate limit exceeded. ${resetTime ? `Please try again after ${resetTime.toLocaleTimeString()}.` : "Please try again later."}`;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setMetadata(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMetadata = useCallback(() => {
    setMetadata(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    metadata,
    isLoading,
    error,
    fetchMetadata,
    clearMetadata,
    clearError,
  };
}

// Helper function to parse repository string into owner and repo
export function parseRepositoryString(repositoryString: string): { owner: string; repo: string } | null {
  if (!repositoryString) return null;

  const parts = repositoryString.trim().split('/');
  if (parts.length !== 2) return null;

  const [owner, repo] = parts;
  
  if (!owner || !repo) return null;
  
  return { owner, repo };
}

// Hook for repository input form integration
export function useRepositoryInput() {
  const { metadata, isLoading, error, fetchMetadata, clearMetadata, clearError } = useRepositoryMetadata();
  const [inputValue, setInputValue] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (value: string) => {
    const parsed = parseRepositoryString(value);
    
    if (!parsed) {
      setLocalError("Invalid repository format. Please use format: username/repository-name");
      return;
    }

    setLocalError(null); // Clear local error
    await fetchMetadata(parsed.owner, parsed.repo);
  }, [fetchMetadata]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    // Clear any previous errors when user starts typing
    if (error || localError) {
      clearError();
      setLocalError(null);
    }
  }, [error, localError, clearError]);

  return {
    metadata,
    isLoading,
    error: error || localError,
    inputValue,
    handleSubmit,
    handleInputChange,
    clearMetadata,
    clearError: () => {
      clearError();
      setLocalError(null);
    },
  };
}
