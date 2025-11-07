"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  LoadingStage, 
  getLoadingText, 
  TypewriterEffect, 
  estimateProgress, 
  getEstimatedTimeRemaining 
} from "../utils/loadingStates";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Props for the LoadingText component
 */
export interface LoadingTextProps {
  stage: LoadingStage;
  showSpinner?: boolean;
  showDescription?: boolean;
  showProgress?: boolean;
  showTimeEstimate?: boolean;
  animated?: boolean;
  typewriterSpeed?: number;
  className?: string;
  variant?: 'default' | 'minimal' | 'detailed' | 'compact';
  align?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large';
  customMessage?: string;
  startTime?: number;
  'aria-label'?: string;
  'data-testid'?: string;
}

/**
 * LoadingText component with configurable styling and animations
 */
const LoadingText: React.FC<LoadingTextProps> = ({
  stage,
  showSpinner = true,
  showDescription = false,
  showProgress = false,
  showTimeEstimate = false,
  animated = false,
  typewriterSpeed = 50,
  className = "",
  variant = "default",
  align = "center",
  size = "medium",
  customMessage,
  startTime = Date.now(),
  'aria-label': ariaLabel,
  'data-testid': testId = "loading-text",
  ...props
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentStage, setCurrentStage] = useState(stage);
  const typewriterRef = useRef<TypewriterEffect | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  // Update current stage when prop changes
  useEffect(() => {
    setCurrentStage(stage);
  }, [stage]);

  // Handle typewriter effect
  useEffect(() => {
    if (animated && elementRef.current) {
      const text = customMessage || getLoadingText(stage).message;
      typewriterRef.current = new TypewriterEffect(text, typewriterSpeed);
      typewriterRef.current.start(elementRef.current);
      
      return () => {
        typewriterRef.current?.stop();
      };
    } else {
      setDisplayText(customMessage || getLoadingText(stage).message);
    }
  }, [stage, animated, customMessage, typewriterSpeed]);

  // Update text when stage changes
  useEffect(() => {
    if (!animated) {
      setDisplayText(customMessage || getLoadingText(stage).message);
    }
  }, [stage, customMessage, animated]);

  const loadingConfig = getLoadingText(currentStage);
  const progress = estimateProgress(currentStage);
  const timeRemaining = getEstimatedTimeRemaining(startTime, currentStage);

  // Size configurations
  const sizeConfig = {
    small: {
      text: "text-sm",
      description: "text-xs",
      spacing: "gap-1"
    },
    medium: {
      text: "text-base",
      description: "text-sm",
      spacing: "gap-2"
    },
    large: {
      text: "text-lg",
      description: "text-base",
      spacing: "gap-3"
    }
  };

  // Variant configurations
  const variantConfig = {
    default: {
      container: "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm",
      text: "text-gray-900 dark:text-gray-100",
      description: "text-gray-600 dark:text-gray-400",
      border: "border border-gray-200 dark:border-gray-700"
    },
    minimal: {
      container: "bg-transparent",
      text: "text-gray-600 dark:text-gray-400",
      description: "text-gray-500 dark:text-gray-500",
      border: ""
    },
    detailed: {
      container: "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50",
      text: "text-gray-900 dark:text-gray-100",
      description: "text-gray-700 dark:text-gray-300",
      border: "shadow-lg"
    },
    compact: {
      container: "bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm",
      text: "text-gray-800 dark:text-gray-200",
      description: "text-gray-600 dark:text-gray-400",
      border: "border border-gray-300/30 dark:border-gray-600/30"
    }
  };

  const currentSizeConfig = sizeConfig[size];
  const currentVariantConfig = variantConfig[variant];

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  // Skip animation for users who prefer reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <div
      className={`
        flex flex-col ${currentSizeConfig.spacing} ${currentVariantConfig.container}
        ${currentVariantConfig.border} rounded-lg p-4
        ${alignmentClasses[align]}
        ${className}
      `}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel || `Loading: ${loadingConfig.message}`}
      data-testid={testId}
      {...props}
    >
      {/* Main loading text with spinner */}
      <div className={`flex items-center ${currentSizeConfig.spacing} ${alignmentClasses[align]}`}>
        {showSpinner && (
          <LoadingSpinner 
            size={size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium'} 
            variant="default"
          />
        )}
        
        <div
          ref={elementRef}
          className={`
            ${currentSizeConfig.text} ${currentVariantConfig.text} font-medium
            ${prefersReducedMotion && animated ? 'animate-pulse' : ''}
          `}
          data-testid={`${testId}-message`}
        >
          {!animated ? displayText : undefined}
        </div>
      </div>

      {/* Description */}
      {showDescription && loadingConfig.description && (
        <div 
          className={`
            ${currentSizeConfig.description} ${currentVariantConfig.description}
            ${prefersReducedMotion ? 'animate-pulse' : 'animate-in fade-in-0 duration-500'}
          `}
          data-testid={`${testId}-description`}
        >
          {loadingConfig.description}
        </div>
      )}

      {/* Progress indicator */}
      {showProgress && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs ${currentVariantConfig.description}`}>
              Progress
            </span>
            <span className={`text-xs ${currentVariantConfig.description}`}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
              data-testid={`${testId}-progress-bar`}
            />
          </div>
        </div>
      )}

      {/* Time estimate */}
      {showTimeEstimate && (
        <div 
          className={`
            ${currentSizeConfig.description} ${currentVariantConfig.description}
            ${prefersReducedMotion ? '' : 'animate-in fade-in-0 duration-500 delay-200'}
          `}
          data-testid={`${testId}-time-estimate`}
        >
          Time remaining: {timeRemaining}
        </div>
      )}

      {/* Screen reader only text */}
      <span className="sr-only">
        {ariaLabel || `Loading: ${loadingConfig.message}`}
      </span>
    </div>
  );
};

export default LoadingText;

/**
 * Hook for managing loading state text
 */
export const useLoadingText = (initialStage: LoadingStage = 'initializing') => {
  const [stage, setStage] = useState<LoadingStage>(initialStage);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState<number | undefined>();

  const startLoading = (newStage: LoadingStage = 'initializing') => {
    setStage(newStage);
    setIsLoading(true);
    setStartTime(Date.now());
  };

  const setLoadingStage = (newStage: LoadingStage) => {
    setStage(newStage);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setStartTime(undefined);
  };

  return {
    stage,
    isLoading,
    startTime,
    startLoading,
    setLoadingStage,
    stopLoading
  };
};

/**
 * Loading message component for inline use
 */
export const InlineLoadingMessage: React.FC<{
  stage: LoadingStage;
  className?: string;
  showSpinner?: boolean;
}> = ({ stage, className = "", showSpinner = true }) => {
  const config = getLoadingText(stage);
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showSpinner && <LoadingSpinner size="small" variant="light" />}
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {config.message}
      </span>
    </div>
  );
};

/**
 * Loading overlay component for full screen usage
 */
export const LoadingOverlay: React.FC<{
  stage: LoadingStage;
  showProgress?: boolean;
  className?: string;
}> = ({ stage, showProgress = true, className = "" }) => {
  return (
    <div className={`
      fixed inset-0 bg-black/20 backdrop-blur-sm 
      flex items-center justify-center z-50
      ${className}
    `}>
      <LoadingText
        stage={stage}
        variant="detailed"
        showSpinner={true}
        showDescription={true}
        showProgress={showProgress}
        showTimeEstimate={true}
        size="large"
        className="max-w-md mx-auto"
      />
    </div>
  );
};

/**
 * Context-specific loading components
 */
export const FormLoadingMessage: React.FC<{
  stage: 'validating' | 'submitting' | 'processing';
  className?: string;
}> = ({ stage, className = "" }) => {
  const messageMap = {
    validating: 'Validating repository format...',
    submitting: 'Submitting analysis request...',
    processing: 'Processing your request...'
  };

  return (
    <InlineLoadingMessage
      stage={stage as LoadingStage}
      className={className}
    />
  );
};

export const ChartLoadingMessage: React.FC<{
  stage: 'loading' | 'rendering' | 'updating';
  className?: string;
}> = ({ stage, className = "" }) => {
  const messageMap = {
    loading: 'Loading chart data...',
    rendering: 'Rendering visualization...',
    updating: 'Updating chart...'
  };

  return (
    <InlineLoadingMessage
      stage={stage as LoadingStage}
      className={className}
    />
  );
};

export const ApiLoadingMessage: React.FC<{
  stage: 'connecting' | 'fetching' | 'retrying';
  className?: string;
}> = ({ stage, className = "" }) => {
  const messageMap = {
    connecting: 'Connecting to GitHub...',
    fetching: 'Fetching data...',
    retrying: 'Retrying request...'
  };

  return (
    <InlineLoadingMessage
      stage={stage as LoadingStage}
      className={className}
    />
  );
};
