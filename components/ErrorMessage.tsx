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
    <div className="p-6 bg-red-50 border border-red-200/60 rounded-lg shadow-md">
      {/* Error heading */}
      <div className="flex items-start gap-3 mb-3">
        <svg className="w-6 h-6 text-error flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-red-900 mb-1">Error</h3>
          <p className="text-base text-red-700">{message}</p>
        </div>
      </div>

      {/* Actionable tips - help users fix the problem */}
      {tips.length > 0 && (
        <div className="mt-4 mb-4 p-4 bg-red-100/50 rounded-lg border border-red-200/60">
          <p className="text-sm font-semibold text-red-900 mb-2">Suggestions:</p>
          <ul className="text-sm text-red-700 space-y-1">
            {tips.map(tip => (
              <li key={tip} className="flex items-start gap-2">
                <span className="text-error font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Primary action - always suggest next step */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-error-500 hover:bg-error-600 text-white font-semibold text-base rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Try again
        </button>
      )}
    </div>
  );
}
