# User Stories - GitHub Releases Dashboard

**Version:** 2.0
**Date:** November 7, 2025
**For:** AI coding agent

---

## How to Use This

Each story = 1 day of work.
Do them in order.
Check boxes as you go.
66 stories = complete app.

---

## Priority System

Stories ranked by value divided by effort:

- **P0:** Do first. App won't work without these.
- **P1:** Do next. Makes app good.
- **P2:** Do after. Makes app better.
- **P3:** Do last. Nice extras.

---

## Done Checklist

Mark a story done when ALL these pass:

- [ ] TypeScript compiles (no errors)
- [ ] ESLint passes
- [ ] Tests pass
- [ ] Works in browser
- [ ] Code committed

---

# Week 1: Setup (8 stories)

## Story 1: Create Next.js App

**Priority:** P0
**Time:** 1 day

### What to Do

Run this command:
```bash
npx create-next-app@14 gh-releases-dashboard --typescript --tailwind --app
```

### Check It Works

- [x] `npm run dev` starts
- [x] Open localhost:3000
- [x] See Next.js welcome page
- [x] Make first commit

---

## Story 2: Add Code Tools

**Priority:** P1
**Time:** 1 day

### What to Do

1. Install tools:
```bash
npm install -D eslint prettier
```

2. Create `.prettierrc`:
```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 80
}
```

3. Add to `package.json`:
```json
"scripts": {
  "lint": "eslint . --ext .ts,.tsx",
  "format": "prettier --write \"**/*.{ts,tsx}\""
}
```

### Check It Works

- [x] `npm run lint` works
- [x] `npm run format` works

---

## Story 3: Set Up Folders

**Priority:** P1
**Time:** 1 day

### What to Do

Create these folders:
```
app/
  api/
    releases/
      [owner]/
        [repo]/
components/
lib/
  hooks/
```

Create `lib/types.ts`:
```typescript
export interface GitHubRelease {
  tag_name: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
}

export interface Release {
  version: string;
  date: Date;
  prerelease: boolean;
}

export interface Stats {
  total: number;
  avgDays: number;
  perMonth: string;
  lastRelease: string;
}
```

### Check It Works

- [x] Folders exist
- [x] TypeScript compiles

---

## Story 4: Install Packages

**Priority:** P0
**Time:** 1 day

### What to Do

Install these:
```bash
npm install recharts date-fns @upstash/redis
```

### Check It Works

- [ ] `npm run dev` still works
- [ ] No errors in console

---

## Story 5: Add Environment Variables

**Priority:** P0
**Time:** 1 day

### What to Do

1. Create `.env.local`:
```
REDIS_URL=your_redis_url
REDIS_TOKEN=your_token
```

2. Create `.env.example`:
```
REDIS_URL=redis://...
REDIS_TOKEN=xxx
```

3. Create `lib/env.ts`:
```typescript
export const env = {
  redisUrl: process.env.REDIS_URL || '',
  redisToken: process.env.REDIS_TOKEN || '',
};
```

### Check It Works

- [ ] `.env.local` not in git
- [ ] Env vars load in code

---

## Story 6: Connect Redis

**Priority:** P1
**Time:** 1 day

### What to Do

1. Sign up at upstash.com
2. Create Redis database
3. Copy URL and token to `.env.local`
4. Create `lib/cache.ts`:

```typescript
import { Redis } from '@upstash/redis';
import { env } from './env';

export const redis = new Redis({
  url: env.redisUrl,
  token: env.redisToken,
});

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    return await redis.get(key);
  } catch (error) {
    console.error('Redis error:', error);
    return null;
  }
}

export async function setCached<T>(key: string, value: T, ttl = 86400) {
  try {
    await redis.set(key, JSON.stringify(value), { ex: ttl });
  } catch (error) {
    console.error('Redis error:', error);
  }
}
```

### Check It Works

- [ ] Redis connection works
- [ ] Can get/set values

---

## Story 7: Add Absolute Imports

**Priority:** P2
**Time:** 1 day

### What to Do

Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Check It Works

- [ ] Can import with `@/components/...`
- [ ] TypeScript autocomplete works

---

## Story 8: Add GitHub Actions

**Priority:** P1
**Time:** 1 day

### What to Do

Create `.github/workflows/ci.yml`:
```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

### Check It Works

- [ ] Push code
- [ ] GitHub Actions runs
- [ ] Build passes

---

# Week 3-4: Input & API (12 stories)

## Story 9: Create Input Field

**Priority:** P0
**Time:** 1 day

### What to Do

Create `components/RepoInput.tsx`:
```typescript
'use client';

import { useState } from 'react';

export function RepoInput({ onSubmit, loading = false }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="username/repo-name"
          className="flex-1 px-4 py-2 border rounded"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded"
        >
          {loading ? 'Loading...' : 'Analyze'}
        </button>
      </div>
    </form>
  );
}
```

Update `app/page.tsx`:
```typescript
'use client';

import { RepoInput } from '@/components/RepoInput';

export default function Home() {
  const handleSubmit = (repo: string) => {
    console.log('Repo:', repo);
  };

  return (
    <main className="min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">GitHub Releases Dashboard</h1>
      <RepoInput onSubmit={handleSubmit} />
    </main>
  );
}
```

### Check It Works

- [ ] Input shows on page
- [ ] Can type in it
- [ ] Button disables when empty
- [ ] Form submits

---

## Story 10: Validate Input

**Priority:** P0
**Time:** 1 day

### What to Do

Create `lib/validation.ts`:
```typescript
const PATTERN = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/;

export function validateRepo(input: string) {
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
```

Update `RepoInput.tsx`:
```typescript
import { validateRepo } from '@/lib/validation';

// Add error state
const [error, setError] = useState('');

// Add validation
const handleSubmit = (e) => {
  e.preventDefault();
  const result = validateRepo(value);
  if (!result.valid) {
    setError(result.error);
    return;
  }
  setError('');
  onSubmit(value.trim());
};

// Show error
{error && <p className="text-sm text-red-600">{error}</p>}
```

### Check It Works

- [ ] "invalid" shows error
- [ ] "facebook/react" works
- [ ] Error clears when fixed

---

## Story 11: Add Example Links

**Priority:** P1
**Time:** 1 day

### What to Do

Add to `RepoInput.tsx`:
```typescript
const EXAMPLES = [
  { repo: 'facebook/react', label: 'React' },
  { repo: 'vuejs/core', label: 'Vue' },
  { repo: 'angular/angular', label: 'Angular' },
];

// After form:
<div className="mt-4 text-center">
  <p className="text-sm text-gray-600 mb-2">Try:</p>
  {EXAMPLES.map(({ repo, label }) => (
    <button
      key={repo}
      onClick={() => setValue(repo)}
      className="text-sm text-blue-600 hover:underline mx-2"
    >
      {label}
    </button>
  ))}
</div>
```

### Check It Works

- [ ] Example links show
- [ ] Clicking fills input

---

## Story 12: Add Spinner

**Priority:** P1
**Time:** 1 day

### What to Do

Create `components/Spinner.tsx`:
```typescript
export function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
```

Use in button:
```typescript
{loading ? <Spinner /> : 'Analyze'}
```

### Check It Works

- [ ] Spinner shows when loading

---

## Story 13: Add Keyboard Shortcuts

**Priority:** P2
**Time:** 1 day

### What to Do

Add to input:
```typescript
const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    setValue('');
    setError('');
  }
};

<input onKeyDown={handleKeyDown} />
```

### Check It Works

- [ ] Enter submits
- [ ] Escape clears

---

## Story 14: Add Accessibility

**Priority:** P1
**Time:** 1 day

### What to Do

Update input:
```typescript
<input
  aria-label="GitHub repository name"
  aria-invalid={!!error}
  aria-describedby={error ? 'input-error' : undefined}
/>

{error && (
  <p id="input-error" role="alert" className="text-sm text-red-600">
    {error}
  </p>
)}
```

Add skip link to `app/layout.tsx`:
```typescript
<a href="#main" className="sr-only focus:not-sr-only">
  Skip to content
</a>
<main id="main">{children}</main>
```

### Check It Works

- [ ] Screen reader announces input
- [ ] Tab navigation works

---

## Story 15: Create GitHub Client

**Priority:** P0
**Time:** 1 day

### What to Do

Create `lib/github.ts`:
```typescript
import { GitHubRelease } from './types';

export class GitHubError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

export async function fetchReleases(owner: string, repo: string) {
  const url = `https://api.github.com/repos/${owner}/${repo}/releases`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Releases-Dashboard',
    },
  });

  if (response.status === 404) {
    throw new GitHubError('Repository not found', 404);
  }
  if (response.status === 403) {
    throw new GitHubError('Rate limit exceeded', 403);
  }
  if (!response.ok) {
    throw new GitHubError('Failed to fetch releases', response.status);
  }

  const data: GitHubRelease[] = await response.json();
  return data.filter(r => !r.draft).map(r => ({
    version: r.tag_name,
    date: new Date(r.published_at),
    prerelease: r.prerelease,
  }));
}
```

### Check It Works

- [ ] Can fetch facebook/react
- [ ] Errors throw correctly

---

## Story 16: Create API Route

**Priority:** P0
**Time:** 1 day

### What to Do

Create `app/api/releases/[owner]/[repo]/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { fetchReleases, GitHubError } from '@/lib/github';
import { getCached, setCached } from '@/lib/cache';
import { sanitize } from '@/lib/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: { owner: string; repo: string } }
) {
  const owner = sanitize(params.owner);
  const repo = sanitize(params.repo);
  const cacheKey = `releases:${owner}:${repo}`;

  // Try cache first
  const cached = await getCached(cacheKey);
  if (cached) {
    return NextResponse.json({ ...cached, cached: true });
  }

  try {
    const releases = await fetchReleases(owner, repo);
    const response = { owner, repo, releases };
    await setCached(cacheKey, response);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof GitHubError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
  }
}
```

### Check It Works

- [ ] Visit /api/releases/facebook/react
- [ ] Get JSON response
- [ ] Second request is cached

---

## Story 17: Create React Hook

**Priority:** P0
**Time:** 1 day

### What to Do

Create `lib/hooks/useReleases.ts`:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Release } from '../types';

export function useReleases(repo: string | null) {
  const [data, setData] = useState<Release[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!repo) return;

    setLoading(true);
    setError(null);

    fetch(`/api/releases/${repo}`)
      .then(res => res.json())
      .then(result => {
        if (result.error) {
          throw new Error(result.error);
        }
        setData(result.releases);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [repo]);

  return { data, loading, error };
}
```

Update `app/page.tsx`:
```typescript
import { useReleases } from '@/lib/hooks/useReleases';

export default function Home() {
  const [repo, setRepo] = useState<string | null>(null);
  const { data, loading, error } = useReleases(repo);

  return (
    <main>
      <RepoInput onSubmit={setRepo} loading={loading} />
      {error && <p className="text-red-600">{error}</p>}
      {data && <p>Found {data.length} releases</p>}
    </main>
  );
}
```

### Check It Works

- [ ] Submit repo name
- [ ] See release count

---

## Story 18: Add Error Component

**Priority:** P1
**Time:** 1 day

### What to Do

Create `components/ErrorMessage.tsx`:
```typescript
export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded">
      <h3 className="font-bold text-red-900 mb-2">Error</h3>
      <p className="text-sm text-red-700 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
```

Use it:
```typescript
{error && <ErrorMessage message={error} onRetry={() => setRepo(null)} />}
```

### Check It Works

- [ ] Error shows nicely
- [ ] Retry works

---

## Story 19: Add Loading Skeleton

**Priority:** P1
**Time:** 1 day

### What to Do

Create `components/LoadingSkeleton.tsx`:
```typescript
export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-gray-200 rounded" />
        ))}
      </div>
      <div className="h-96 bg-gray-200 rounded" />
    </div>
  );
}
```

Use it:
```typescript
{loading && <LoadingSkeleton />}
```

### Check It Works

- [ ] Shows while loading

---

## Story 20: Add Cache Indicator

**Priority:** P3
**Time:** 1 day

### What to Do

Update hook to track cached status:
```typescript
const [cached, setCached] = useState(false);

// In fetch:
setCached(result.cached || false);

return { data, loading, error, cached };
```

Show badge:
```typescript
{cached && (
  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
    Cached
  </span>
)}
```

### Check It Works

- [ ] First load: no badge
- [ ] Second load: shows badge

---

# Week 5-6: Chart & Stats (10 stories)

## Story 21: Set Up Recharts

**Priority:** P0
**Time:** 1 day

### What to Do

Already installed in Story 4.

Test it works:
```typescript
import { BarChart, Bar } from 'recharts';

<BarChart data={[{ name: 'A', value: 1 }]} width={400} height={300}>
  <Bar dataKey="value" />
</BarChart>
```

### Check It Works

- [ ] Chart renders

---

## Story 22: Transform Data

**Priority:** P0
**Time:** 1 day

### What to Do

Create `lib/stats.ts`:
```typescript
import { Release } from './types';
import { format } from 'date-fns';

export function groupByMonth(releases: Release[]) {
  const groups = new Map<string, number>();

  releases.forEach(release => {
    const month = format(release.date, 'MMM yyyy');
    groups.set(month, (groups.get(month) || 0) + 1);
  });

  return Array.from(groups.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
}
```

### Check It Works

- [ ] Groups releases correctly

---

## Story 23: Create Chart Component

**Priority:** P0
**Time:** 1 day

### What to Do

Create `components/ReleaseChart.tsx`:
```typescript
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Release } from '@/lib/types';
import { groupByMonth } from '@/lib/stats';

export function ReleaseChart({ releases }: { releases: Release[] }) {
  const data = groupByMonth(releases);

  if (data.length === 0) {
    return <p className="text-gray-500">No data</p>;
  }

  return (
    <div className="w-full bg-white p-6 rounded border">
      <h2 className="text-xl font-bold mb-4">Releases per Month</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

Use it:
```typescript
{data && <ReleaseChart releases={data} />}
```

### Check It Works

- [ ] Chart shows
- [ ] Bars display correctly

---

## Story 24: Make Chart Responsive

**Priority:** P1
**Time:** 1 day

### What to Do

Update chart:
```typescript
<div className="w-full bg-white p-4 md:p-6 rounded border">
  <h2 className="text-lg md:text-xl font-bold mb-4">Releases per Month</h2>
  <div className="h-64 md:h-96">
    <ResponsiveContainer width="100%" height="100%">
      {/* chart */}
    </ResponsiveContainer>
  </div>
</div>
```

### Check It Works

- [ ] Works on mobile (375px)
- [ ] Works on desktop (1920px)

---

## Story 25: Add Chart Animation

**Priority:** P2
**Time:** 1 day

### What to Do

Add fade-in:
```typescript
const [visible, setVisible] = useState(false);

useEffect(() => {
  setVisible(true);
}, []);

<div className={`transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
  {/* chart */}
</div>
```

### Check It Works

- [ ] Chart fades in

---

## Story 26: Add Empty State

**Priority:** P1
**Time:** 1 day

### What to Do

Update chart:
```typescript
if (releases.length === 0) {
  return (
    <div className="h-96 flex flex-col items-center justify-center bg-gray-50 rounded border-2 border-dashed">
      <svg className="w-16 h-16 text-gray-400 mb-4" /* icon */ />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">No Releases</h3>
      <p className="text-sm text-gray-500">This repo has no releases yet</p>
    </div>
  );
}
```

### Check It Works

- [ ] Empty state shows

---

## Story 27: Calculate Stats

**Priority:** P0
**Time:** 1 day

### What to Do

Add to `lib/stats.ts`:
```typescript
import { differenceInDays, formatDistanceToNow } from 'date-fns';

export function calculateStats(releases: Release[]) {
  if (releases.length === 0) {
    return { total: 0, avgDays: 0, perMonth: '0', lastRelease: 'N/A' };
  }

  const sorted = [...releases].sort((a, b) => a.date.getTime() - b.date.getTime());
  const total = sorted.length;
  const first = sorted[0].date;
  const last = sorted[total - 1].date;

  const totalDays = differenceInDays(last, first);
  const avgDays = total > 1 ? Math.round(totalDays / (total - 1)) : 0;
  const perMonth = totalDays > 30 ? (total / (totalDays / 30)).toFixed(1) : '0';

  return {
    total,
    avgDays,
    perMonth,
    lastRelease: formatDistanceToNow(last, { addSuffix: true }),
  };
}
```

### Check It Works

- [ ] Math is correct

---

## Story 28: Create Stats Cards

**Priority:** P0
**Time:** 1 day

### What to Do

Create `components/StatsGrid.tsx`:
```typescript
'use client';

import { Release } from '@/lib/types';
import { calculateStats } from '@/lib/stats';

export function StatsGrid({ releases }: { releases: Release[] }) {
  const stats = calculateStats(releases);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total" value={stats.total} />
      <StatCard label="Avg Days" value={stats.avgDays} />
      <StatCard label="Per Month" value={stats.perMonth} />
      <StatCard label="Last Release" value={stats.lastRelease} />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white p-6 rounded border">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
```

Use it:
```typescript
<StatsGrid releases={data} />
<ReleaseChart releases={data} />
```

### Check It Works

- [ ] Stats show correctly

---

## Story 29: Animate Stats

**Priority:** P2
**Time:** 1 day

### What to Do

Create `lib/hooks/useCountUp.ts`:
```typescript
'use client';

import { useState, useEffect } from 'react';

export function useCountUp(end: number, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
}
```

Use in StatCard:
```typescript
const animated = useCountUp(typeof value === 'number' ? value : 0);
<p className="text-3xl font-bold">{typeof value === 'number' ? animated : value}</p>
```

### Check It Works

- [ ] Numbers count up

---

## Story 30: Add Tooltips

**Priority:** P2
**Time:** 1 day

### What to Do

Update StatCard:
```typescript
function StatCard({ label, value, tooltip }) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {show && tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
          {tooltip}
        </div>
      )}
      {/* card content */}
    </div>
  );
}
```

### Check It Works

- [ ] Tooltips show on hover

---

# Week 7-8: Errors & Performance (13 stories)

## Story 31: Handle 404 Errors

**Priority:** P1
**Time:** 1 day

### What to Do

Update ErrorMessage with suggestions:
```typescript
export function ErrorMessage({ message, type }) {
  const tips = {
    '404': ['Check spelling', 'Verify repo exists', 'Try a different repo'],
    '403': ['Wait a few minutes', 'Rate limit will reset soon'],
    'network': ['Check internet', 'Try again'],
  }[type] || [];

  return (
    <div>
      <p>{message}</p>
      {tips.length > 0 && (
        <ul className="mt-2 text-sm">
          {tips.map(tip => <li key={tip}>• {tip}</li>)}
        </ul>
      )}
    </div>
  );
}
```

### Check It Works

- [ ] 404 shows tips

---

## Story 32: Handle Rate Limits

**Priority:** P1
**Time:** 1 day

### What to Do

Update API route to return reset time:
```typescript
if (response.status === 403) {
  const resetTime = response.headers.get('X-RateLimit-Reset');
  return NextResponse.json({
    error: 'Rate limit exceeded',
    resetTime,
  }, { status: 403 });
}
```

Show in UI:
```typescript
{error.includes('Rate limit') && (
  <p className="text-sm text-amber-800">
    Try again in a few minutes
  </p>
)}
```

### Check It Works

- [ ] Rate limit message shows

---

## Story 33: Handle Network Errors

**Priority:** P1
**Time:** 1 day

### What to Do

Update hook:
```typescript
.catch(err => {
  if (err.message.includes('fetch')) {
    setError('Network error. Check your connection.');
  } else {
    setError(err.message);
  }
})
```

### Check It Works

- [ ] Offline shows network error

---

## Story 34: Handle Empty Data

**Priority:** P1
**Time:** 1 day

### What to Do

Add check:
```typescript
{data && data.length === 0 && (
  <div className="p-8 bg-blue-50 rounded text-center">
    <h3 className="font-bold mb-2">No Releases Found</h3>
    <p className="text-sm">This repo has no releases yet</p>
  </div>
)}
```

### Check It Works

- [ ] Empty repos show message

---

## Story 35: Add Error Boundary

**Priority:** P1
**Time:** 1 day

### What to Do

Create `components/ErrorBoundary.tsx`:
```typescript
'use client';

import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-md p-6 bg-red-50 rounded">
            <h2 className="text-xl font-bold mb-2">Something Went Wrong</h2>
            <p className="text-sm mb-4">{this.state.error?.message}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 text-white rounded">
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

Wrap app in `layout.tsx`:
```typescript
<ErrorBoundary>{children}</ErrorBoundary>
```

### Check It Works

- [ ] Catches errors

---

## Story 36: Lazy Load Chart

**Priority:** P1
**Time:** 1 day

### What to Do

Update `page.tsx`:
```typescript
import dynamic from 'next/dynamic';

const ReleaseChart = dynamic(() => import('@/components/ReleaseChart').then(m => ({ default: m.ReleaseChart })), {
  loading: () => <LoadingSkeleton />,
  ssr: false,
});
```

### Check It Works

- [ ] Chart loads separately
- [ ] Check bundle size

---

## Story 37: Add Memoization

**Priority:** P1
**Time:** 1 day

### What to Do

Update chart and stats:
```typescript
import { useMemo } from 'react';

const data = useMemo(() => groupByMonth(releases), [releases]);
const stats = useMemo(() => calculateStats(releases), [releases]);
```

### Check It Works

- [ ] Performance improves

---

## Story 38: Optimize Images

**Priority:** P1
**Time:** 1 day

### What to Do

Using inline SVG already (optimal).

If adding images:
```typescript
import Image from 'next/image';

<Image src="/logo.png" alt="Logo" width={200} height={50} />
```

Update `next.config.ts`:
```typescript
const config = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};
```

### Check It Works

- [ ] Images optimized

---

## Story 39: Track Performance

**Priority:** P1
**Time:** 1 day

### What to Do

Add to `layout.tsx`:
```typescript
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals(metric => {
    console.log(metric);
  });
  return null;
}

// Add to layout:
<WebVitals />
```

### Check It Works

- [ ] Metrics logged

---

## Story 40: Run Lighthouse

**Priority:** P1
**Time:** 1 day

### What to Do

1. Build: `npm run build`
2. Start: `npm start`
3. Open DevTools
4. Run Lighthouse
5. Check scores:
   - Performance > 90
   - Accessibility > 90
   - Best Practices > 90
6. Fix issues

### Check It Works

- [ ] All scores > 90

---

## Story 41: Add ARIA Labels

**Priority:** P1
**Time:** 1 day

### What to Do

Update components:
```typescript
// ErrorMessage
<div role="alert" aria-live="assertive">

// StatsCard
<div role="region" aria-label={`${label} statistic`}>

// Chart
<div role="img" aria-label="Bar chart of releases">
```

### Check It Works

- [ ] Screen reader works

---

## Story 42: Test Keyboard Nav

**Priority:** P1
**Time:** 1 day

### What to Do

Test with keyboard only:
1. Tab through all elements
2. Enter submits form
3. Escape clears input
4. No keyboard traps

Add skip link if not done:
```typescript
<a href="#main" className="sr-only focus:not-sr-only">Skip to main</a>
<main id="main">
```

### Check It Works

- [ ] All keyboard shortcuts work

---

## Story 43: Manage Focus

**Priority:** P1
**Time:** 1 day

### What to Do

Update `page.tsx`:
```typescript
const resultsRef = useRef(null);

useEffect(() => {
  if (data && !loading) {
    resultsRef.current?.focus();
  }
}, [data, loading]);

<h2 ref={resultsRef} tabIndex={-1} className="outline-none">
  Results
</h2>
```

### Check It Works

- [ ] Focus moves to results

---

# Week 9-10: Security & Polish (15 stories)

## Story 44: Check Color Contrast

**Priority:** P1
**Time:** 1 day

### What to Do

1. Go to webaim.org/resources/contrastchecker
2. Test all color pairs:
   - Text on white
   - Blue buttons
   - Error messages
3. Must pass 4.5:1 ratio
4. Fix any failures

### Check It Works

- [ ] All text readable

---

## Story 45: Add Screen Reader Alerts

**Priority:** P1
**Time:** 1 day

### What to Do

Create `components/Announcer.tsx`:
```typescript
export function Announcer({ message }) {
  return (
    <div role="status" aria-live="polite" className="sr-only">
      {message}
    </div>
  );
}
```

Use it:
```typescript
const [announcement, setAnnouncement] = useState('');

useEffect(() => {
  if (loading) setAnnouncement('Loading...');
  else if (data) setAnnouncement(`Loaded ${data.length} releases`);
  else if (error) setAnnouncement('Error occurred');
}, [data, loading, error]);

<Announcer message={announcement} />
```

### Check It Works

- [ ] Screen reader announces

---

## Story 46: Test All Browsers

**Priority:** P1
**Time:** 2 days

### What to Do

Test on:
- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+
- Mobile Safari
- Chrome Mobile

Check:
- Input works
- API works
- Chart renders
- Stats show

### Check It Works

- [ ] Works everywhere

---

## Story 47: Add E2E Tests

**Priority:** P1
**Time:** 2 days

### What to Do

Install Playwright:
```bash
npm install -D @playwright/test
npx playwright install
```

Create `e2e/app.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test('loads homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('GitHub Releases');
});

test('validates input', async ({ page }) => {
  await page.goto('/');
  await page.fill('input', 'invalid');
  await page.click('button');
  await expect(page.locator('text=format')).toBeVisible();
});

test('fetches releases', async ({ page }) => {
  await page.goto('/');
  await page.fill('input', 'facebook/react');
  await page.click('button');
  await expect(page.locator('text=Total')).toBeVisible({ timeout: 10000 });
});
```

Add script:
```json
"test:e2e": "playwright test"
```

### Check It Works

- [ ] `npm run test:e2e` passes

---

## Story 48: Add Security Headers

**Priority:** P1
**Time:** 1 day

### What to Do

Create `middleware.ts`:
```typescript
import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}
```

### Check It Works

- [ ] Headers present in DevTools

---

## Story 49: Sanitize All Input

**Priority:** P0
**Time:** 1 day

### What to Do

Already done in Story 10 and 16.

Test with:
- `<script>alert('xss')</script>`
- `'; DROP TABLE;--`
- Very long strings

All should be blocked.

### Check It Works

- [ ] No XSS possible

---

## Story 50: Add Rate Limiting

**Priority:** P1
**Time:** 2 days

### What to Do

Install:
```bash
npm install @upstash/ratelimit
```

Create `lib/ratelimit.ts`:
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './cache';

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});
```

Update API route:
```typescript
const ip = request.ip ?? '127.0.0.1';
const { success } = await ratelimit.limit(ip);

if (!success) {
  return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
}
```

### Check It Works

- [ ] 11th request gets 429

---

## Story 51: Run Security Audit

**Priority:** P1
**Time:** 1 day

### What to Do

Add scripts:
```json
"audit": "npm audit",
"audit:fix": "npm audit fix"
```

Run:
```bash
npm run audit
```

Fix all high/critical issues.

Add to CI:
```yaml
- name: Security Audit
  run: npm audit --audit-level=moderate
```

### Check It Works

- [ ] No vulnerabilities

---

## Story 52: Validate Environment

**Priority:** P1
**Time:** 1 day

### What to Do

Update `lib/env.ts`:
```typescript
export function validateEnv() {
  const required = ['REDIS_URL', 'REDIS_TOKEN'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing: ${missing.join(', ')}`);
  }
}

if (typeof window === 'undefined') {
  validateEnv();
}
```

### Check It Works

- [ ] Errors if env vars missing

---

## Story 53: Add Header and Footer

**Priority:** P1
**Time:** 1 day

### What to Do

Update `page.tsx`:
```typescript
<main className="min-h-screen flex flex-col">
  <header className="border-b py-6 px-4">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">GitHub Releases Dashboard</h1>
      <p className="text-gray-600">Visualize release history for any repo</p>
    </div>
  </header>

  <div className="flex-1 max-w-6xl mx-auto p-8 w-full">
    {/* content */}
  </div>

  <footer className="border-t py-8 text-center text-sm text-gray-600">
    Built with Next.js • Data from GitHub API
  </footer>
</main>
```

### Check It Works

- [ ] Header and footer show

---

## Story 54: Add Dark Mode

**Priority:** P2
**Time:** 2 days

### What to Do

Install:
```bash
npm install next-themes
```

Create `components/ThemeProvider.tsx`:
```typescript
'use client';

import { ThemeProvider as NextThemes } from 'next-themes';

export function ThemeProvider({ children }) {
  return (
    <NextThemes attribute="class" defaultTheme="system">
      {children}
    </NextThemes>
  );
}
```

Create `components/ThemeToggle.tsx`:
```typescript
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
```

Update `layout.tsx`:
```typescript
import { ThemeProvider } from '@/components/ThemeProvider';

<html suppressHydrationWarning>
  <body>
    <ThemeProvider>{children}</ThemeProvider>
  </body>
</html>
```

Update `tailwind.config.ts`:
```typescript
module.exports = {
  darkMode: 'class',
};
```

Add dark mode classes to components:
```typescript
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
```

### Check It Works

- [ ] Dark mode toggles

---

## Story 55: Add Progress Bar

**Priority:** P2
**Time:** 1 day

### What to Do

Install:
```bash
npm install nprogress
```

Create `components/ProgressBar.tsx`:
```typescript
'use client';

import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export function ProgressBar({ loading }) {
  useEffect(() => {
    if (loading) NProgress.start();
    else NProgress.done();
  }, [loading]);

  return null;
}
```

Use it:
```typescript
<ProgressBar loading={loading} />
```

### Check It Works

- [ ] Bar shows at top when loading

---

## Story 56: Improve Mobile Layout

**Priority:** P1
**Time:** 1 day

### What to Do

Update all components with responsive classes:
```typescript
// Grid
className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"

// Padding
className="p-4 md:p-8"

// Text
className="text-lg md:text-xl"

// Height
className="h-64 md:h-96"
```

Test on:
- 375px (mobile)
- 768px (tablet)
- 1920px (desktop)

### Check It Works

- [ ] Looks good on all sizes

---

## Story 57: Add Animations

**Priority:** P2
**Time:** 1 day

### What to Do

Update `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    animation: {
      fadeIn: 'fadeIn 0.5s ease-in',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0', transform: 'translateY(10px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
    },
  },
}
```

Add to components:
```typescript
className="animate-fadeIn"
className="transition-all duration-200 hover:scale-105"
```

Add to `globals.css`:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Check It Works

- [ ] Smooth transitions

---

## Story 58: Add SEO Tags

**Priority:** P1
**Time:** 1 day

### What to Do

Update `layout.tsx`:
```typescript
export const metadata = {
  title: 'GitHub Releases Dashboard',
  description: 'Visualize release history and patterns for any GitHub repository',
  keywords: ['github', 'releases', 'dashboard', 'analytics'],
  openGraph: {
    title: 'GitHub Releases Dashboard',
    description: 'Visualize release history for any repo',
    type: 'website',
  },
};
```

Create `public/robots.txt`:
```
User-agent: *
Allow: /
```

### Check It Works

- [ ] Meta tags in HTML

---

# Post-MVP: Future Features (8 stories)

These are for later versions. Keep them simple for now.

## Story 59: Multiple Chart Types

**Priority:** P3
**Time:** 3 days

Add buttons to switch between bar, line, and timeline views.

---

## Story 60: Pre-release Filter

**Priority:** P3
**Time:** 2 days

Add checkbox to hide/show pre-releases.

---

## Story 61: Date Range Filter

**Priority:** P3
**Time:** 3 days

Add date picker to filter by range.

---

## Story 62: Hover Tooltips

**Priority:** P3
**Time:** 2 days

Show version details on chart hover.

---

## Story 63: Shareable URLs

**Priority:** P3
**Time:** 3 days

Add repo to URL: `?repo=facebook/react`

---

## Story 64: Export Features

**Priority:** P3
**Time:** 3 days

Add PNG download and CSV export.

---

## Story 65: Enhanced Stats

**Priority:** P3
**Time:** 3 days

Add more metrics like velocity and consistency.

---

## Story 66: Recent Searches

**Priority:** P3
**Time:** 3 days

Store last 5 searches in localStorage.

---

# Implementation Guide

## Order

Do stories 1-58 in order for MVP.
Do stories 59-66 after launch.

## Timeline

- Week 1: Stories 1-8 (Setup)
- Weeks 3-4: Stories 9-20 (Input & API)
- Weeks 5-6: Stories 21-30 (Chart & Stats)
- Weeks 7-8: Stories 31-43 (Errors & Performance)
- Weeks 9-10: Stories 44-58 (Security & Polish)
- Week 11: Launch
- Weeks 13-16: Stories 59-66 (Future features)

## Critical Path

Must do these first (P0):
- 1: Next.js setup
- 4: Install packages
- 5: Environment
- 9: Input field
- 10: Validation
- 15: GitHub client
- 16: API route
- 17: React hook
- 21: Recharts setup
- 22: Data transform
- 23: Chart component
- 27: Calculate stats
- 28: Stats cards
- 49: Sanitization

Do these next (P1):
- All other numbered stories

Do these after MVP (P2-P3):
- Stories 59-66

## Testing

After each story:
1. Run `npm run dev`
2. Test in browser
3. Run `npm run lint`
4. Run `npm run build`
5. Commit if all pass

Before launch:
1. Run `npm run test:e2e`
2. Run Lighthouse
3. Test on all browsers
4. Deploy to Vercel

## Success Metrics

MVP must have:
- Works on Chrome, Firefox, Safari, Edge
- Lighthouse score > 90
- Page loads < 2 seconds
- No security issues
- Passes accessibility tests

Post-MVP targets:
- 1,000 weekly users
- 25% return rate
- >4/5 satisfaction

---

# Summary

- **66 stories** = complete app
- **1 story** = 1 day
- **58 stories** = MVP (11 weeks)
- **8 stories** = future features (5 weeks)

Each story has:
- Clear goal
- Step-by-step instructions
- Working code examples
- Test checklist

Start with Story 1. Work in order. Check boxes. Ship MVP after Story 58.

**Total:** 16 weeks from start to v1.3.

---

**Version:** 2.0
**Created:** November 7, 2025
**Status:** Ready to build

---

**Good luck!** 🚀
