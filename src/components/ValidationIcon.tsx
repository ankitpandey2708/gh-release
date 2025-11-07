"use client";

import React from "react";
import { ValidationState } from "@/utils/validation";

interface ValidationIconProps {
  state: ValidationState;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showHover?: boolean;
  isInteractive?: boolean;
}

/**
 * Icon size mappings for consistent design system implementation
 */
const SIZE_CLASSES = {
  sm: 'w-3 h-3 text-xs',
  md: 'w-4 h-4 text-sm', 
  lg: 'w-5 h-5 text-base',
  xl: 'w-6 h-6 text-lg'
};

/**
 * Spinner size mappings for loading states
 */
const SPINNER_CLASSES = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4', 
  xl: 'w-5 h-5'
};

/**
 * ValidationIcon Component
 * 
 * Provides visual feedback for form validation states with smooth animations,
 * accessibility support, and multiple size variations.
 * 
 * @param state - Current validation state
 * @param className - Additional CSS classes
 * @param size - Icon size variant (sm, md, lg, xl)
 * @param showHover - Enable hover states and interactive feedback
 * @param isInteractive - Whether the icon should have interactive styling
 */
export default function ValidationIcon({ 
  state, 
  className = "", 
  size = 'lg',
  showHover = true,
  isInteractive = true
}: ValidationIconProps) {
  
  const handleError = () => {
    // Fallback for icon loading failures
    console.warn('ValidationIcon: SVG rendering failed for state:', state);
  };

  const renderIcon = () => {
    const sizeClass = SIZE_CLASSES[size];
    const spinnerSizeClass = SPINNER_CLASSES[size];
    
    try {
      switch (state) {
        case 'valid':
          return (
            <svg
              className={`${sizeClass} text-green-500 transition-all duration-200`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              onError={handleError}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          );
        case 'invalid':
          return (
            <svg
              className={`${sizeClass} text-red-500 transition-all duration-200`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              onError={handleError}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          );
        case 'pending':
          return (
            <div className={sizeClass}>
              <div className={`
                ${spinnerSizeClass} 
                border-2 border-blue-500 border-t-transparent 
                rounded-full animate-spin transition-all duration-200
              `} />
            </div>
          );
        case 'empty':
        default:
          return null;
      }
    } catch (error) {
      // Fallback for any rendering errors
      handleError();
      return (
        <div className={sizeClass}>
          <div className={`
            ${spinnerSizeClass} 
            bg-gray-300 rounded-full transition-all duration-200
          `} />
        </div>
      );
    }
  };

  // Don't render anything for empty state
  if (state === 'empty') {
    return null;
  }

  // Generate screen reader announcement text
  const getAriaLabel = () => {
    switch (state) {
      case 'valid':
        return 'Repository format is valid';
      case 'invalid':
        return 'Repository format is invalid';
      case 'pending':
        return 'Validating repository format';
      default:
        return '';
    }
  };

  // Generate hover effects classes
  const getHoverClasses = () => {
    if (!showHover || !isInteractive) return '';
    
    return `
      hover:scale-110 hover:shadow-md
      focus:outline-none focus:ring-2 focus:ring-offset-1
      focus:ring-blue-500 focus:ring-opacity-50
      active:scale-95
      cursor-default
    `;
  };

  return (
    <div
      className={`
        absolute right-3 top-1/2 transform -translate-y-1/2
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        z-10
        ${getHoverClasses()}
        ${className}
      `}
      aria-live="polite"
      aria-atomic="true"
      role="status"
      aria-label={getAriaLabel()}
      title={getAriaLabel()}
    >
      <div className="flex items-center justify-center">
        {renderIcon()}
      </div>
    </div>
  );
}

/**
 * Get validation icon size classes for external use
 * @param size - Size variant
 * @returns CSS classes for the specified size
 */
export const getValidationIconSizeClasses = (size: 'sm' | 'md' | 'lg' | 'xl' = 'lg') => {
  return SIZE_CLASSES[size];
};

/**
 * Get validation icon color classes for external use
 * @param state - Validation state
 * @returns CSS classes for the specified state
 */
export const getValidationIconColorClasses = (state: ValidationState) => {
  switch (state) {
    case ValidationState.VALID:
      return 'text-green-500';
    case ValidationState.INVALID:
      return 'text-red-500';
    case ValidationState.PENDING:
      return 'text-blue-500';
    default:
      return 'text-gray-400';
  }
};
