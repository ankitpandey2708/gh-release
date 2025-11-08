interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

function getErrorTips(message: string): string[] {
  if (message.includes('not found') || message.includes('404')) {
    return ['Check spelling', 'Verify repo exists', 'Try a different repo'];
  }
  if (message.includes('Rate limit') || message.includes('403')) {
    return ['Wait a few minutes', 'Rate limit will reset soon'];
  }
  if (message.includes('Network error')) {
    return ['Check internet connection', 'Try again'];
  }
  return [];
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const tips = getErrorTips(message);

  return (
    <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
      <h3 className="font-bold text-red-900 dark:text-red-300 mb-2">Error</h3>
      <p className="text-sm text-red-700 dark:text-red-400 mb-4">{message}</p>
      {tips.length > 0 && (
        <ul className="mt-2 mb-4 text-sm text-red-700 dark:text-red-400 space-y-1">
          {tips.map(tip => (
            <li key={tip} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded hover:bg-red-700 dark:hover:bg-red-800"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
