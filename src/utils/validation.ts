/**
 * Validation utilities for GitHub repository input
 */

export type ValidationState = 'valid' | 'invalid' | 'pending' | 'empty';

export interface ValidationResult {
  isValid: boolean;
  state: ValidationState;
  message?: string;
}

/**
 * Regex pattern for GitHub repository format
 * Matches: username/repository-name
 * Allows letters, numbers, dots, hyphens, and underscores
 */
const REPOSITORY_PATTERN = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;

/**
 * Validates if the input matches GitHub repository format
 * @param input - The repository string to validate
 * @returns Validation result with state and message
 */
export function validateRepositoryFormat(input: string): ValidationResult {
  const trimmedInput = input.trim();
  
  // Handle empty input
  if (!trimmedInput) {
    return {
      isValid: false,
      state: 'empty',
      message: ''
    };
  }
  
  // Check format
  if (REPOSITORY_PATTERN.test(trimmedInput)) {
    return {
      isValid: true,
      state: 'valid',
      message: 'Valid repository format'
    };
  }
  
  // Determine specific validation errors
  let errorMessage = 'Invalid repository format';
  
  if (!trimmedInput.includes('/')) {
    errorMessage = 'Repository name must include username and repository (e.g., "username/repository")';
  } else {
    const [username, repo] = trimmedInput.split('/');
    
    if (!username) {
      errorMessage = 'Username cannot be empty';
    } else if (!repo) {
      errorMessage = 'Repository name cannot be empty';
    } else {
      // Check for invalid characters
      const invalidCharPattern = /[^a-zA-Z0-9_.-]/;
      if (invalidCharPattern.test(username) || invalidCharPattern.test(repo)) {
        errorMessage = 'Repository name can only contain letters, numbers, dots, hyphens, and underscores';
      }
    }
  }
  
  return {
    isValid: false,
    state: 'invalid',
    message: errorMessage
  };
}

/**
 * Debounced validation function to avoid excessive updates
 * @param input - The input to validate
 * @param delay - Debounce delay in milliseconds (default: 500ms)
 * @returns Promise that resolves to validation result after delay
 */
export function debouncedValidate(
  input: string, 
  delay: number = 500
): Promise<ValidationResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(validateRepositoryFormat(input));
    }, delay);
  });
}

/**
 * Validates repository format for international characters
 * Note: GitHub actually supports Unicode characters in repository names
 * This is a more permissive validation that handles international characters
 */
export function validateRepositoryFormatInternational(input: string): ValidationResult {
  const trimmedInput = input.trim();
  
  // Handle empty input
  if (!trimmedInput) {
    return {
      isValid: false,
      state: 'empty',
      message: ''
    };
  }
  
  // More permissive pattern that includes international characters
  const internationalPattern = /^[^\/\s]+\/[^\/\s]+$/;
  
  if (internationalPattern.test(trimmedInput)) {
    return {
      isValid: true,
      state: 'valid',
      message: 'Valid repository format'
    };
  }
  
  // More specific error messages
  if (!trimmedInput.includes('/')) {
    return {
      isValid: false,
      state: 'invalid',
      message: 'Repository name must include username and repository (e.g., "username/repository")'
    };
  }
  
  return {
    isValid: false,
    state: 'invalid',
    message: 'Repository format should be "username/repository"'
  };
}

/**
 * Test cases for validation
 */
export const VALIDATION_TEST_CASES = {
  valid: [
    'facebook/react',
    'user-name/repo-name',
    'user_name/repo_name',
    'user.name/repo.name',
    'user123/repo456',
    'a/b'
  ],
  invalid: [
    'invalid@repository"name',
    'repo',
    'user//repo',
    'user/',
    '/repo',
    'user repo',
    'user  /repo',
    '',
    ' ',
    'user-name/repo-name/extra'
  ]
};

/**
 * Edge case testing function
 */
export function testValidationWithEdgeCases(): void {
  console.log('Testing validation with edge cases:');
  
  // Test valid cases
  VALIDATION_TEST_CASES.valid.forEach(testCase => {
    const result = validateRepositoryFormat(testCase);
    console.log(`"${testCase}" -> ${result.state} (${result.isValid})`);
  });
  
  // Test invalid cases
  VALIDATION_TEST_CASES.invalid.forEach(testCase => {
    const result = validateRepositoryFormat(testCase);
    console.log(`"${testCase}" -> ${result.state} (${result.isValid})`);
  });
}
