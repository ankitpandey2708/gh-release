"use client";

import React, { useState, useEffect } from 'react';
import { rateLimitService, type RateLimitEvent } from '@/services/rateLimitService';

// Mock toast if react-toastify is not available
const toast = {
  error: (message: string) => console.error(message),
  warn: (message: string) => console.warn(message),
  success: (message: string) => console.log(message),
  info: (message: string) => console.info(message),
};

interface RateLimitNotificationProps {
  className?: string;
  enableToast?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

interface NotificationState {
  visible: boolean;
  event: RateLimitEvent | null;
  position: { x: number; y: number };
}

/**
 * Rate limit notification banner component
 */
function RateLimitBanner({ event, onClose }: { event: RateLimitEvent; onClose: () => void }) {
  const getSeverityColor = (type: RateLimitEvent['type']) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200';
      case 'reset':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200';
    }
  };

  const getIcon = (type: RateLimitEvent['type']) => {
    switch (type) {
      case 'critical':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'reset':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-md w-full mx-4 p-4 border rounded-lg shadow-lg
      transform transition-all duration-300 ease-in-out
      ${getSeverityColor(event.type)}
    `}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon(event.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium mb-1">
            {event.type === 'critical' && 'Rate Limit Critical'}
            {event.type === 'warning' && 'Rate Limit Warning'}
            {event.type === 'reset' && 'Rate Limit Reset'}
            {event.type === 'queue_full' && 'Queue Full'}
            {event.type === 'retry' && 'Retrying Request'}
            {event.type === 'success' && 'Request Success'}
          </h4>
          
          <p className="text-sm opacity-90 mb-2">
            {event.message}
          </p>
          
          {event.details && event.type === 'critical' && event.details.recommendations && (
            <div className="text-xs space-y-1">
              <p className="font-medium">Recommendations:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {event.details.recommendations.map((rec: string, index: number) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
          
          {event.details && event.type === 'retry' && (
            <div className="text-xs">
              Attempt {event.details.attempt} of {event.details.attempt + 1}
            </div>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * Rate limit status display component
 */
function RateLimitStatus() {
  const [status, setStatus] = useState(rateLimitService.getStatus());

  useEffect(() => {
    const updateStatus = () => {
      setStatus(rateLimitService.getStatus());
    };

    // Update status every 5 seconds
    const interval = setInterval(updateStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!status.hasData) {
    return null;
  }

  const getStatusColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-green-600 dark:text-green-400';
    }
  };

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          status.severity === 'critical' ? 'bg-red-500' :
          status.severity === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
        }`} />
        <span className="text-gray-600 dark:text-gray-400">Rate Limit:</span>
        <span className={getStatusColor(status.severity)}>
          {status.message}
        </span>
      </div>
      
      {status.timeUntilReset !== 'Rate limit reset' && (
        <div className="text-gray-500 dark:text-gray-400">
          Resets in: {status.timeUntilReset}
        </div>
      )}
      
      {status.percentage !== undefined && status.percentage <= 20 && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {status.percentage}% remaining
        </div>
      )}
    </div>
  );
}

/**
 * Main rate limit notification component
 */
export default function RateLimitNotification({ 
  className = '',
  enableToast = true,
  position = 'top-right'
}: RateLimitNotificationProps) {
  const [notification, setNotification] = useState<NotificationState>({
    visible: false,
    event: null,
    position: { x: 0, y: 0 }
  });

  useEffect(() => {
    const handleRateLimitEvent = (event: RateLimitEvent) => {
      // Show banner for critical events
      if (event.type === 'critical' || event.type === 'warning') {
        setNotification({
          visible: true,
          event,
          position: { x: 0, y: 0 }
        });

        // Auto-hide after 10 seconds
        setTimeout(() => {
          setNotification(prev => ({ ...prev, visible: false }));
        }, 10000);
      }

      // Show toast notifications if enabled
      if (enableToast) {
        switch (event.type) {
          case 'critical':
            toast.error(event.message);
            break;
          case 'warning':
            toast.warn(event.message);
            break;
          case 'reset':
            toast.success('Rate limit has been reset');
            break;
          case 'retry':
            toast.info(`Retrying request... (attempt ${event.details?.attempt || 1})`);
            break;
        }
      }
    };

    // Register event listener
    rateLimitService.addEventListener(handleRateLimitEvent);

    // Cleanup
    return () => {
      rateLimitService.removeEventListener(handleRateLimitEvent);
    };
  }, [enableToast, position]);

  return (
    <div className={className}>
      {/* Rate limit status indicator */}
      <RateLimitStatus />
      
      {/* Notification banner */}
      {notification.visible && notification.event && (
        <RateLimitBanner
          event={notification.event}
          onClose={() => setNotification(prev => ({ ...prev, visible: false }))}
        />
      )}
    </div>
  );
}

/**
 * Hook for using rate limit notifications
 */
export function useRateLimitNotifications() {
  const [events, setEvents] = useState<RateLimitEvent[]>([]);

  useEffect(() => {
    const handleEvent = (event: RateLimitEvent) => {
      setEvents(prev => [...prev.slice(-9), event]); // Keep last 10 events
    };

    rateLimitService.addEventListener(handleEvent);
    
    return () => {
      rateLimitService.removeEventListener(handleEvent);
    };
  }, []);

  const clearEvents = () => {
    setEvents([]);
  };

  return {
    events,
    clearEvents,
    status: rateLimitService.getStatus(),
    config: rateLimitService.getConfig(),
    recentEvents: rateLimitService.getRecentEvents(5),
  };
}
