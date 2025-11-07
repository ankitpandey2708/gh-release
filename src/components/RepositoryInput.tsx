"use client";

import React, { useState, useEffect, useRef } from "react";
import { validateRepositoryFormat, debouncedValidate, ValidationState, type ValidationResult } from "@/utils/validation";
import ValidationIcon from "./ValidationIcon";
import ErrorMessage from "./ErrorMessage";

export default function RepositoryInput() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [validationState, setValidationState] = useState<ValidationState>(ValidationState.EMPTY);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [isValidating, setIsValidating] = useState(false);
  const [ariaLiveMessage, setAriaLiveMessage] = useState<string>("");
  
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const clearButtonRef = useRef<HTMLButtonElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);
  
  // Keyboard shortcut state
  const lastSubmissionTime = useRef<number>(0);
  const submissionCooldown = 1000; // 1 second cooldown to prevent multiple submissions

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Handle empty input
    if (!newValue.trim()) {
      setValidationState(ValidationState.EMPTY);
      setValidationMessage("");
      setIsValidating(false);
      return;
    }
    
    // Set pending state immediately for visual feedback
    setValidationState(ValidationState.PENDING);
    setIsValidating(true);
    
    // Debounced validation
    debounceTimeoutRef.current = setTimeout(async () => {
      const result: ValidationResult = await debouncedValidate(newValue, 500);
      setValidationState(result.state);
      setValidationMessage(result.message || "");
      setIsValidating(false);
    }, 100); // Small initial delay for better UX
  };

  const handleFocus = () => {
    setIsFocused(true);
    
    // Trigger validation on focus if there's content
    if (inputValue.trim()) {
      const result = validateRepositoryFormat(inputValue);
      setValidationState(result.state);
      setValidationMessage(result.message || "");
      setIsValidating(false);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    // Final validation on blur
    if (inputValue.trim()) {
      const result = validateRepositoryFormat(inputValue);
      setValidationState(result.state);
      setValidationMessage(result.message || "");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!inputValue.trim()) {
      return;
    }

    // Final validation check before submit
    const result = validateRepositoryFormat(inputValue);
    if (!result.isValid) {
      setValidationState(result.state);
      setValidationMessage(result.message || "");
      return;
    }

    setIsLoading(true);
    
    // TODO: Implement actual repository analysis
    // For now, just simulate a delay
    setTimeout(() => {
      setIsLoading(false);
      console.log("Analyzing repository:", inputValue);
    }, 2000);
  };

  const handleReset = () => {
    setInputValue("");
    setIsLoading(false);
    setIsFocused(false);
    setValidationState(ValidationState.EMPTY);
    setValidationMessage("");
    setIsValidating(false);
    
    // Clear debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Get border color based on validation state
  const getBorderColor = () => {
    if (isLoading) return 'border-gray-300 dark:border-gray-600';
    if (!inputValue.trim()) return 'border-gray-300 dark:border-gray-600';
    if (validationState === ValidationState.VALID) return 'border-green-500 dark:border-green-600';
    if (validationState === ValidationState.INVALID) return 'border-red-500 dark:border-red-600';
    if (validationState === ValidationState.PENDING) return 'border-blue-500 dark:border-blue-600';
    return 'border-gray-300 dark:border-gray-600';
  };

  const getFocusRingColor = () => {
    if (validationState === ValidationState.VALID) return 'focus:ring-green-500';
    if (validationState === ValidationState.INVALID) return 'focus:ring-red-500';
    if (validationState === ValidationState.PENDING) return 'focus:ring-blue-500';
    return 'focus:ring-blue-500';
  };

  // Add comprehensive keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Escape key to clear form
    if (e.key === 'Escape' && inputValue.trim()) {
      e.preventDefault();
      handleReset();
      setAriaLiveMessage('Form cleared');
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }
    
    // Handle tab navigation enhancements
    if (e.key === 'Tab') {
      // Ensure proper focus management
      setTimeout(() => {
        if (document.activeElement === clearButtonRef.current && !inputValue.trim()) {
          // If we're at the clear button with empty input, skip to submit button
          if (submitButtonRef.current) {
            submitButtonRef.current.focus();
          }
        }
      }, 0);
    }
  };

  // Announce validation state changes for screen readers
  useEffect(() => {
    if (validationMessage) {
      setAriaLiveMessage(validationMessage);
    }
  }, [validationMessage]);

  // Focus management after form submission
  const handleFormSubmissionComplete = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setAriaLiveMessage('Repository analysis completed');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Skip Link for Accessibility */}
      <a 
        href="#repository-input"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white px-4 py-2 rounded-br-lg z-50"
        onFocus={(e) => {
          e.target.textContent = "Skip to repository input";
        }}
        onBlur={(e) => {
          e.target.textContent = "";
        }}
      >
        Skip to main content
      </a>

      <form 
        onSubmit={handleSubmit} 
        className="space-y-4"
        role="form"
        aria-label="Repository analysis form"
      >
        <div className="space-y-2">
          <label 
            htmlFor="repository-input" 
            className="block text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            GitHub Repository
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              id="repository-input"
              value={inputValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
              onKeyDown={handleKeyDown}
              placeholder="username/repository-name"
              className={`
                w-full px-4 py-3 pr-12 text-gray-900 bg-white border rounded-lg
                focus:outline-none ${getFocusRingColor()} focus:ring-2 focus:border-transparent
                dark:bg-gray-800 dark:text-gray-100
                transition-all duration-200 ease-in-out
                ${getBorderColor()}
                ${isFocused ? 'transform scale-[1.01]' : 'transform scale-100'}
                ${isValidating ? 'opacity-75' : 'opacity-100'}
              `}
              aria-label="Enter GitHub repository in the format username/repository-name"
              aria-describedby="repository-help repository-error"
              aria-invalid={validationState === ValidationState.INVALID}
              aria-keyshortcuts="Escape"
              tabIndex={0}
              disabled={isLoading}
            />
            
            {/* Validation Icon */}
            <ValidationIcon 
              state={validationState}
              className="right-3"
            />
          </div>
          
          {/* Error Message */}
          <ErrorMessage 
            message={validationMessage}
            isVisible={validationState === ValidationState.INVALID && !!validationMessage}
            className="mt-2"
          />
          
          {/* Help Text */}
          <p 
            id="repository-help" 
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            Enter a GitHub repository in the format "username/repository-name"
          </p>
        </div>

        <div className="flex gap-3" role="group" aria-label="Form actions">
          <button
            ref={submitButtonRef}
            type="submit"
            disabled={!inputValue.trim() || isLoading || validationState !== ValidationState.VALID}
            className={`
              flex-1 py-3 px-6 rounded-lg font-medium text-white
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
              ${(!inputValue.trim() || isLoading || validationState !== ValidationState.VALID)
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 hover:transform hover:scale-[1.02]'
              }
            `}
            aria-label={isLoading ? "Analyzing repository, please wait" : "Analyze repository"}
            aria-keyshortcuts="Enter"
            tabIndex={1}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </div>
            ) : validationState === ValidationState.PENDING ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Validating...
              </div>
            ) : (
              "Analyze"
            )}
          </button>

          <button
            ref={clearButtonRef}
            type="button"
            onClick={handleReset}
            disabled={!inputValue && !isLoading && !isValidating}
            className={`
              py-3 px-6 rounded-lg font-medium border transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
              ${(!inputValue && !isLoading && !isValidating)
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:transform hover:scale-[1.02]'
              }
            `}
            aria-label="Clear form"
            aria-keyshortcuts="Escape"
            tabIndex={2}
          >
            Clear
          </button>
        </div>

        {/* ARIA Live Region for Screen Reader Announcements */}
        <div
          ref={liveRegionRef}
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          role="status"
        >
          {ariaLiveMessage}
        </div>

        {/* Keyboard Shortcuts Help */}
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
            Keyboard shortcuts
          </summary>
          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300">
            <ul className="space-y-1">
              <li><kbd className="px-2 py-1 bg-white dark:bg-gray-700 border rounded text-xs">Enter</kbd> - Submit form</li>
              <li><kbd className="px-2 py-1 bg-white dark:bg-gray-700 border rounded text-xs">Escape</kbd> - Clear form</li>
              <li><kbd className="px-2 py-1 bg-white dark:bg-gray-700 border rounded text-xs">Tab</kbd> - Navigate between elements</li>
            </ul>
          </div>
        </details>
      </form>
    </div>
  );
}
