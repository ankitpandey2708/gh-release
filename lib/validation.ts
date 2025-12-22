const PATTERN = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/;

/**
 * Extracts owner/repo from various GitHub URL formats
 * Supports:
 * - owner/repo
 * - https://github.com/owner/repo
 * - https://github.com/owner/repo/releases
 * - http://github.com/owner/repo
 * - github.com/owner/repo
 * - www.github.com/owner/repo
 */
export function extractRepoFromInput(input: string): string {
  const trimmed = input.trim();

  // If it doesn't contain github.com or a protocol, assume it's already owner/repo format
  if (!trimmed.includes('github.com') && !trimmed.startsWith('http')) {
    return trimmed.toLowerCase();
  }

  try {
    // Handle URLs with or without protocol
    let urlString = trimmed;

    // Add protocol if missing
    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
      urlString = 'https://' + urlString;
    }

    const url = new URL(urlString);

    // Verify it's a github.com URL
    if (!url.hostname.includes('github.com')) {
      return trimmed.toLowerCase(); // Return original if not github.com
    }

    // Extract pathname: /owner/repo or /owner/repo/anything
    const pathParts = url.pathname.split('/').filter(Boolean);

    // Need at least owner and repo
    if (pathParts.length >= 2) {
      return `${pathParts[0].toLowerCase()}/${pathParts[1].toLowerCase()}`;
    }

    return trimmed.toLowerCase(); // Return original if can't extract
  } catch {
    // If URL parsing fails, return original input
    return trimmed.toLowerCase();
  }
}

export function validateRepo(input: string): { valid: boolean; error?: string; repo?: string } {
  if (!input.trim()) {
    return { valid: false, error: 'Enter a repository name' };
  }

  // Extract owner/repo from input (handles URLs)
  const extracted = extractRepoFromInput(input);

  if (!PATTERN.test(extracted)) {
    return { valid: false, error: 'Use format: owner/repo or paste GitHub URL' };
  }

  return { valid: true, repo: extracted };
}

export function sanitize(input: string) {
  return input.trim().slice(0, 100);
}
