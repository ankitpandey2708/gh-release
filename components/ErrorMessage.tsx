interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

function getErrorTips(message: string): string[] {
  if (message.includes('not found') || message.includes('404')) {
    return ['Check the repository name spelling', 'Verify the repository exists on GitHub', 'Try searching for a different repository'];
  }
  if (message.includes('Rate limit') || message.includes('403')) {
    return ['Wait a few minutes before trying again', 'Rate limit will reset automatically'];
  }
  if (message.includes('Network error')) {
    return ['Check your internet connection', 'Refresh the page and try again'];
  }
  return [];
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const tips = getErrorTips(message);

  return (
    <div className="p-3 bg-error-light border border-error/20 rounded-md shadow-sm">
      {/* Error heading (Design Spec H.5) */}
      <div className="flex items-start gap-2 mb-2">
        <svg className="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1">
          <h3 className="text-h3 font-semibold text-error-dark mb-0.5">Error</h3>
          <p className="text-body text-error-dark">{message}</p>
        </div>
      </div>

      {/* Actionable tips - help users fix the problem (Design Spec H.6) */}
      {tips.length > 0 && (
        <div className="mt-2 mb-2 p-2 bg-error-light/50 rounded-md border border-error/20">
          <p className="text-body-sm font-semibold text-error-dark mb-1">Suggestions:</p>
          <ul className="text-body-sm text-error-dark space-y-0.5">
            {tips.map(tip => (
              <li key={tip} className="flex items-start gap-1">
                <span className="text-error font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Primary action - always suggest next step (Design Spec H.6) */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-2 py-1 bg-error text-white font-medium text-body rounded-md hover:bg-error-dark transition-colors duration-200 shadow-sm hover:shadow-md min-h-[44px]"
        >
          Try again
        </button>
      )}
    </div>
  );
}
