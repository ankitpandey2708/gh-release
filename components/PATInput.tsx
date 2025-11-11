'use client';

import { useState } from 'react';

interface PATInputProps {
  onSubmit: (token: string) => void;
  onCancel?: () => void;
  loading?: boolean;
  errorMessage?: string;
  repoName: string;
}

export function PATInput({ onSubmit, onCancel, loading = false, errorMessage, repoName }: PATInputProps) {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    onSubmit(token.trim());
  };

  return (
    <div className="p-6 bg-yellow-50 border border-yellow-200/60 rounded-lg shadow-md">
      {/* Warning Icon and Header */}
      <div className="flex items-start gap-3 mb-4">
        <svg
          className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-yellow-900 mb-1">
            Private Repository Access Required
          </h3>
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">{repoName}</span> could not be accessed.
            This might be a private repository requiring authentication.
          </p>
        </div>
      </div>

      {/* PAT Input Form */}
      <form onSubmit={handleSubmit} className="mt-4">
        <label htmlFor="pat-input" className="block text-sm font-semibold text-yellow-900 mb-2">
          GitHub Personal Access Token
        </label>

        <div className="relative">
          <input
            id="pat-input"
            type={showToken ? 'text' : 'password'}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            className="w-full px-4 py-3 pr-12 border border-yellow-300 rounded-lg bg-white text-neutral-900 text-base placeholder:text-neutral-400 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200"
            disabled={loading}
            autoFocus
            aria-label="GitHub Personal Access Token"
          />
          <button
            type="button"
            onClick={() => setShowToken(!showToken)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors"
            aria-label={showToken ? 'Hide token' : 'Show token'}
            tabIndex={-1}
          >
            {showToken ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Remember Token Checkbox */}
        <div className="mt-3 flex items-center gap-2">
          <input
            id="remember-token"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-4 h-4 text-yellow-600 border-yellow-300 rounded focus:ring-yellow-500 focus:ring-2"
          />
          <label htmlFor="remember-token" className="text-sm text-yellow-800">
            Remember this token (stored in browser)
          </label>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-4 p-3 bg-yellow-100/50 rounded-lg border border-yellow-200/60">
          <p className="text-xs text-yellow-800 mb-2 font-semibold">How to create a token:</p>
          <ol className="text-xs text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Go to GitHub Settings → Developer settings → Personal access tokens</li>
            <li>Generate a new token (classic) with <code className="bg-yellow-200 px-1 rounded">repo</code> scope</li>
            <li>Copy and paste the token above</li>
          </ol>
          <a
            href="https://github.com/settings/tokens/new?description=GitHub%20Releases%20Dashboard&scopes=repo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-yellow-700 hover:text-yellow-900 underline mt-2 inline-block font-semibold"
          >
            Create token on GitHub →
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={loading || !token.trim()}
            className="flex-1 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-base rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {loading ? 'Analyzing...' : 'Analyze with Token'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-3 bg-white hover:bg-neutral-50 text-neutral-700 font-semibold text-base rounded-lg border border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
