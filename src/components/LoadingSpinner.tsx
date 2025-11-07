"use client";

import React from "react";

/**
 * LoadingSpinner component with customizable size and styling
 * Supports reduced motion preferences and accessibility features
 */

export type SpinnerSize = 'small' | 'medium' | 'large';
export type SpinnerVariant = 'default' | 'light' | 'dark';

export interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  text?: string;
  className?: string;
  showText?: boolean;
  loadingText?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

/**
 * Get spinner size configuration
 */
const getSizeConfig = (size: SpinnerSize) => {
  switch (size) {
    case 'small':
      return {
        container: 'w-6 h-6',
        border: 'border-2',
        text: 'text-sm',
        spacing: 'gap-1'
      };
    case 'medium':
      return {
        container: 'w-8 h-8',
        border: 'border-2',
        text: 'text-base',
        spacing: 'gap-2'
      };
    case 'large':
      return {
        container: 'w-12 h-12',
        border: 'border-3',
        text: 'text-lg',
        spacing: 'gap-3'
      };
    default:
      return getSizeConfig('medium');
  }
};

/**
 * Get spinner color configuration
 */
const getVariantConfig = (variant: SpinnerVariant, theme: 'light' | 'dark' = 'light') => {
  const colors = {
    default: {
      light: {
        border: 'border-blue-500',
        text: 'text-blue-600',
        borderTop: 'border-t-transparent'
      },
      dark: {
        border: 'border-blue-400',
        text: 'text-blue-400',
        borderTop: 'border-t-transparent'
      }
    },
    light: {
      light: {
        border: 'border-gray-300',
        text: 'text-gray-600',
        borderTop: 'border-t-transparent'
      },
      dark: {
        border: 'border-gray-600',
        text: 'text-gray-400',
        borderTop: 'border-t-transparent'
      }
    },
    dark: {
      light: {
        border: 'border-gray-800',
        text: 'text-gray-800',
        borderTop: 'border-t-transparent'
      },
      dark: {
        border: 'border-gray-200',
        text: 'text-gray-200',
        borderTop: 'border-t-transparent'
      }
    }
  };

  const isDark = theme === 'dark';
  return colors[variant][isDark ? 'dark' : 'light'];
};

/**
 * Determine theme from className or document
 */
const getTheme = (className?: string): 'light' | 'dark' => {
  if (className?.includes('dark:')) {
    return 'dark';
  }
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
    return 'dark';
  }
  return 'light';
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  variant = 'default',
  text,
  className = '',
  showText = false,
  loadingText = 'Loading...',
  'aria-label': ariaLabel = 'Loading content, please wait',
  'data-testid': testId = 'loading-spinner',
  ...props
}) => {
  const sizeConfig = getSizeConfig(size);
  const theme = getTheme(className);
  const variantConfig = getVariantConfig(variant, theme);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  return (
    <div
      className={`
        flex items-center justify-center
        ${sizeConfig.spacing}
        ${className}
      `}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      data-testid={testId}
      {...props}
    >
      {/* Spinner Animation */}
      <div
        className={`
          ${sizeConfig.container}
          ${variantConfig.border}
          ${variantConfig.borderTop}
          ${prefersReducedMotion ? '' : 'animate-spin'}
          rounded-full
          ${prefersReducedMotion ? 'opacity-60' : ''}
        `}
        style={{
          ...(prefersReducedMotion && {
            background: 'conic-gradient(from 0deg, currentColor 0deg, currentColor 90deg, transparent 90deg, transparent 360deg)'
          })
        }}
      />
      
      {/* Loading Text */}
      {(showText || text) && (
        <span
          className={`
            ${variantConfig.text}
            ${sizeConfig.text}
            font-medium
            ${prefersReducedMotion ? 'animate-pulse' : ''}
          `}
        >
          {text || loadingText}
        </span>
      )}

      {/* Screen reader only text */}
      <span className="sr-only">
        {ariaLabel}
      </span>
    </div>
  );
};

export default LoadingSpinner;

/**
 * Simple loading spinner for inline use
 */
export const InlineSpinner: React.FC<{
  size?: SpinnerSize;
  className?: string;
  'data-testid'?: string;
}> = ({ 
  size = 'small', 
  className = '', 
  'data-testid': testId = 'inline-spinner',
  ...props 
}) => {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const sizeConfig = getSizeConfig(size);
  const theme = getTheme(className);
  const variantConfig = getVariantConfig('default', theme);

  return (
    <div
      className={`
        ${sizeConfig.container}
        ${variantConfig.border}
        ${variantConfig.borderTop}
        ${prefersReducedMotion ? '' : 'animate-spin'}
        rounded-full
        ${className}
      `}
      data-testid={testId}
      {...props}
    />
  );
};

/**
 * Full screen loading overlay
 */
export const LoadingOverlay: React.FC<{
  isLoading: boolean;
  text?: string;
  background?: 'white' | 'black' | 'transparent';
  className?: string;
}> = ({ 
  isLoading, 
  text = 'Loading...', 
  background = 'transparent',
  className = '',
  ...props 
}) => {
  if (!isLoading) return null;

  const backgroundClasses = {
    white: 'bg-white/90 dark:bg-gray-900/90',
    black: 'bg-black/50',
    transparent: 'bg-transparent'
  };

  return (
    <div
      className={`
        absolute inset-0
        flex items-center justify-center
        z-50
        ${backgroundClasses[background]}
        ${className}
      `}
      role="status"
      aria-live="polite"
      aria-label="Loading overlay"
      data-testid="loading-overlay"
      {...props}
    >
      <LoadingSpinner 
        size="large" 
        text={text}
        showText={true}
      />
    </div>
  );
};

/**
 * Loading state container
 */
export const LoadingContainer: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  text?: string;
  overlay?: boolean;
  className?: string;
}> = ({
  isLoading,
  children,
  loadingComponent,
  text = 'Loading...',
  overlay = true,
  className = '',
  ...props
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  if (!overlay) {
    return (
      <div className={className} {...props}>
        {loadingComponent || <LoadingSpinner size="large" text={text} showText={true} />}
      </div>
    );
  }

  return (
    <div 
      className={`relative ${className}`}
      {...props}
    >
      {children}
      <LoadingOverlay 
        isLoading={isLoading} 
        text={text}
        background="transparent"
      />
    </div>
  );
};
