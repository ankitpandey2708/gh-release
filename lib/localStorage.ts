const STORAGE_KEY = 'recent-searches';
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
