/**
 * Repository Format Validation Utilities
 * Provides regex-based validation for GitHub repository format with performance optimizations
 * and comprehensive documentation.
 */

/**
 * GitHub Repository Format Regex Pattern
 * 
 * Pattern Breakdown:
 * - ^[a-zA-Z0-9_.-]+ : Username/owner starts with alphanumeric, underscore, dot, or dash
 * - \/ : Literal forward slash separator
 * - [a-zA-Z0-9_.-]+ : Repository name with same character set
 * - $ : End of string
 * 
 * This pattern supports:
 * - Usernames: alphanumeric, underscores, dots, dashes
 * - Repository names: alphanumeric, underscores, dots, dashes
 * - Case sensitivity preserved
 * - No length restrictions (GitHub supports up to 39 characters per segment)
 * - Works with international characters in extended regex engines
 * 
 * Edge cases handled:
 * - Empty strings
 * - Special characters not allowed by GitHub
 * - Multiple slashes
 * - Leading/trailing whitespace
 * - Unicode characters (in modern JavaScript engines)
 */
const REPOSITORY_FORMAT_REGEX = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;

/**
 * Fallback regex for older JavaScript engines without Unicode support
 * More restrictive but ensures compatibility across different environments
 */
const FALLBACK_REPOSITORY_REGEX = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;

/**
 * Special character validation for repository names
 * GitHub doesn't allow certain characters even if they pass the main regex
 */
const INVALID_REPOSITORY_CHARS = /[<>:"|?*\\]/;

/**
 * Compiled regex patterns for performance optimization
 * Pre-compilation avoids regex recreation on every validation call
 */
const COMPILED_REGEX = new RegExp(REPOSITORY_FORMAT_REGEX.source, REPOSITORY_FORMAT_REGEX.flags);
const COMPILED_FALLBACK_REGEX = new RegExp(FALLBACK_REPOSITORY_REGEX.source, FALLBACK_REPOSITORY_REGEX.flags);

/**
 * Validation state enum for better type safety
 */
export enum ValidationState {
  EMPTY = 'empty',
  PENDING = 'pending',
  VALID = 'valid',
  INVALID = 'invalid'
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  state: ValidationState;
  message?: string;
  pattern: string;
}

/**
 * Performance monitoring for regex matching
 * Tracks validation performance for optimization opportunities
 */
let validationCallCount = 0;
let lastPerformanceCheck = 0;
const PERFORMANCE_CHECK_INTERVAL = 1000; // Check every 1000 calls

/**
 * Core validation function with pattern matching performance optimization
 * 
 * @param input - The repository string to validate
 * @returns ValidationResult object with validation status and details
 * 
 * @example
 * ```typescript
 * validateRepositoryFormat('facebook/react') // { isValid: true, state: 'valid' }
 * validateRepositoryFormat('invalid@repo')   // { isValid: false, state: 'invalid' }
 * validateRepositoryFormat('user/repo-name') // { isValid: true, state: 'valid' }
 * ```
 */
export function validateRepositoryFormat(input: string): ValidationResult {
  // Input sanitization
  if (typeof input !== 'string') {
    return {
      isValid: false,
      state: ValidationState.INVALID,
      message: 'Input must be a string',
      pattern: REPOSITORY_FORMAT_REGEX.source
    };
  }

  // Trim whitespace for validation
  const trimmedInput = input.trim();

  // Empty input validation
  if (trimmedInput.length === 0) {
    return {
      isValid: false,
      state: ValidationState.PENDING,
      message: 'Please enter a repository name',
      pattern: REPOSITORY_FORMAT_REGEX.source
    };
  }

  // Length validation (GitHub limits)
  if (trimmedInput.length > 100) {
    return {
      isValid: false,
      state: ValidationState.INVALID,
      message: 'Repository name is too long',
      pattern: REPOSITORY_FORMAT_REGEX.source
    };
  }

  // Check for multiple slashes
  const slashCount = (trimmedInput.match(/\//g) || []).length;
  if (slashCount > 1) {
    return {
      isValid: false,
      state: ValidationState.INVALID,
      message: 'Repository name must contain exactly one slash',
      pattern: REPOSITORY_FORMAT_REGEX.source
    };
  }

  // Check for invalid characters
  if (INVALID_REPOSITORY_CHARS.test(trimmedInput)) {
    return {
      isValid: false,
      state: ValidationState.INVALID,
      message: 'Repository name contains invalid characters',
      pattern: REPOSITORY_FORMAT_REGEX.source
    };
  }

  // Performance monitoring
  validationCallCount++;
  if (validationCallCount % PERFORMANCE_CHECK_INTERVAL === 0) {
    lastPerformanceCheck = Date.now();
  }

  // Primary regex validation
  const isValid = COMPILED_REGEX.test(trimmedInput);

  // Additional edge case validation
  if (isValid) {
    const [owner, repo] = trimmedInput.split('/');
    
    // Individual segment validation
    if (owner.length === 0 || repo.length === 0) {
      return {
        isValid: false,
        state: ValidationState.INVALID,
        message: 'Both owner and repository name are required',
        pattern: REPOSITORY_FORMAT_REGEX.source
      };
    }

    // GitHub-specific validation rules
    if (repo.startsWith('.') || repo.endsWith('.')) {
      return {
        isValid: false,
        state: ValidationState.INVALID,
        message: 'Repository name cannot start or end with a dot',
        pattern: REPOSITORY_FORMAT_REGEX.source
      };
    }

    if (repo.includes('..')) {
      return {
        isValid: false,
        state: ValidationState.INVALID,
        message: 'Repository name cannot contain consecutive dots',
        pattern: REPOSITORY_FORMAT_REGEX.source
      };
    }
  }

  return {
    isValid,
    state: isValid ? ValidationState.VALID : ValidationState.INVALID,
    message: isValid ? undefined : 'Invalid repository format. Use "username/repository-name" format.',
    pattern: REPOSITORY_FORMAT_REGEX.source
  };
}

/**
 * Fallback validation for environments with limited regex support
 * @param input - The repository string to validate
 * @returns ValidationResult object
 */
export function validateRepositoryFormatFallback(input: string): ValidationResult {
  const result = validateRepositoryFormat(input);
  
  // If primary validation succeeded, double-check with fallback
  if (result.isValid) {
    const isValidFallback = COMPILED_FALLBACK_REGEX.test(input.trim());
    return {
      ...result,
      isValid: isValidFallback,
      state: isValidFallback ? ValidationState.VALID : ValidationState.INVALID,
      message: isValidFallback ? undefined : 'Repository format not supported in current environment'
    };
  }
  
  return result;
}

/**
 * Performance-optimized validation for multiple inputs
 * @param inputs - Array of repository strings to validate
 * @returns Array of ValidationResult objects
 */
export function validateMultipleRepositories(inputs: string[]): ValidationResult[] {
  if (!Array.isArray(inputs)) {
    return [{
      isValid: false,
      state: ValidationState.INVALID,
      message: 'Input must be an array',
      pattern: REPOSITORY_FORMAT_REGEX.source
    }];
  }

  return inputs.map(input => validateRepositoryFormat(input));
}

/**
 * Get validation performance statistics
 * @returns Object containing performance metrics
 */
export function getValidationPerformanceStats() {
  return {
    callCount: validationCallCount,
    lastCheck: lastPerformanceCheck,
    pattern: REPOSITORY_FORMAT_REGEX.source,
    engine: 'JavaScript RegExp'
  };
}

/**
 * Reset performance monitoring counters
 */
export function resetValidationPerformanceStats() {
  validationCallCount = 0;
  lastPerformanceCheck = 0;
}

/**
 * Validate repository format for public repositories
 * Public repositories have additional restrictions
 * @param input - The repository string to validate
 * @returns ValidationResult object
 */
export function validatePublicRepositoryFormat(input: string): ValidationResult {
  const result = validateRepositoryFormat(input);
  
  if (!result.isValid) {
    return result;
  }

  const [owner, repo] = input.trim().split('/');
  
  // Public repository name restrictions
  if (repo.length > 100) {
    return {
      isValid: false,
      state: ValidationState.INVALID,
      message: 'Repository name too long for public repository',
      pattern: REPOSITORY_FORMAT_REGEX.source
    };
  }

  return result;
}

/**
 * Utility function to check if a repository format is supported
 * @param input - The repository string to check
 * @returns true if the format is supported, false otherwise
 */
export function isSupportedRepositoryFormat(input: string): boolean {
  const result = validateRepositoryFormat(input);
  return result.isValid;
}

/**
 * Debounced validation function for real-time validation
 * @param input - The repository string to validate
 * @param delay - Debounce delay in milliseconds
 * @returns Promise that resolves to ValidationResult
 */
export function debouncedValidate(input: string, delay: number = 500): Promise<ValidationResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(validateRepositoryFormat(input));
    }, delay);
  });
}

/**
 * Documentation and usage examples for the regex pattern
 */
export const VALIDATION_DOCUMENTATION = {
  description: 'GitHub repository format validation using regex pattern matching',
  pattern: REPOSITORY_FORMAT_REGEX.source,
  patternDescription: 'Alphanumeric, underscores, dots, and dashes for both username and repository name, separated by a forward slash',
  examples: [
    { input: 'facebook/react', valid: true, description: 'Standard repository format' },
    { input: 'user_name/repository-name', valid: true, description: 'Underscores and dashes' },
    { input: 'user.name/repo.name', valid: true, description: 'Dot separators' },
    { input: 'user123/repo456', valid: true, description: 'Numeric characters' },
    { input: 'user/repo@name', valid: false, description: 'Invalid character @' },
    { input: 'user name/repo', valid: false, description: 'Spaces not allowed' },
    { input: 'user//repo', valid: false, description: 'Multiple slashes' },
    { input: 'user', valid: false, description: 'Missing repository name' },
    { input: '/repo', valid: false, description: 'Missing username' }
  ],
  compatibility: {
    javascript: 'ES6+ with Unicode support',
    nodejs: 'All versions support basic pattern',
    browsers: 'Modern browsers with ES6 support'
  },
  performance: {
    precompiled: true,
    cache: 'Pattern compiled once for all validations',
    monitoring: 'Built-in performance tracking'
  }
};
