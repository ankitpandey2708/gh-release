const STORAGE_KEY = 'recent-searches';
const PAT_STORAGE_KEY = 'github-pat';
const MAX_RECENT = 5;

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveRecentSearch(repo: string) {
  if (typeof window === 'undefined') return;
  const recent = getRecentSearches();
  const filtered = recent.filter(r => r !== repo);
  const updated = [repo, ...filtered].slice(0, MAX_RECENT);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearRecentSearches() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// GitHub PAT storage functions
export function getSavedPAT(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PAT_STORAGE_KEY);
}

export function savePAT(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PAT_STORAGE_KEY, token);
}

export function clearPAT() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PAT_STORAGE_KEY);
}

export function hasSavedPAT(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(PAT_STORAGE_KEY);
}
