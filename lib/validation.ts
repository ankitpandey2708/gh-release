const PATTERN = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/;

export function validateRepo(input: string): { valid: boolean; error?: string } {
  if (!input.trim()) {
    return { valid: false, error: 'Enter a repository name' };
  }
  if (!PATTERN.test(input)) {
    return { valid: false, error: 'Use format: username/repo-name' };
  }
  return { valid: true };
}

export function sanitize(input: string) {
  return input.trim().slice(0, 100);
}
