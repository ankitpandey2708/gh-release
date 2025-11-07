# GitHub Releases Dashboard - User Stories & Implementation Plan

**Version:** 1.0
**Date:** November 7, 2025
**Purpose:** Detailed one-story-point user stories for AI coding agent

---

## Document Structure

This document contains:
1. **Epics Overview** - High-level features
2. **User Stories** - INVEST-compliant stories
3. **Acceptance Criteria** - Testable outcomes
4. **Priority Scores (WSJF)** - Ranking methodology
5. **Dependencies** - Story sequencing
6. **Definition of Done** - Quality gates
7. **Sprint Mapping** - Timeline

---

## WSJF Prioritization Framework

**Formula:** WSJF = (Business Value + Time Criticality + Risk Reduction) / Job Size

**Scores:**
- Business Value: 1-10
- Time Criticality: 1-10
- Risk Reduction: 1-10
- Job Size: 1-5 (1 = smallest)

**Priority Bands:**
- **P0 (WSJF >20):** Critical path, must do first
- **P1 (WSJF 15-20):** High priority
- **P2 (WSJF 10-15):** Medium priority
- **P3 (WSJF <10):** Low priority

---

## Definition of Done

Every story must meet these criteria:

**Code:**
- [ ] TypeScript with no type errors
- [ ] ESLint passes (zero warnings)
- [ ] Prettier formatted
- [ ] No console.log statements
- [ ] Code reviewed (if human team)

**Testing:**
- [ ] Unit tests written and passing
- [ ] Component tests passing
- [ ] Manual testing completed
- [ ] No regression bugs

**Documentation:**
- [ ] Code comments for complex logic
- [ ] README updated if needed
- [ ] API docs updated if needed

**Performance:**
- [ ] No performance regressions
- [ ] Lighthouse score maintained

**Security:**
- [ ] Input validation complete
- [ ] No hardcoded secrets
- [ ] XSS protection verified

**Deployment:**
- [ ] Works in dev environment
- [ ] Works in preview deployment
- [ ] Ready for production

---

# Epic 1: Project Setup & Infrastructure

**Goal:** Set up development environment and tooling
**Timeline:** Week 1 (Sprint 0)
**Story Points:** 15 points total

---

## US-001: Initialize Next.js Project

**As a** developer
**I want** a new Next.js 14 project with TypeScript
**So that** I have a foundation to build on

**Story Points:** 1
**WSJF Score:** 25 (BV:10, TC:10, RR:10, Size:1.2) - **P0**

### Acceptance Criteria

```gherkin
Given I am in an empty directory
When I run the project setup
Then I should have a working Next.js 14 app
And TypeScript should be configured
And I can run npm run dev
And the app loads at localhost:3000
```

### Implementation Checklist

- [ ] Run `npx create-next-app@14 gh-releases-dashboard --typescript --tailwind --app --no-src --import-alias "@/*"`
- [ ] Verify Next.js version is 14.x in package.json
- [ ] Verify TypeScript is configured (tsconfig.json exists)
- [ ] Verify Tailwind CSS is configured (tailwind.config.ts exists)
- [ ] Verify App Router is being used (app/ directory exists)
- [ ] Test dev server: `npm run dev` should start successfully
- [ ] Open http://localhost:3000 and see default Next.js page
- [ ] Verify hot reload works by editing app/page.tsx
- [ ] Run `npm run build` to verify production build works
- [ ] Create .gitignore with: node_modules/, .next/, .env.local, .vercel
- [ ] Git init and make initial commit: "Initial Next.js 14 project"

### Dependencies
- None (first task)

### Files Created
- package.json
- tsconfig.json
- next.config.ts
- tailwind.config.ts
- app/layout.tsx
- app/page.tsx
- .gitignore

---

## US-002: Configure Development Tools

**As a** developer
**I want** ESLint and Prettier configured
**So that** code quality is enforced

**Story Points:** 1
**WSJF Score:** 18 (BV:6, TC:8, RR:10, Size:1.3) - **P1**

### Acceptance Criteria

```gherkin
Given the Next.js project exists
When I run ESLint
Then it should check all TypeScript files
And when I run Prettier
Then it should format all files consistently
```

### Implementation Checklist

- [ ] Install ESLint dependencies: `npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin`
- [ ] Create .eslintrc.json with Next.js + TypeScript rules:
  ```json
  {
    "extends": ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
    "rules": {
      "no-console": "warn",
      "@typescript-eslint/no-explicit-any": "error"
    }
  }
  ```
- [ ] Install Prettier: `npm install -D prettier eslint-config-prettier`
- [ ] Create .prettierrc with:
  ```json
  {
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": true,
    "printWidth": 80,
    "tabWidth": 2
  }
  ```
- [ ] Add scripts to package.json:
  ```json
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\""
  }
  ```
- [ ] Run `npm run lint` and fix any errors
- [ ] Run `npm run format` to format all files
- [ ] Create .prettierignore with: .next/, node_modules/, build/, dist/
- [ ] Commit: "Configure ESLint and Prettier"

### Dependencies
- US-001 (requires Next.js project)

### Files Created/Modified
- .eslintrc.json
- .prettierrc
- .prettierignore
- package.json (modified)

---

## US-003: Set Up Project Structure

**As a** developer
**I want** organized folder structure
**So that** code is maintainable

**Story Points:** 1
**WSJF Score:** 16 (BV:6, TC:6, RR:8, Size:1.25) - **P1**

### Acceptance Criteria

```gherkin
Given the Next.js project exists
When I create the folder structure
Then I should have organized directories for components, lib, types, and API routes
```

### Implementation Checklist

- [ ] Create directory structure:
  ```
  app/
  ├── api/
  │   └── releases/
  │       └── [owner]/
  │           └── [repo]/
  │               └── route.ts (placeholder)
  ├── layout.tsx (already exists)
  ├── page.tsx (already exists)
  └── globals.css (already exists)

  components/
  └── .gitkeep

  lib/
  ├── github.ts (placeholder)
  ├── cache.ts (placeholder)
  ├── stats.ts (placeholder)
  └── types.ts (placeholder)

  public/
  └── .gitkeep
  ```
- [ ] Create empty placeholder files with:
  ```typescript
  // Placeholder - will be implemented
  export {}
  ```
- [ ] Create lib/types.ts with basic types:
  ```typescript
  export interface GitHubRelease {
    tag_name: string;
    name: string;
    published_at: string;
    prerelease: boolean;
    draft: boolean;
  }

  export interface Release {
    version: string;
    date: Date;
    prerelease: boolean;
  }

  export interface ReleaseStats {
    total: number;
    avgDays: number;
    perMonth: string;
    lastRelease: string;
  }

  export interface MonthlyData {
    month: string;
    count: number;
  }
  ```
- [ ] Verify TypeScript compiles: `npm run build`
- [ ] Commit: "Set up project structure and TypeScript types"

### Dependencies
- US-001 (requires Next.js project)

### Files Created
- All directories and placeholder files listed above

---

## US-004: Install Core Dependencies

**As a** developer
**I want** all required packages installed
**So that** I can build features

**Story Points:** 1
**WSJF Score:** 22 (BV:8, TC:10, RR:8, Size:1.2) - **P0**

### Acceptance Criteria

```gherkin
Given the Next.js project exists
When I install dependencies
Then Recharts, date-fns, and other packages should be available
And npm run dev should work without errors
```

### Implementation Checklist

- [ ] Install chart library: `npm install recharts`
- [ ] Install date utilities: `npm install date-fns`
- [ ] Install Redis client: `npm install @upstash/redis`
- [ ] Install type definitions: `npm install -D @types/react @types/node`
- [ ] Verify package.json has correct versions:
  ```json
  "dependencies": {
    "next": "14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "recharts": "^2.10.0",
    "date-fns": "^3.0.0",
    "@upstash/redis": "^1.28.0"
  }
  ```
- [ ] Run `npm install` to ensure all dependencies install correctly
- [ ] Run `npm run dev` and verify no errors
- [ ] Check that TypeScript recognizes all imports
- [ ] Commit: "Install core dependencies"

### Dependencies
- US-001 (requires Next.js project)

### Files Modified
- package.json
- package-lock.json

---

## US-005: Configure Environment Variables

**As a** developer
**I want** environment variables configured
**So that** API keys and secrets are managed securely

**Story Points:** 1
**WSJF Score:** 20 (BV:10, TC:6, RR:10, Size:1.3) - **P0**

### Acceptance Criteria

```gherkin
Given the project exists
When I create .env.local
Then environment variables should be available in the app
And secrets should not be committed to git
```

### Implementation Checklist

- [ ] Create .env.local with:
  ```
  REDIS_URL=your_redis_url
  REDIS_TOKEN=your_redis_token
  GITHUB_TOKEN=ghp_your_token (optional)
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  ```
- [ ] Create .env.example with placeholder values:
  ```
  REDIS_URL=redis://...
  REDIS_TOKEN=xxx
  GITHUB_TOKEN=ghp_xxx
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  ```
- [ ] Verify .env.local is in .gitignore
- [ ] Create lib/env.ts for type-safe env vars:
  ```typescript
  export const env = {
    redisUrl: process.env.REDIS_URL || '',
    redisToken: process.env.REDIS_TOKEN || '',
    githubToken: process.env.GITHUB_TOKEN,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  };

  // Validate required env vars
  if (!env.redisUrl) {
    console.warn('REDIS_URL is not set');
  }
  ```
- [ ] Test that env vars are accessible: Create a test API route that logs env.redisUrl
- [ ] Verify sensitive vars are not exposed to client (only NEXT_PUBLIC_* vars)
- [ ] Document env vars in README.md
- [ ] Commit: "Configure environment variables" (.env.local should NOT be committed)

### Dependencies
- US-001 (requires Next.js project)

### Files Created
- .env.example
- lib/env.ts

### Files NOT Committed
- .env.local (gitignored)

---

## US-006: Set Up Redis Connection

**As a** developer
**I want** Redis client configured
**So that** I can cache API responses

**Story Points:** 1
**WSJF Score:** 19 (BV:8, TC:8, RR:7, Size:1.2) - **P1**

### Acceptance Criteria

```gherkin
Given Redis credentials are configured
When I connect to Redis
Then I should be able to get and set values
And connection should be reusable across API routes
```

### Implementation Checklist

- [ ] Sign up for Upstash Redis at https://upstash.com (free tier)
- [ ] Create a new Redis database
- [ ] Copy REDIS_URL and REDIS_TOKEN to .env.local
- [ ] Implement lib/cache.ts:
  ```typescript
  import { Redis } from '@upstash/redis';
  import { env } from './env';

  export const redis = new Redis({
    url: env.redisUrl,
    token: env.redisToken,
  });

  export async function getCached<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key);
      return cached as T | null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  export async function setCached<T>(
    key: string,
    value: T,
    ttl: number = 86400 // 24 hours default
  ): Promise<void> {
    try {
      await redis.set(key, JSON.stringify(value), { ex: ttl });
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  export async function deleteCached(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }
  ```
- [ ] Create test API route app/api/test-redis/route.ts:
  ```typescript
  import { NextResponse } from 'next/server';
  import { getCached, setCached } from '@/lib/cache';

  export async function GET() {
    const testKey = 'test-key';
    const testValue = { message: 'Hello Redis', timestamp: Date.now() };

    // Set value
    await setCached(testKey, testValue, 60);

    // Get value
    const retrieved = await getCached(testKey);

    return NextResponse.json({
      success: true,
      set: testValue,
      retrieved,
    });
  }
  ```
- [ ] Start dev server: `npm run dev`
- [ ] Test Redis: Visit http://localhost:3000/api/test-redis
- [ ] Verify response shows both set and retrieved values match
- [ ] Delete test route after verification
- [ ] Commit: "Set up Redis client and caching utilities"

### Dependencies
- US-004 (requires @upstash/redis installed)
- US-005 (requires env vars)

### Files Created
- lib/cache.ts

---

## US-007: Configure TypeScript Paths

**As a** developer
**I want** absolute imports with @ alias
**So that** imports are cleaner

**Story Points:** 1
**WSJF Score:** 12 (BV:4, TC:4, RR:4, Size:1) - **P2**

### Acceptance Criteria

```gherkin
Given TypeScript is configured
When I import from @/components or @/lib
Then imports should resolve correctly
```

### Implementation Checklist

- [ ] Update tsconfig.json compilerOptions:
  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["./*"],
        "@/components/*": ["components/*"],
        "@/lib/*": ["lib/*"],
        "@/app/*": ["app/*"]
      }
    }
  }
  ```
- [ ] Update next.config.ts if needed
- [ ] Test import: Create a component and import it using @/components/
- [ ] Verify TypeScript autocomplete works
- [ ] Verify build works: `npm run build`
- [ ] Commit: "Configure TypeScript paths for absolute imports"

### Dependencies
- US-001 (requires Next.js project)

### Files Modified
- tsconfig.json

---

## US-008: Set Up CI/CD Pipeline

**As a** developer
**I want** GitHub Actions configured
**So that** tests run automatically

**Story Points:** 1
**WSJF Score:** 15 (BV:6, TC:5, RR:8, Size:1.3) - **P1**

### Acceptance Criteria

```gherkin
Given code is pushed to GitHub
When a PR is created
Then CI should run linting and tests
And build should be verified
```

### Implementation Checklist

- [ ] Create .github/workflows/ci.yml:
  ```yaml
  name: CI

  on:
    push:
      branches: [main, develop]
    pull_request:
      branches: [main, develop]

  jobs:
    test:
      runs-on: ubuntu-latest

      steps:
        - uses: actions/checkout@v4

        - name: Setup Node
          uses: actions/setup-node@v4
          with:
            node-version: '18'
            cache: 'npm'

        - name: Install dependencies
          run: npm ci

        - name: Run ESLint
          run: npm run lint

        - name: Run TypeScript check
          run: npx tsc --noEmit

        - name: Run tests
          run: npm test
          if: ${{ hashFiles('**/*.test.ts', '**/*.test.tsx') != '' }}

        - name: Build
          run: npm run build
  ```
- [ ] Create GitHub repo if not exists
- [ ] Push code: `git push origin main`
- [ ] Verify workflow runs in GitHub Actions tab
- [ ] Fix any errors that appear
- [ ] Commit: "Set up GitHub Actions CI pipeline"

### Dependencies
- US-002 (requires ESLint configured)

### Files Created
- .github/workflows/ci.yml

---

# Epic 2: Input Component & Form Validation

**Goal:** Build repository input field with validation
**Timeline:** Week 3-4 (Sprint 1, Part 1)
**Story Points:** 12 points total

---

## US-009: Create Basic Input Component

**As a** user
**I want** a text input to enter repository names
**So that** I can specify which repo to analyze

**Story Points:** 1
**WSJF Score:** 23 (BV:9, TC:9, RR:8, Size:1.1) - **P0**

### Acceptance Criteria

```gherkin
Given I am on the homepage
When the page loads
Then I should see an input field with placeholder "username/repo-name"
And I should see an "Analyze" button
```

### Implementation Checklist

- [ ] Create components/RepoInput.tsx:
  ```typescript
  'use client';

  import { useState, FormEvent } from 'react';

  interface RepoInputProps {
    onSubmit: (repo: string) => void;
    loading?: boolean;
  }

  export function RepoInput({ onSubmit, loading = false }: RepoInputProps) {
    const [value, setValue] = useState('');

    const handleSubmit = (e: FormEvent) => {
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
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Analyze'}
          </button>
        </div>
      </form>
    );
  }
  ```
- [ ] Update app/page.tsx to use component:
  ```typescript
  'use client';

  import { RepoInput } from '@/components/RepoInput';

  export default function Home() {
    const handleSubmit = (repo: string) => {
      console.log('Repo submitted:', repo);
    };

    return (
      <main className="min-h-screen p-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8">GitHub Releases Dashboard</h1>
        <RepoInput onSubmit={handleSubmit} />
      </main>
    );
  }
  ```
- [ ] Test in browser:
  - [ ] Input field visible
  - [ ] Placeholder text shows
  - [ ] Button is disabled when input empty
  - [ ] Can type in input
  - [ ] Button enables when typing
- [ ] Verify button disabled when empty
- [ ] Test form submission logs to console
- [ ] Commit: "Create basic repository input component"

### Dependencies
- US-003 (requires components/ directory)

### Files Created
- components/RepoInput.tsx
- app/page.tsx (modified)

---

## US-010: Add Input Validation Logic

**As a** user
**I want** the input to validate repo name format
**So that** I get immediate feedback on invalid inputs

**Story Points:** 1
**WSJF Score:** 21 (BV:8, TC:8, RR:7, Size:1.1) - **P0**

### Acceptance Criteria

```gherkin
Given I am typing in the input field
When I enter an invalid format (e.g., "invalid")
Then I should see an error message
And when I enter a valid format (e.g., "facebook/react")
Then the error should clear
```

### Implementation Checklist

- [ ] Create lib/validation.ts:
  ```typescript
  export const REPO_PATTERN = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/;

  export function validateRepoName(input: string): {
    valid: boolean;
    error?: string;
  } {
    if (!input.trim()) {
      return { valid: false, error: 'Repository name is required' };
    }

    if (!REPO_PATTERN.test(input)) {
      return {
        valid: false,
        error: 'Invalid format. Use: username/repo-name',
      };
    }

    return { valid: true };
  }

  export function parseRepoName(input: string): {
    owner: string;
    repo: string;
  } | null {
    const match = input.match(/^([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)$/);
    if (!match) return null;

    return {
      owner: match[1],
      repo: match[2],
    };
  }
  ```
- [ ] Update components/RepoInput.tsx to use validation:
  ```typescript
  'use client';

  import { useState, FormEvent } from 'react';
  import { validateRepoName } from '@/lib/validation';

  interface RepoInputProps {
    onSubmit: (repo: string) => void;
    loading?: boolean;
  }

  export function RepoInput({ onSubmit, loading = false }: RepoInputProps) {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const [touched, setTouched] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      if (touched && newValue.trim()) {
        const validation = validateRepoName(newValue);
        setError(validation.valid ? '' : validation.error || '');
      }
    };

    const handleBlur = () => {
      setTouched(true);
      if (value.trim()) {
        const validation = validateRepoName(value);
        setError(validation.valid ? '' : validation.error || '');
      }
    };

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      setTouched(true);

      const validation = validateRepoName(value);
      if (!validation.valid) {
        setError(validation.error || '');
        return;
      }

      setError('');
      onSubmit(value.trim());
    };

    return (
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="username/repo-name"
              className={`flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                error
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              disabled={loading}
              aria-label="GitHub repository name"
              aria-invalid={!!error}
              aria-describedby={error ? 'input-error' : undefined}
            />
            <button
              type="submit"
              disabled={loading || !value.trim() || !!error}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Loading...' : 'Analyze'}
            </button>
          </div>
          {error && (
            <p id="input-error" className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>
      </form>
    );
  }
  ```
- [ ] Test validation:
  - [ ] Type "invalid" and blur → see error
  - [ ] Type "facebook/react" → error clears
  - [ ] Submit with invalid input → button disabled
  - [ ] Submit with valid input → form submits
- [ ] Verify error styling (red border)
- [ ] Verify ARIA attributes present
- [ ] Commit: "Add input validation with error messaging"

### Dependencies
- US-009 (requires RepoInput component)

### Files Created
- lib/validation.ts

### Files Modified
- components/RepoInput.tsx

---

## US-011: Add Example Repository Links

**As a** user
**I want** clickable example repositories
**So that** I can quickly try the tool

**Story Points:** 1
**WSJF Score:** 14 (BV:6, TC:5, RR:4, Size:1.1) - **P1**

### Acceptance Criteria

```gherkin
Given I see the input form
When I look below the input
Then I should see 3 example repository links
And when I click an example
Then the input should be filled with that repo name
```

### Implementation Checklist

- [ ] Update components/RepoInput.tsx to include examples:
  ```typescript
  // Add to RepoInput component
  const EXAMPLES = [
    { owner: 'facebook', repo: 'react', label: 'React' },
    { owner: 'vuejs', repo: 'core', label: 'Vue.js' },
    { owner: 'angular', repo: 'angular', label: 'Angular' },
  ];

  const handleExampleClick = (owner: string, repo: string) => {
    const repoName = `${owner}/${repo}`;
    setValue(repoName);
    setError('');
    setTouched(false);
  };

  // Add to JSX after form
  <div className="mt-4 text-center">
    <p className="text-sm text-gray-600 mb-2">Try an example:</p>
    <div className="flex gap-3 justify-center flex-wrap">
      {EXAMPLES.map(({ owner, repo, label }) => (
        <button
          key={`${owner}/${repo}`}
          type="button"
          onClick={() => handleExampleClick(owner, repo)}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          disabled={loading}
        >
          {label}
        </button>
      ))}
    </div>
  </div>
  ```
- [ ] Test clicking each example:
  - [ ] React → fills "facebook/react"
  - [ ] Vue.js → fills "vuejs/core"
  - [ ] Angular → fills "angular/angular"
- [ ] Verify examples disabled when loading
- [ ] Verify input updates when example clicked
- [ ] Test that clicking example clears any errors
- [ ] Commit: "Add example repository links"

### Dependencies
- US-010 (requires validation logic)

### Files Modified
- components/RepoInput.tsx

---

## US-012: Add Loading State to Input

**As a** user
**I want** visual feedback when data is loading
**So that** I know the system is processing

**Story Points:** 1
**WSJF Score:** 17 (BV:6, TC:7, RR:5, Size:1.1) - **P1**

### Acceptance Criteria

```gherkin
Given I submitted a repository
When data is being fetched
Then the input and button should be disabled
And the button should show "Loading..."
```

### Implementation Checklist

- [ ] The loading state is already handled in RepoInput via the `loading` prop
- [ ] Add a spinner component for better UX
- [ ] Create components/Spinner.tsx:
  ```typescript
  export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    };

    return (
      <svg
        className={`animate-spin ${sizeClasses[size]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );
  }
  ```
- [ ] Update button to show spinner when loading:
  ```typescript
  <button
    type="submit"
    disabled={loading || !value.trim() || !!error}
    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
  >
    {loading && <Spinner size="sm" />}
    {loading ? 'Loading...' : 'Analyze'}
  </button>
  ```
- [ ] Test loading state:
  - [ ] Set loading={true} in parent
  - [ ] Verify spinner shows
  - [ ] Verify button disabled
  - [ ] Verify input disabled
- [ ] Commit: "Add loading spinner to input button"

### Dependencies
- US-009 (requires RepoInput component)

### Files Created
- components/Spinner.tsx

### Files Modified
- components/RepoInput.tsx

---

## US-013: Add Keyboard Shortcuts

**As a** user
**I want** keyboard shortcuts to work
**So that** I can navigate efficiently

**Story Points:** 1
**WSJF Score:** 13 (BV:5, TC:4, RR:5, Size:1.1) - **P2**

### Acceptance Criteria

```gherkin
Given I am on the homepage
When I press Enter in the input field
Then the form should submit
And when I press Escape
Then the input should clear
```

### Implementation Checklist

- [ ] Update components/RepoInput.tsx to handle Escape key:
  ```typescript
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setValue('');
      setError('');
      setTouched(false);
      e.currentTarget.blur();
    }
  };

  // Add to input element
  <input
    // ... existing props
    onKeyDown={handleKeyDown}
  />
  ```
- [ ] Test Enter key submits form (already works via form onSubmit)
- [ ] Test Escape key clears input
- [ ] Test Tab navigation works correctly
- [ ] Verify focus outline visible (should have blue ring from Tailwind)
- [ ] Commit: "Add Escape key to clear input"

### Dependencies
- US-010 (requires RepoInput with validation)

### Files Modified
- components/RepoInput.tsx

---

## US-014: Add Input Accessibility

**As a** screen reader user
**I want** proper ARIA labels and roles
**So that** I can use the input field

**Story Points:** 1
**WSJF Score:** 16 (BV:7, TC:5, RR:7, Size:1.2) - **P1**

### Acceptance Criteria

```gherkin
Given I am using a screen reader
When I focus the input field
Then I should hear "GitHub repository name"
And when there's an error
Then I should hear the error message
```

### Implementation Checklist

- [ ] ARIA attributes already added in US-010
- [ ] Add screen reader only instructions
- [ ] Update components/RepoInput.tsx:
  ```typescript
  // Add above the form
  <div className="sr-only" id="input-help">
    Enter a GitHub repository in the format username/repo-name. For example: facebook/react
  </div>

  // Input already has:
  // aria-label="GitHub repository name"
  // aria-invalid={!!error}
  // aria-describedby={error ? 'input-error' : 'input-help'}

  // Error already has:
  // role="alert"
  ```
- [ ] Add Tailwind sr-only utility if not exists in globals.css:
  ```css
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  ```
- [ ] Test with screen reader (NVDA or VoiceOver):
  - [ ] Tab to input
  - [ ] Hear "GitHub repository name"
  - [ ] Hear instructions
  - [ ] Trigger error
  - [ ] Hear error message
- [ ] Verify focus indicator visible (blue ring)
- [ ] Test keyboard navigation through all elements
- [ ] Commit: "Add accessibility improvements to input"

### Dependencies
- US-010 (requires input with ARIA)

### Files Modified
- components/RepoInput.tsx
- app/globals.css (if sr-only class needed)

---

# Epic 3: GitHub API Integration

**Goal:** Fetch and parse GitHub releases data
**Timeline:** Week 3-4 (Sprint 1, Part 2)
**Story Points:** 15 points total

---

## US-015: Create GitHub API Client

**As a** developer
**I want** a reusable GitHub API client
**So that** I can fetch release data

**Story Points:** 1
**WSJF Score:** 24 (BV:10, TC:9, RR:8, Size:1.1) - **P0**

### Acceptance Criteria

```gherkin
Given I have a GitHub repo name
When I call the API client
Then it should fetch releases from GitHub
And return parsed release data
```

### Implementation Checklist

- [ ] Implement lib/github.ts:
  ```typescript
  import { GitHubRelease, Release } from './types';

  const GITHUB_API_BASE = 'https://api.github.com';

  export class GitHubError extends Error {
    constructor(
      message: string,
      public statusCode: number,
      public resetTime?: number
    ) {
      super(message);
      this.name = 'GitHubError';
    }
  }

  export async function fetchGitHubReleases(
    owner: string,
    repo: string,
    token?: string
  ): Promise<GitHubRelease[]> {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/releases`;

    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Releases-Dashboard',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        headers,
        // Add cache revalidation
        next: { revalidate: 3600 }, // 1 hour for Next.js cache
      });

      // Handle rate limiting
      if (response.status === 403) {
        const resetTime = response.headers.get('X-RateLimit-Reset');
        throw new GitHubError(
          'Rate limit exceeded',
          403,
          resetTime ? parseInt(resetTime) : undefined
        );
      }

      // Handle not found
      if (response.status === 404) {
        throw new GitHubError('Repository not found', 404);
      }

      // Handle other errors
      if (!response.ok) {
        throw new GitHubError(
          `GitHub API error: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      return data as GitHubRelease[];
    } catch (error) {
      if (error instanceof GitHubError) {
        throw error;
      }

      // Network or other errors
      throw new GitHubError(
        error instanceof Error ? error.message : 'Failed to fetch releases',
        500
      );
    }
  }

  export function parseReleases(data: GitHubRelease[]): Release[] {
    return data
      .filter((release) => !release.draft) // Exclude drafts
      .map((release) => ({
        version: release.tag_name,
        date: new Date(release.published_at),
        prerelease: release.prerelease,
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime()); // Newest first
  }
  ```
- [ ] Add types to lib/types.ts if not exists:
  ```typescript
  export interface GitHubRelease {
    tag_name: string;
    name: string;
    published_at: string;
    prerelease: boolean;
    draft: boolean;
  }

  export interface Release {
    version: string;
    date: Date;
    prerelease: boolean;
  }
  ```
- [ ] Test GitHub client:
  - [ ] Create test API route to call fetchGitHubReleases
  - [ ] Test with "facebook/react"
  - [ ] Verify returns array of releases
  - [ ] Test with invalid repo
  - [ ] Verify throws GitHubError
- [ ] Commit: "Create GitHub API client"

### Dependencies
- US-003 (requires lib/ directory)
- US-004 (requires fetch API)

### Files Created/Modified
- lib/github.ts
- lib/types.ts (modified)

---

## US-016: Create API Route for Releases

**As a** developer
**I want** an API endpoint to fetch releases
**So that** the frontend can request data

**Story Points:** 1
**WSJF Score:** 23 (BV:9, TC:9, RR:7, Size:1.1) - **P0**

### Acceptance Criteria

```gherkin
Given I make a GET request to /api/releases/[owner]/[repo]
When the repo exists
Then I should get release data as JSON
And when the repo doesn't exist
Then I should get a 404 error
```

### Implementation Checklist

- [ ] Implement app/api/releases/[owner]/[repo]/route.ts:
  ```typescript
  import { NextRequest, NextResponse } from 'next/server';
  import { fetchGitHubReleases, parseReleases, GitHubError } from '@/lib/github';
  import { getCached, setCached } from '@/lib/cache';
  import { env } from '@/lib/env';

  export const runtime = 'edge'; // Use Edge Runtime for better performance

  interface Params {
    owner: string;
    repo: string;
  }

  export async function GET(
    request: NextRequest,
    { params }: { params: Params }
  ) {
    const { owner, repo } = params;

    // Validate params
    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Invalid repository format' },
        { status: 400 }
      );
    }

    const cacheKey = `releases:${owner}:${repo}`;

    try {
      // Try cache first
      const cached = await getCached<any>(cacheKey);
      if (cached) {
        return NextResponse.json({
          ...cached,
          cached: true,
        });
      }

      // Fetch from GitHub
      const githubReleases = await fetchGitHubReleases(
        owner,
        repo,
        env.githubToken
      );

      // Parse releases
      const releases = parseReleases(githubReleases);

      // Prepare response
      const response = {
        owner,
        repo,
        releases,
        count: releases.length,
        fetchedAt: new Date().toISOString(),
      };

      // Cache for 24 hours
      await setCached(cacheKey, response, 86400);

      return NextResponse.json(response);
    } catch (error) {
      if (error instanceof GitHubError) {
        const status = error.statusCode;
        const message = error.message;

        // Include rate limit reset time if available
        const body: any = { error: message };
        if (error.resetTime) {
          body.resetTime = error.resetTime;
          body.resetDate = new Date(error.resetTime * 1000).toISOString();
        }

        return NextResponse.json(body, { status });
      }

      // Unknown error
      console.error('API Error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
  ```
- [ ] Test API route:
  - [ ] Start dev server: `npm run dev`
  - [ ] Visit: http://localhost:3000/api/releases/facebook/react
  - [ ] Verify JSON response with releases array
  - [ ] Visit: http://localhost:3000/api/releases/invalid/repo
  - [ ] Verify 404 error
  - [ ] Visit same valid URL twice
  - [ ] Verify second request has cached: true
- [ ] Test rate limit handling (if possible)
- [ ] Verify proper error messages
- [ ] Commit: "Create API route for fetching releases"

### Dependencies
- US-015 (requires GitHub client)
- US-006 (requires cache functions)

### Files Created
- app/api/releases/[owner]/[repo]/route.ts

---

## US-017: Create React Hook for Fetching Data

**As a** developer
**I want** a React hook to fetch releases
**So that** components can easily get data

**Story Points:** 1
**WSJF Score:** 20 (BV:8, TC:7, RR:6, Size:1.05) - **P0**

### Acceptance Criteria

```gherkin
Given I use the useReleases hook
When I provide a repo name
Then it should fetch data from the API
And return loading, data, and error states
```

### Implementation Checklist

- [ ] Create lib/hooks/useReleases.ts:
  ```typescript
  'use client';

  import { useState, useEffect } from 'react';
  import { Release } from '../types';

  interface UseReleasesResult {
    data: Release[] | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
  }

  interface ApiResponse {
    owner: string;
    repo: string;
    releases: Release[];
    count: number;
    cached?: boolean;
    fetchedAt: string;
  }

  interface ApiError {
    error: string;
    resetTime?: number;
    resetDate?: string;
  }

  export function useReleases(repoName: string | null): UseReleasesResult {
    const [data, setData] = useState<Release[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const refetch = () => {
      setRefetchTrigger((prev) => prev + 1);
    };

    useEffect(() => {
      if (!repoName) {
        setData(null);
        setError(null);
        return;
      }

      const abortController = new AbortController();

      async function fetchData() {
        setLoading(true);
        setError(null);

        try {
          const response = await fetch(`/api/releases/${repoName}`, {
            signal: abortController.signal,
          });

          if (!response.ok) {
            const errorData: ApiError = await response.json();

            if (errorData.resetDate) {
              throw new Error(
                `${errorData.error}. Resets at ${new Date(
                  errorData.resetDate
                ).toLocaleTimeString()}`
              );
            }

            throw new Error(errorData.error || 'Failed to fetch releases');
          }

          const result: ApiResponse = await response.json();

          // Convert date strings back to Date objects
          const releases = result.releases.map((r: any) => ({
            ...r,
            date: new Date(r.date),
          }));

          setData(releases);
        } catch (err) {
          if (err instanceof Error && err.name === 'AbortError') {
            return; // Ignore abort errors
          }

          setError(
            err instanceof Error ? err.message : 'An error occurred'
          );
          setData(null);
        } finally {
          setLoading(false);
        }
      }

      fetchData();

      return () => {
        abortController.abort();
      };
    }, [repoName, refetchTrigger]);

    return { data, loading, error, refetch };
  }
  ```
- [ ] Update lib/types.ts to ensure Release type is complete
- [ ] Test hook in app/page.tsx:
  ```typescript
  'use client';

  import { useState } from 'react';
  import { RepoInput } from '@/components/RepoInput';
  import { useReleases } from '@/lib/hooks/useReleases';

  export default function Home() {
    const [repo, setRepo] = useState<string | null>(null);
    const { data, loading, error } = useReleases(repo);

    const handleSubmit = (repoName: string) => {
      setRepo(repoName);
    };

    return (
      <main className="min-h-screen p-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8">GitHub Releases Dashboard</h1>
        <RepoInput onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}

        {data && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">
              Found {data.length} releases
            </h2>
            <pre className="text-sm bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
              {JSON.stringify(data.slice(0, 5), null, 2)}
            </pre>
          </div>
        )}
      </main>
    );
  }
  ```
- [ ] Test in browser:
  - [ ] Submit "facebook/react"
  - [ ] See loading state
  - [ ] See data displayed
  - [ ] Submit invalid repo
  - [ ] See error message
- [ ] Commit: "Create useReleases hook for data fetching"

### Dependencies
- US-016 (requires API route)

### Files Created
- lib/hooks/useReleases.ts

### Files Modified
- app/page.tsx

---

## US-018: Add Error Component

**As a** user
**I want** clear error messages
**So that** I understand what went wrong

**Story Points:** 1
**WSJF Score:** 18 (BV:7, TC:6, RR:6, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given an error occurred
When I see the error component
Then it should show a clear message
And provide a retry button
```

### Implementation Checklist

- [ ] Create components/ErrorMessage.tsx:
  ```typescript
  interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
  }

  export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
    return (
      <div className="w-full max-w-2xl p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 mb-1">Error</h3>
            <p className="text-sm text-red-700">{message}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  ```
- [ ] Update app/page.tsx to use ErrorMessage:
  ```typescript
  import { ErrorMessage } from '@/components/ErrorMessage';

  // Replace error div with:
  {error && (
    <ErrorMessage
      message={error}
      onRetry={() => {
        setRepo(null);
        setTimeout(() => setRepo(repo), 0);
      }}
    />
  )}
  ```
- [ ] Test error display:
  - [ ] Trigger error with invalid repo
  - [ ] Verify error component shows
  - [ ] Click "Try Again" button
  - [ ] Verify refetch happens
- [ ] Test different error messages
- [ ] Commit: "Create error message component"

### Dependencies
- US-017 (requires hook with error state)

### Files Created
- components/ErrorMessage.tsx

### Files Modified
- app/page.tsx

---

## US-019: Add Loading Skeleton

**As a** user
**I want** a loading skeleton
**So that** I see the app is working

**Story Points:** 1
**WSJF Score:** 14 (BV:5, TC:5, RR:5, Size:1.07) - **P1**

### Acceptance Criteria

```gherkin
Given data is loading
When I wait for the response
Then I should see skeleton placeholders
Where the chart and stats will appear
```

### Implementation Checklist

- [ ] Create components/LoadingSkeleton.tsx:
  ```typescript
  export function LoadingSkeleton() {
    return (
      <div className="w-full max-w-6xl animate-pulse">
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 rounded-lg"
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Chart skeleton */}
        <div className="h-96 bg-gray-200 rounded-lg" aria-hidden="true">
          <div className="flex items-end justify-around h-full p-8">
            {[60, 80, 70, 90, 75, 85, 65, 95].map((height, i) => (
              <div
                key={i}
                className="bg-gray-300 rounded-t"
                style={{ height: `${height}%`, width: '8%' }}
              />
            ))}
          </div>
        </div>

        <span className="sr-only">Loading release data...</span>
      </div>
    );
  }
  ```
- [ ] Update app/page.tsx:
  ```typescript
  import { LoadingSkeleton } from '@/components/LoadingSkeleton';

  // Add after RepoInput
  {loading && <LoadingSkeleton />}
  ```
- [ ] Test loading state:
  - [ ] Submit a repository
  - [ ] Verify skeleton shows
  - [ ] Verify skeleton disappears when data loads
- [ ] Test animation (should pulse)
- [ ] Commit: "Add loading skeleton component"

### Dependencies
- US-017 (requires loading state)

### Files Created
- components/LoadingSkeleton.tsx

### Files Modified
- app/page.tsx

---

## US-020: Add Cache Indicator

**As a** user
**I want** to know if data is cached
**So that** I understand data freshness

**Story Points:** 1
**WSJF Score:** 10 (BV:3, TC:3, RR:4, Size:1) - **P3**

### Acceptance Criteria

```gherkin
Given I loaded a repository
When the data is from cache
Then I should see a "Cached" indicator
```

### Implementation Checklist

- [ ] Update lib/hooks/useReleases.ts to return cached status:
  ```typescript
  interface UseReleasesResult {
    data: Release[] | null;
    loading: boolean;
    error: string | null;
    cached: boolean;  // Add this
    refetch: () => void;
  }

  // Inside hook
  const [cached, setCached] = useState(false);

  // In fetchData
  const result: ApiResponse = await response.json();
  setCached(result.cached || false);

  // Return
  return { data, loading, error, cached, refetch };
  ```
- [ ] Create components/CacheIndicator.tsx:
  ```typescript
  export function CacheIndicator() {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v.092a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 9.766 14 8.991 14 8c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 5.092V5z"
            clipRule="evenodd"
          />
        </svg>
        Cached data
      </div>
    );
  }
  ```
- [ ] Update app/page.tsx:
  ```typescript
  const { data, loading, error, cached } = useReleases(repo);

  // Add below data display
  {cached && <CacheIndicator />}
  ```
- [ ] Test cache indicator:
  - [ ] First request → no indicator
  - [ ] Second request (same repo) → indicator shows
- [ ] Commit: "Add cache indicator for data freshness"

### Dependencies
- US-017 (requires useReleases hook)

### Files Created
- components/CacheIndicator.tsx

### Files Modified
- lib/hooks/useReleases.ts
- app/page.tsx

---

# Epic 4: Chart Visualization

**Goal:** Implement interactive bar chart for releases
**Timeline:** Week 5-6 (Sprint 2, Part 1)
**Story Points:** 14 points total

---

## US-021: Install and Configure Recharts

**As a** developer
**I want** Recharts library configured
**So that** I can build charts

**Story Points:** 1
**WSJF Score:** 20 (BV:8, TC:8, RR:6, Size:1.1) - **P0**

### Acceptance Criteria

```gherkin
Given Recharts is installed
When I import chart components
Then they should work without errors
```

### Implementation Checklist

- [ ] Recharts already installed in US-004
- [ ] Create test component to verify Recharts works
- [ ] Create components/Chart.tsx wrapper:
  ```typescript
  'use client';

  import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

  interface ChartProps {
    data: any[];
  }

  export function Chart({ data }: ChartProps) {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  ```
- [ ] Test basic chart renders
- [ ] Verify responsive container works
- [ ] Commit: "Set up Recharts chart wrapper"

### Dependencies
- US-004 (requires Recharts installed)

### Files Created
- components/Chart.tsx

---

## US-022: Create Data Transformation Function

**As a** developer
**I want** to transform releases into monthly data
**So that** the chart can display it

**Story Points:** 1
**WSJF Score:** 22 (BV:9, TC:8, RR:7, Size:1.1) - **P0**

### Acceptance Criteria

```gherkin
Given an array of releases
When I transform the data
Then I should get monthly counts
And months should be sorted chronologically
```

### Implementation Checklist

- [ ] Create lib/stats.ts:
  ```typescript
  import { Release, MonthlyData } from './types';
  import { format, parseISO } from 'date-fns';

  export function groupReleasesByMonth(releases: Release[]): MonthlyData[] {
    // Create a map to count releases per month
    const monthMap = new Map<string, number>();

    releases.forEach((release) => {
      const monthKey = format(release.date, 'MMM yyyy');
      monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
    });

    // Convert map to array and sort by date
    const monthlyData: MonthlyData[] = [];
    const sortedEntries = Array.from(monthMap.entries()).sort((a, b) => {
      const dateA = new Date(a[0]);
      const dateB = new Date(b[0]);
      return dateA.getTime() - dateB.getTime();
    });

    sortedEntries.forEach(([month, count]) => {
      monthlyData.push({ month, count });
    });

    return monthlyData;
  }

  export function filterPreReleases(releases: Release[]): Release[] {
    return releases.filter((r) => !r.prerelease);
  }
  ```
- [ ] Write unit test for groupReleasesByMonth:
  ```typescript
  // Create __tests__/lib/stats.test.ts
  import { groupReleasesByMonth } from '@/lib/stats';

  describe('groupReleasesByMonth', () => {
    it('groups releases by month', () => {
      const releases = [
        { version: 'v1.0', date: new Date('2024-01-15'), prerelease: false },
        { version: 'v1.1', date: new Date('2024-01-20'), prerelease: false },
        { version: 'v2.0', date: new Date('2024-02-10'), prerelease: false },
      ];

      const result = groupReleasesByMonth(releases);

      expect(result).toEqual([
        { month: 'Jan 2024', count: 2 },
        { month: 'Feb 2024', count: 1 },
      ]);
    });
  });
  ```
- [ ] Install testing dependencies if not exists: `npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom`
- [ ] Configure jest.config.js if not exists
- [ ] Run tests: `npm test`
- [ ] Commit: "Add data transformation for monthly grouping"

### Dependencies
- US-004 (requires date-fns)
- US-017 (requires Release type)

### Files Created
- lib/stats.ts (or modified if exists from US-003)
- __tests__/lib/stats.test.ts

---

## US-023: Create ReleaseChart Component

**As a** user
**I want** to see releases displayed in a bar chart
**So that** I can visualize release frequency

**Story Points:** 1
**WSJF Score:** 24 (BV:10, TC:9, RR:8, Size:1.1) - **P0**

### Acceptance Criteria

```gherkin
Given I have release data
When the chart renders
Then I should see bars representing releases per month
And the chart should be responsive
```

### Implementation Checklist

- [ ] Create components/ReleaseChart.tsx:
  ```typescript
  'use client';

  import { Release, MonthlyData } from '@/lib/types';
  import { groupReleasesByMonth } from '@/lib/stats';
  import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

  interface ReleaseChartProps {
    releases: Release[];
  }

  export function ReleaseChart({ releases }: ReleaseChartProps) {
    const monthlyData = groupReleasesByMonth(releases);

    if (monthlyData.length === 0) {
      return (
        <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No release data to display</p>
        </div>
      );
    }

    return (
      <div className="w-full bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Releases per Month</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={monthlyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{ value: 'Releases', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
              }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  ```
- [ ] Update app/page.tsx to use ReleaseChart:
  ```typescript
  import { ReleaseChart } from '@/components/ReleaseChart';

  // Replace the JSON.stringify section with:
  {data && (
    <div className="mt-8 w-full max-w-6xl">
      <ReleaseChart releases={data} />
    </div>
  )}
  ```
- [ ] Test chart:
  - [ ] Load "facebook/react"
  - [ ] Verify chart renders
  - [ ] Verify bars show correct heights
  - [ ] Verify X-axis shows months
  - [ ] Resize window to test responsiveness
- [ ] Commit: "Create ReleaseChart component with Recharts"

### Dependencies
- US-021 (requires Recharts configured)
- US-022 (requires data transformation)

### Files Created
- components/ReleaseChart.tsx

### Files Modified
- app/page.tsx

---

## US-024: Add Chart Responsiveness

**As a** user
**I want** the chart to work on mobile
**So that** I can view it on any device

**Story Points:** 1
**WSJF Score:** 18 (BV:7, TC:7, RR:5, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given I view the chart on mobile
When the screen is small
Then the chart should adjust its size
And remain readable
```

### Implementation Checklist

- [ ] Update components/ReleaseChart.tsx with responsive styles:
  ```typescript
  export function ReleaseChart({ releases }: ReleaseChartProps) {
    const monthlyData = groupReleasesByMonth(releases);

    // ... existing code

    return (
      <div className="w-full bg-white p-4 md:p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg md:text-xl font-bold mb-4">Releases per Month</h2>
        <div className="w-full h-64 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{
                top: 20,
                right: 10,
                left: 0,
                bottom: 80,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 10 }}
                interval={monthlyData.length > 12 ? 1 : 0}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
              />
              <Bar
                dataKey="count"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
  ```
- [ ] Test on different screen sizes:
  - [ ] Desktop (1920px)
  - [ ] Tablet (768px)
  - [ ] Mobile (375px)
- [ ] Verify chart is readable on all sizes
- [ ] Verify touch interactions work on mobile
- [ ] Commit: "Make chart responsive for mobile devices"

### Dependencies
- US-023 (requires ReleaseChart)

### Files Modified
- components/ReleaseChart.tsx

---

## US-025: Add Chart Loading State

**As a** user
**I want** smooth transitions when chart loads
**So that** the experience feels polished

**Story Points:** 1
**WSJF Score:** 12 (BV:4, TC:4, RR:4, Size:1) - **P2**

### Acceptance Criteria

```gherkin
Given the chart is loading
When data arrives
Then it should fade in smoothly
```

### Implementation Checklist

- [ ] Update components/ReleaseChart.tsx with animation:
  ```typescript
  'use client';

  import { useState, useEffect } from 'react';

  export function ReleaseChart({ releases }: ReleaseChartProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      setIsVisible(true);
    }, []);

    const monthlyData = groupReleasesByMonth(releases);

    // ... existing code

    return (
      <div
        className={`w-full bg-white p-4 md:p-6 rounded-lg border border-gray-200 transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* ... rest of component */}
      </div>
    );
  }
  ```
- [ ] Test animation:
  - [ ] Load repository
  - [ ] Verify chart fades in
  - [ ] Check timing feels natural
- [ ] Commit: "Add fade-in animation to chart"

### Dependencies
- US-023 (requires ReleaseChart)

### Files Modified
- components/ReleaseChart.tsx

---

## US-026: Add Empty State for Chart

**As a** user
**I want** a clear message when no data exists
**So that** I understand why the chart is empty

**Story Points:** 1
**WSJF Score:** 15 (BV:6, TC:5, RR:5, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given a repository has no releases
When I load it
Then I should see a friendly "No releases found" message
```

### Implementation Checklist

- [ ] Update components/ReleaseChart.tsx empty state:
  ```typescript
  if (releases.length === 0) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <svg
          className="w-16 h-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No Releases Found
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          This repository doesn't have any published releases yet. Try a different repository.
        </p>
      </div>
    );
  }
  ```
- [ ] Test empty state by creating a repo with no releases or handling in app
- [ ] Verify message is clear and helpful
- [ ] Commit: "Add empty state to chart component"

### Dependencies
- US-023 (requires ReleaseChart)

### Files Modified
- components/ReleaseChart.tsx

---

# Epic 5: Statistics Calculation

**Goal:** Display key metrics about releases
**Timeline:** Week 5-6 (Sprint 2, Part 2)
**Story Points:** 12 points total

---

## US-027: Create Stats Calculation Functions

**As a** developer
**I want** functions to calculate release statistics
**So that** I can display metrics

**Story Points:** 1
**WSJF Score:** 21 (BV:8, TC:8, RR:6, Size:1.05) - **P0**

### Acceptance Criteria

```gherkin
Given an array of releases
When I calculate stats
Then I should get total, average days, per month, and last release
```

### Implementation Checklist

- [ ] Add to lib/stats.ts:
  ```typescript
  import { Release, ReleaseStats } from './types';
  import { formatDistanceToNow, differenceInDays } from 'date-fns';

  export function calculateReleaseStats(releases: Release[]): ReleaseStats {
    if (releases.length === 0) {
      return {
        total: 0,
        avgDays: 0,
        perMonth: '0',
        lastRelease: 'N/A',
      };
    }

    // Sort by date (oldest first for calculations)
    const sorted = [...releases].sort((a, b) => a.date.getTime() - b.date.getTime());

    const total = sorted.length;
    const firstRelease = sorted[0].date;
    const lastRelease = sorted[total - 1].date;

    // Calculate average days between releases
    let avgDays = 0;
    if (total > 1) {
      const totalDays = differenceInDays(lastRelease, firstRelease);
      avgDays = Math.round(totalDays / (total - 1));
    }

    // Calculate releases per month
    const totalMonths = differenceInDays(lastRelease, firstRelease) / 30;
    const perMonth = totalMonths > 0 ? (total / totalMonths).toFixed(1) : '0';

    // Format last release time
    const lastReleaseFormatted = formatDistanceToNow(lastRelease, {
      addSuffix: true,
    });

    return {
      total,
      avgDays,
      perMonth,
      lastRelease: lastReleaseFormatted,
    };
  }
  ```
- [ ] Write unit tests for calculateReleaseStats
- [ ] Test edge cases:
  - [ ] 0 releases
  - [ ] 1 release
  - [ ] Multiple releases same day
- [ ] Commit: "Add release statistics calculation"

### Dependencies
- US-022 (requires stats.ts file)

### Files Modified
- lib/stats.ts

---

## US-028: Create StatsCard Component

**As a** user
**I want** to see key statistics in cards
**So that** I can quickly understand release patterns

**Story Points:** 1
**WSJF Score:** 20 (BV:8, TC:7, RR:6, Size:1.05) - **P0**

### Acceptance Criteria

```gherkin
Given I have release data
When stats are calculated
Then I should see 4 stat cards showing key metrics
```

### Implementation Checklist

- [ ] Create components/StatsCard.tsx:
  ```typescript
  interface StatsCardProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
  }

  export function StatsCard({ label, value, icon }: StatsCardProps) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
      </div>
    );
  }
  ```
- [ ] Create components/StatsGrid.tsx:
  ```typescript
  'use client';

  import { Release } from '@/lib/types';
  import { calculateReleaseStats } from '@/lib/stats';
  import { StatsCard } from './StatsCard';

  interface StatsGridProps {
    releases: Release[];
  }

  export function StatsGrid({ releases }: StatsGridProps) {
    const stats = calculateReleaseStats(releases);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <StatsCard
          label="Total Releases"
          value={stats.total}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
        />
        <StatsCard
          label="Average Days"
          value={stats.avgDays}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatsCard
          label="Per Month"
          value={stats.perMonth}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <StatsCard
          label="Last Release"
          value={stats.lastRelease}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>
    );
  }
  ```
- [ ] Update app/page.tsx:
  ```typescript
  import { StatsGrid } from '@/components/StatsGrid';

  {data && (
    <div className="mt-8 w-full max-w-6xl space-y-8">
      <StatsGrid releases={data} />
      <ReleaseChart releases={data} />
    </div>
  )}
  ```
- [ ] Test stats display with various repos
- [ ] Commit: "Create stats cards component"

### Dependencies
- US-027 (requires calculateReleaseStats)

### Files Created
- components/StatsCard.tsx
- components/StatsGrid.tsx

### Files Modified
- app/page.tsx

---

## US-029: Add Stats Animation

**As a** user
**I want** stats to animate when they appear
**So that** the experience feels dynamic

**Story Points:** 1
**WSJF Score:** 11 (BV:4, TC:3, RR:4, Size:1) - **P2**

### Acceptance Criteria

```gherkin
Given stats are loading
When they appear
Then numbers should count up from 0
```

### Implementation Checklist

- [ ] Create lib/hooks/useCountUp.ts:
  ```typescript
  'use client';

  import { useState, useEffect } from 'react';

  export function useCountUp(end: number, duration: number = 1000) {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTime: number | null = null;
      const startValue = 0;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        setCount(Math.floor(progress * (end - startValue) + startValue));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [end, duration]);

    return count;
  }
  ```
- [ ] Update components/StatsCard.tsx:
  ```typescript
  'use client';

  import { useCountUp } from '@/lib/hooks/useCountUp';

  export function StatsCard({ label, value, icon }: StatsCardProps) {
    const numericValue = typeof value === 'number' ? value : parseFloat(value);
    const animatedValue = useCountUp(numericValue, 1000);
    const displayValue = typeof value === 'number' ? animatedValue : value;

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        {/* ... existing code */}
        <p className="text-3xl font-bold text-gray-900">{displayValue}</p>
        {/* ... */}
      </div>
    );
  }
  ```
- [ ] Test animation:
  - [ ] Load repository
  - [ ] Verify numbers count up
  - [ ] Verify animation duration feels right
- [ ] Commit: "Add count-up animation to stats"

### Dependencies
- US-028 (requires StatsCard)

### Files Created
- lib/hooks/useCountUp.ts

### Files Modified
- components/StatsCard.tsx

---

## US-030: Add Stats Tooltips

**As a** user
**I want** tooltips explaining each stat
**So that** I understand what they mean

**Story Points:** 1
**WSJF Score:** 13 (BV:5, TC:4, RR:5, Size:1.05) - **P2**

### Acceptance Criteria

```gherkin
Given I hover over a stat card
When the tooltip appears
Then it should explain what the stat represents
```

### Implementation Checklist

- [ ] Update components/StatsCard.tsx:
  ```typescript
  'use client';

  import { useState } from 'react';

  interface StatsCardProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    tooltip?: string;
  }

  export function StatsCard({ label, value, icon, tooltip }: StatsCardProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <div
        className="relative bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {tooltip && showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap z-10">
            {tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
              <div className="border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        )}
        {/* ... rest of component */}
      </div>
    );
  }
  ```
- [ ] Update StatsGrid to pass tooltips:
  ```typescript
  <StatsCard
    label="Total Releases"
    value={stats.total}
    tooltip="Total number of published releases"
    icon={...}
  />
  <StatsCard
    label="Average Days"
    value={stats.avgDays}
    tooltip="Average days between consecutive releases"
    icon={...}
  />
  <StatsCard
    label="Per Month"
    value={stats.perMonth}
    tooltip="Average releases per month"
    icon={...}
  />
  <StatsCard
    label="Last Release"
    value={stats.lastRelease}
    tooltip="Time since the most recent release"
    icon={...}
  />
  ```
- [ ] Test tooltips on desktop
- [ ] Commit: "Add tooltips to stats cards"

### Dependencies
- US-028 (requires StatsCard)

### Files Modified
- components/StatsCard.tsx
- components/StatsGrid.tsx

---

# Epic 6: Error Handling & Edge Cases

**Goal:** Handle all error scenarios gracefully
**Timeline:** Week 7 (Sprint 3, Part 1)
**Story Points:** 10 points total

---

## US-031: Handle Repository Not Found

**As a** user
**I want** a clear message when a repo doesn't exist
**So that** I know what went wrong

**Story Points:** 1
**WSJF Score:** 19 (BV:8, TC:7, RR:5, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given I enter a repository that doesn't exist
When the API responds with 404
Then I should see "Repository not found"
And suggestions for what to try next
```

### Implementation Checklist

- [ ] Error handling already implemented in US-016 (API route)
- [ ] Update components/ErrorMessage.tsx with specific error types:
  ```typescript
  interface ErrorMessageProps {
    message: string;
    type?: '404' | '403' | 'network' | 'unknown';
    onRetry?: () => void;
  }

  export function ErrorMessage({ message, type = 'unknown', onRetry }: ErrorMessageProps) {
    const suggestions = {
      '404': [
        'Check the repository name spelling',
        'Verify the repository exists on GitHub',
        'Ensure it\'s not a private repository',
      ],
      '403': [
        'Wait for the rate limit to reset',
        'Try again in a few minutes',
      ],
      network: [
        'Check your internet connection',
        'Try refreshing the page',
      ],
      unknown: ['Try again', 'Check your input'],
    };

    return (
      <div className="w-full max-w-2xl p-6 bg-red-50 border border-red-200 rounded-lg">
        {/* ... existing error display */}
        {suggestions[type] && (
          <ul className="mt-3 ml-4 text-sm text-red-700 list-disc">
            {suggestions[type].map((suggestion, i) => (
              <li key={i}>{suggestion}</li>
            ))}
          </ul>
        )}
        {/* ... retry button */}
      </div>
    );
  }
  ```
- [ ] Update useReleases hook to detect error type
- [ ] Test with non-existent repo
- [ ] Commit: "Add specific error handling for 404"

### Dependencies
- US-018 (requires ErrorMessage)

### Files Modified
- components/ErrorMessage.tsx
- lib/hooks/useReleases.ts

---

## US-032: Handle Rate Limiting

**As a** user
**I want** clear feedback when rate limited
**So that** I know when I can try again

**Story Points:** 1
**WSJF Score:** 17 (BV:7, TC:6, RR:5, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given I hit GitHub's rate limit
When the error occurs
Then I should see when the limit resets
And how many minutes to wait
```

### Implementation Checklist

- [ ] Rate limit handling already in US-016 (API route returns resetTime)
- [ ] Update components/ErrorMessage.tsx for rate limits:
  ```typescript
  interface ErrorMessageProps {
    message: string;
    type?: '404' | '403' | 'network' | 'unknown';
    resetTime?: string; // ISO string
    onRetry?: () => void;
  }

  export function ErrorMessage({ message, type, resetTime, onRetry }: ErrorMessageProps) {
    // Calculate minutes until reset
    const minutesUntilReset = resetTime
      ? Math.ceil((new Date(resetTime).getTime() - Date.now()) / 60000)
      : null;

    return (
      <div className="w-full max-w-2xl p-6 bg-red-50 border border-red-200 rounded-lg">
        {/* ... existing code */}
        {type === '403' && resetTime && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
            <p className="text-sm text-amber-800">
              Rate limit resets in <strong>{minutesUntilReset} minutes</strong>
            </p>
          </div>
        )}
        {/* ... */}
      </div>
    );
  }
  ```
- [ ] Test rate limit display (may need to mock)
- [ ] Commit: "Add rate limit countdown display"

### Dependencies
- US-031 (requires enhanced ErrorMessage)

### Files Modified
- components/ErrorMessage.tsx

---

## US-033: Handle Network Errors

**As a** user
**I want** helpful messages for network issues
**So that** I can troubleshoot connectivity

**Story Points:** 1
**WSJF Score:** 14 (BV:5, TC:5, RR:5, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given my internet connection fails
When I try to load data
Then I should see a network error message
```

### Implementation Checklist

- [ ] Update lib/hooks/useReleases.ts to detect network errors:
  ```typescript
  try {
    const response = await fetch(`/api/releases/${repoName}`, {
      signal: abortController.signal,
    });
    // ... existing code
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === 'AbortError') return;

      // Detect network errors
      if (err.message.includes('fetch') || err.message.includes('network')) {
        setError('Network error: Check your internet connection');
        setErrorType('network');
        return;
      }
    }
    setError(err instanceof Error ? err.message : 'An error occurred');
  }
  ```
- [ ] Test offline mode:
  - [ ] Open DevTools
  - [ ] Set network to "Offline"
  - [ ] Try loading data
  - [ ] Verify error message
- [ ] Commit: "Add network error detection"

### Dependencies
- US-031 (requires error types)

### Files Modified
- lib/hooks/useReleases.ts

---

## US-034: Handle Empty Releases

**As a** user
**I want** a clear message when no releases exist
**So that** I'm not confused by an empty chart

**Story Points:** 1
**WSJF Score:** 16 (BV:6, TC:6, RR:5, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given a repository has 0 releases
When I load it
Then I should see "No releases found"
And the chart should show an empty state
```

### Implementation Checklist

- [ ] Empty state already handled in US-026 for chart
- [ ] Add check in app/page.tsx:
  ```typescript
  {data && data.length === 0 && (
    <div className="mt-8 w-full max-w-2xl p-8 bg-blue-50 border border-blue-200 rounded-lg text-center">
      <svg className="w-12 h-12 text-blue-500 mx-auto mb-4" /* ... info icon ... */ />
      <h3 className="text-lg font-semibold text-blue-900 mb-2">
        No Releases Found
      </h3>
      <p className="text-sm text-blue-700">
        This repository doesn't have any published releases yet.
        Try searching for a different repository.
      </p>
    </div>
  )}

  {data && data.length > 0 && (
    <div className="mt-8 w-full max-w-6xl space-y-8">
      <StatsGrid releases={data} />
      <ReleaseChart releases={data} />
    </div>
  )}
  ```
- [ ] Test with repo that has no releases
- [ ] Commit: "Add empty state handling for zero releases"

### Dependencies
- US-026 (chart empty state)

### Files Modified
- app/page.tsx

---

## US-035: Add Global Error Boundary

**As a** developer
**I want** an error boundary to catch React errors
**So that** the app doesn't crash completely

**Story Points:** 1
**WSJF Score:** 18 (BV:7, TC:7, RR:6, Size:1.1) - **P1**

### Acceptance Criteria

```gherkin
Given a React error occurs
When the component crashes
Then the error boundary should catch it
And display a fallback UI
```

### Implementation Checklist

- [ ] Create components/ErrorBoundary.tsx:
  ```typescript
  'use client';

  import { Component, ReactNode } from 'react';

  interface Props {
    children: ReactNode;
    fallback?: ReactNode;
  }

  interface State {
    hasError: boolean;
    error?: Error;
  }

  export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
      console.error('Error boundary caught:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return (
          this.props.fallback || (
            <div className="min-h-screen flex items-center justify-center p-8">
              <div className="max-w-md p-6 bg-red-50 border border-red-200 rounded-lg">
                <h2 className="text-xl font-bold text-red-900 mb-2">
                  Something went wrong
                </h2>
                <p className="text-sm text-red-700 mb-4">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Reload Page
                </button>
              </div>
            </div>
          )
        );
      }

      return this.props.children;
    }
  }
  ```
- [ ] Wrap app in app/layout.tsx:
  ```typescript
  import { ErrorBoundary } from '@/components/ErrorBoundary';

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </body>
      </html>
    );
  }
  ```
- [ ] Test error boundary (throw error in component)
- [ ] Commit: "Add error boundary for crash protection"

### Dependencies
- None

### Files Created
- components/ErrorBoundary.tsx

### Files Modified
- app/layout.tsx

---

# Epic 7: Performance Optimization

**Goal:** Ensure fast loading and smooth performance
**Timeline:** Week 7-8 (Sprint 3, Part 2)
**Story Points:** 8 points total

---

## US-036: Add Code Splitting for Chart

**As a** developer
**I want** to lazy load the chart library
**So that** initial page load is faster

**Story Points:** 1
**WSJF Score:** 19 (BV:7, TC:8, RR:6, Size:1.1) - **P1**

### Acceptance Criteria

```gherkin
Given the app loads
When the user hasn't submitted a repo yet
Then Recharts should not be loaded
And when data is fetched
Then Recharts should load dynamically
```

### Implementation Checklist

- [ ] Update app/page.tsx to lazy load chart:
  ```typescript
  'use client';

  import { useState, lazy, Suspense } from 'react';
  import dynamic from 'next/dynamic';
  import { RepoInput } from '@/components/RepoInput';
  import { StatsGrid } from '@/components/StatsGrid';
  import { LoadingSkeleton } from '@/components/LoadingSkeleton';
  import { useReleases } from '@/lib/hooks/useReleases';

  // Lazy load chart component
  const ReleaseChart = dynamic(() => import('@/components/ReleaseChart').then(mod => ({ default: mod.ReleaseChart })), {
    loading: () => <LoadingSkeleton />,
    ssr: false,
  });

  export default function Home() {
    // ... existing code

    return (
      <main className="min-h-screen p-8 flex flex-col items-center justify-center">
        {/* ... existing code */}

        {data && data.length > 0 && (
          <div className="mt-8 w-full max-w-6xl space-y-8">
            <StatsGrid releases={data} />
            <Suspense fallback={<LoadingSkeleton />}>
              <ReleaseChart releases={data} />
            </Suspense>
          </div>
        )}
      </main>
    );
  }
  ```
- [ ] Test bundle size before and after:
  - [ ] Run `npm run build`
  - [ ] Check bundle sizes in output
  - [ ] Verify chart chunk is separate
- [ ] Test lazy loading in browser DevTools Network tab
- [ ] Commit: "Add code splitting for chart component"

### Dependencies
- US-023 (requires ReleaseChart)

### Files Modified
- app/page.tsx

---

## US-037: Add Memoization to Expensive Calculations

**As a** developer
**I want** to memoize expensive calculations
**So that** re-renders are faster

**Story Points:** 1
**WSJF Score:** 16 (BV:6, TC:6, RR:5, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given the same data is passed to components
When React re-renders
Then calculations should not run again
```

### Implementation Checklist

- [ ] Update components/ReleaseChart.tsx:
  ```typescript
  'use client';

  import { useMemo } from 'react';

  export function ReleaseChart({ releases }: ReleaseChartProps) {
    const monthlyData = useMemo(() => {
      return groupReleasesByMonth(releases);
    }, [releases]);

    // ... rest of component
  }
  ```
- [ ] Update components/StatsGrid.tsx:
  ```typescript
  'use client';

  import { useMemo } from 'react';

  export function StatsGrid({ releases }: StatsGridProps) {
    const stats = useMemo(() => {
      return calculateReleaseStats(releases);
    }, [releases]);

    // ... rest of component
  }
  ```
- [ ] Test performance with React DevTools Profiler
- [ ] Verify calculations only run when data changes
- [ ] Commit: "Add memoization to chart and stats"

### Dependencies
- US-023, US-028 (requires chart and stats components)

### Files Modified
- components/ReleaseChart.tsx
- components/StatsGrid.tsx

---

## US-038: Optimize Images and Assets

**As a** developer
**I want** optimized assets
**So that** page load is faster

**Story Points:** 1
**WSJF Score:** 14 (BV:5, TC:5, RR:5, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given the app has images or icons
When they load
Then they should be optimized for web
```

### Implementation Checklist

- [ ] Currently using inline SVG icons (already optimized)
- [ ] If any images are added, use Next.js Image component:
  ```typescript
  import Image from 'next/image';

  <Image
    src="/logo.png"
    alt="Logo"
    width={200}
    height={50}
    priority
  />
  ```
- [ ] Configure next.config.ts for image optimization:
  ```typescript
  const nextConfig = {
    images: {
      formats: ['image/avif', 'image/webp'],
    },
  };
  ```
- [ ] Add logo or favicon if needed (optimized)
- [ ] Run Lighthouse to verify image optimization
- [ ] Commit: "Configure image optimization"

### Dependencies
- None

### Files Modified
- next.config.ts

---

## US-039: Add Performance Monitoring

**As a** developer
**I want** to monitor Core Web Vitals
**So that** I can track performance

**Story Points:** 1
**WSJF Score:** 15 (BV:6, TC:5, RR:5, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given the app is deployed
When users interact with it
Then performance metrics should be tracked
```

### Implementation Checklist

- [ ] Create lib/analytics.ts:
  ```typescript
  export function sendToAnalytics(metric: any) {
    const body = JSON.stringify(metric);
    const url = '/api/analytics';

    // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, {
        body,
        method: 'POST',
        keepalive: true,
      });
    }
  }
  ```
- [ ] Add to app/layout.tsx:
  ```typescript
  'use client';

  import { useReportWebVitals } from 'next/web-vitals';

  export function WebVitals() {
    useReportWebVitals((metric) => {
      console.log(metric);
      // Send to analytics service
      // sendToAnalytics(metric);
    });

    return null;
  }

  // In layout:
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>
          <WebVitals />
          <ErrorBoundary>{children}</ErrorBoundary>
        </body>
      </html>
    );
  }
  ```
- [ ] Test that metrics are logged
- [ ] Document how to integrate with analytics service (Vercel Analytics, Google Analytics, etc.)
- [ ] Commit: "Add Web Vitals tracking"

### Dependencies
- None

### Files Created
- lib/analytics.ts

### Files Modified
- app/layout.tsx

---

## US-040: Run Lighthouse Audit

**As a** developer
**I want** to run Lighthouse audits
**So that** I ensure performance targets are met

**Story Points:** 1
**WSJF Score:** 17 (BV:7, TC:6, RR:5, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given the app is built for production
When I run Lighthouse
Then performance score should be >90
And accessibility score should be >90
```

### Implementation Checklist

- [ ] Build for production: `npm run build`
- [ ] Start production server: `npm start`
- [ ] Open Chrome DevTools
- [ ] Run Lighthouse audit
- [ ] Check scores:
  - [ ] Performance: >90
  - [ ] Accessibility: >90
  - [ ] Best Practices: >90
  - [ ] SEO: >90
- [ ] Fix any issues identified
- [ ] Add npm script for Lighthouse CI:
  ```json
  "scripts": {
    "lighthouse": "lighthouse http://localhost:3000 --view"
  }
  ```
- [ ] Document Lighthouse scores in README
- [ ] Commit: "Add Lighthouse audit script and results"

### Dependencies
- All previous performance stories

### Files Modified
- package.json
- README.md (documentation)

---

# Epic 8: Accessibility Implementation

**Goal:** Make the app usable by everyone
**Timeline:** Week 8 (Sprint 3, Part 3)
**Story Points:** 10 points total

---

## US-041: Add ARIA Labels to All Interactive Elements

**As a** screen reader user
**I want** all interactive elements labeled
**So that** I can navigate the app

**Story Points:** 1
**WSJF Score:** 18 (BV:7, TC:7, RR:6, Size:1.1) - **P1**

### Acceptance Criteria

```gherkin
Given I use a screen reader
When I navigate the app
Then all buttons, inputs, and links should be announced
```

### Implementation Checklist

- [ ] Audit all components for ARIA labels
- [ ] Update RepoInput (already has ARIA from US-014)
- [ ] Update ErrorMessage:
  ```typescript
  <div role="alert" aria-live="assertive">
    {/* error content */}
  </div>
  ```
- [ ] Update StatsCard:
  ```typescript
  <div role="region" aria-label={`${label} statistic`}>
    {/* card content */}
  </div>
  ```
- [ ] Update ReleaseChart:
  ```typescript
  <div role="img" aria-label="Bar chart showing releases per month">
    <ResponsiveContainer>
      {/* chart */}
    </ResponsiveContainer>
  </div>
  ```
- [ ] Test with screen reader (NVDA or VoiceOver)
- [ ] Commit: "Add ARIA labels to all interactive elements"

### Dependencies
- US-014 (input accessibility)

### Files Modified
- components/ErrorMessage.tsx
- components/StatsCard.tsx
- components/ReleaseChart.tsx

---

## US-042: Ensure Keyboard Navigation Works

**As a** keyboard user
**I want** to navigate with Tab and Enter
**So that** I don't need a mouse

**Story Points:** 1
**WSJF Score:** 17 (BV:7, TC:6, RR:5, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given I use only keyboard
When I press Tab
Then focus should move to each interactive element
And Enter should activate buttons
```

### Implementation Checklist

- [ ] Test tab order through entire app
- [ ] Ensure focus visible on all elements (already styled with Tailwind focus rings)
- [ ] Add skip-to-content link in app/layout.tsx:
  ```typescript
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
  >
    Skip to main content
  </a>
  <main id="main-content">
    {children}
  </main>
  ```
- [ ] Test keyboard navigation:
  - [ ] Tab to input
  - [ ] Tab to button
  - [ ] Tab to examples
  - [ ] Enter to submit
  - [ ] Escape to clear (already implemented)
- [ ] Verify no keyboard traps
- [ ] Commit: "Add skip-to-content link and verify keyboard navigation"

### Dependencies
- US-013 (keyboard shortcuts)

### Files Modified
- app/layout.tsx

---

## US-043: Add Focus Management

**As a** keyboard user
**I want** focus to move logically after actions
**So that** I don't lose my place

**Story Points:** 1
**WSJF Score:** 14 (BV:5, TC:5, RR:5, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given I submit the form
When results load
Then focus should move to the results heading
```

### Implementation Checklist

- [ ] Update app/page.tsx with focus management:
  ```typescript
  'use client';

  import { useEffect, useRef } from 'react';

  export default function Home() {
    const [repo, setRepo] = useState<string | null>(null);
    const { data, loading, error } = useReleases(repo);
    const resultsRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
      if (data && !loading && resultsRef.current) {
        resultsRef.current.focus();
      }
    }, [data, loading]);

    return (
      <main>
        {/* ... input */}

        {data && data.length > 0 && (
          <div className="mt-8 w-full max-w-6xl space-y-8">
            <h2
              ref={resultsRef}
              tabIndex={-1}
              className="text-2xl font-bold outline-none"
            >
              Release Statistics
            </h2>
            <StatsGrid releases={data} />
            <ReleaseChart releases={data} />
          </div>
        )}
      </main>
    );
  }
  ```
- [ ] Test focus moves after form submission
- [ ] Test focus announcement with screen reader
- [ ] Commit: "Add focus management for results"

### Dependencies
- US-042 (keyboard navigation)

### Files Modified
- app/page.tsx

---

## US-044: Add Color Contrast Compliance

**As a** user with visual impairment
**I want** sufficient color contrast
**So that** I can read all text

**Story Points:** 1
**WSJF Score:** 16 (BV:6, TC:6, RR:5, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given any text on the page
When I check color contrast
Then it should meet WCAG AA standards (4.5:1)
```

### Implementation Checklist

- [ ] Audit colors in app:
  - Text: #1f2937 on white (#ffffff) - ✓ passes
  - Blue: #3b82f6 on white - check contrast
  - Error: #ef4444 on #fef2f2 - check contrast
- [ ] Use online contrast checker: https://webaim.org/resources/contrastchecker/
- [ ] Update any colors that don't meet standards
- [ ] Update Tailwind theme in tailwind.config.ts if needed:
  ```typescript
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // Darker blue for better contrast
        },
      },
    },
  }
  ```
- [ ] Re-run Lighthouse accessibility audit
- [ ] Verify all text has 4.5:1 contrast minimum
- [ ] Commit: "Ensure WCAG AA color contrast compliance"

### Dependencies
- None

### Files Modified
- tailwind.config.ts (if changes needed)

---

## US-045: Add Screen Reader Announcements

**As a** screen reader user
**I want** dynamic content changes announced
**So that** I know when data loads

**Story Points:** 1
**WSJF Score:** 15 (BV:6, TC:5, RR:5, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given data is loading
When it finishes
Then screen reader should announce "Results loaded"
```

### Implementation Checklist

- [ ] Create components/Announcer.tsx:
  ```typescript
  'use client';

  interface AnnouncerProps {
    message: string;
    politeness?: 'polite' | 'assertive';
  }

  export function Announcer({ message, politeness = 'polite' }: AnnouncerProps) {
    return (
      <div
        role="status"
        aria-live={politeness}
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>
    );
  }
  ```
- [ ] Update app/page.tsx:
  ```typescript
  import { Announcer } from '@/components/Announcer';

  export default function Home() {
    const { data, loading, error } = useReleases(repo);
    const [announcement, setAnnouncement] = useState('');

    useEffect(() => {
      if (loading) {
        setAnnouncement('Loading release data...');
      } else if (error) {
        setAnnouncement(`Error: ${error}`);
      } else if (data) {
        setAnnouncement(`Loaded ${data.length} releases`);
      }
    }, [data, loading, error]);

    return (
      <main>
        <Announcer message={announcement} />
        {/* ... rest of app */}
      </main>
    );
  }
  ```
- [ ] Test with screen reader
- [ ] Verify announcements are heard
- [ ] Commit: "Add screen reader announcements for dynamic content"

### Dependencies
- None

### Files Created
- components/Announcer.tsx

### Files Modified
- app/page.tsx

---

# Epic 9: Browser Compatibility

**Goal:** Ensure app works across all major browsers
**Timeline:** Week 9 (Sprint 4, Part 1)
**Story Points:** 6 points total

---

## US-046: Test on Chrome, Firefox, Safari, Edge

**As a** developer
**I want** to test on all major browsers
**So that** all users can access the app

**Story Points:** 2
**WSJF Score:** 17 (BV:7, TC:6, RR:6, Size:1.1) - **P1**

### Acceptance Criteria

```gherkin
Given the app is built
When I test on Chrome, Firefox, Safari, and Edge
Then all features should work correctly
```

### Implementation Checklist

- [ ] Test on Chrome 120+:
  - [ ] Load app
  - [ ] Test input validation
  - [ ] Test data fetching
  - [ ] Test chart rendering
  - [ ] Test responsive design
- [ ] Test on Firefox 121+:
  - [ ] Same tests as Chrome
  - [ ] Verify SVG icons render
- [ ] Test on Safari 17+:
  - [ ] Same tests
  - [ ] Check date formatting (Safari date quirks)
- [ ] Test on Edge 120+:
  - [ ] Same tests
- [ ] Document any browser-specific issues
- [ ] Add polyfills if needed in next.config.ts
- [ ] Create browser compatibility matrix in README
- [ ] Commit: "Test and verify browser compatibility"

### Dependencies
- All MVP features completed

### Files Modified
- README.md (documentation)
- next.config.ts (if polyfills needed)

---

## US-047: Add Playwright E2E Tests

**As a** developer
**I want** automated cross-browser tests
**So that** regressions are caught

**Story Points:** 2
**WSJF Score:** 16 (BV:6, TC:6, RR:5, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given E2E tests are written
When I run them
Then they should pass on Chrome, Firefox, and Safari
```

### Implementation Checklist

- [ ] Install Playwright: `npm install -D @playwright/test`
- [ ] Initialize Playwright: `npx playwright install`
- [ ] Create playwright.config.ts:
  ```typescript
  import { defineConfig, devices } from '@playwright/test';

  export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
      baseURL: 'http://localhost:3000',
      trace: 'on-first-retry',
    },
    projects: [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
      { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    ],
    webServer: {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
    },
  });
  ```
- [ ] Create e2e/app.spec.ts:
  ```typescript
  import { test, expect } from '@playwright/test';

  test.describe('GitHub Releases Dashboard', () => {
    test('should load homepage', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('h1')).toContainText('GitHub Releases Dashboard');
    });

    test('should validate input', async ({ page }) => {
      await page.goto('/');
      const input = page.locator('input[type="text"]');
      const button = page.locator('button[type="submit"]');

      await input.fill('invalid');
      await input.blur();

      await expect(page.locator('text=Invalid format')).toBeVisible();
      await expect(button).toBeDisabled();
    });

    test('should fetch and display releases', async ({ page }) => {
      await page.goto('/');
      const input = page.locator('input[type="text"]');

      await input.fill('facebook/react');
      await page.locator('button[type="submit"]').click();

      await expect(page.locator('text=Loading')).toBeVisible();
      await expect(page.locator('text=Total Releases')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('text=Releases per Month')).toBeVisible();
    });

    test('should handle errors', async ({ page }) => {
      await page.goto('/');
      const input = page.locator('input[type="text"]');

      await input.fill('invalid/nonexistent-repo-12345');
      await page.locator('button[type="submit"]').click();

      await expect(page.locator('text=Error')).toBeVisible({ timeout: 10000 });
    });
  });
  ```
- [ ] Add test scripts to package.json:
  ```json
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
  ```
- [ ] Run tests: `npm run test:e2e`
- [ ] Verify all tests pass
- [ ] Commit: "Add Playwright E2E tests"

### Dependencies
- US-046 (browser compatibility)

### Files Created
- playwright.config.ts
- e2e/app.spec.ts

### Files Modified
- package.json

---

# Epic 10: Security Implementation

**Goal:** Ensure app is secure
**Timeline:** Week 9 (Sprint 4, Part 2)
**Story Points:** 8 points total

---

## US-048: Add Content Security Policy

**As a** developer
**I want** CSP headers configured
**So that** XSS attacks are prevented

**Story Points:** 1
**WSJF Score:** 19 (BV:8, TC:7, RR:6, Size:1.1) - **P1**

### Acceptance Criteria

```gherkin
Given the app is deployed
When I check response headers
Then CSP should be configured
```

### Implementation Checklist

- [ ] Create middleware.ts in project root:
  ```typescript
  import { NextResponse } from 'next/server';
  import type { NextRequest } from 'next/server';

  export function middleware(request: NextRequest) {
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

    const cspHeader = `
      default-src 'self';
      script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data:;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      connect-src 'self' https://api.github.com ${process.env.REDIS_URL};
      upgrade-insecure-requests;
    `
      .replace(/\s{2,}/g, ' ')
      .trim();

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('Content-Security-Policy', cspHeader);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    response.headers.set('Content-Security-Policy', cspHeader);
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
  }
  ```
- [ ] Test CSP by checking headers in DevTools
- [ ] Verify no CSP violations in console
- [ ] Commit: "Add Content Security Policy and security headers"

### Dependencies
- None

### Files Created
- middleware.ts

---

## US-049: Add Input Sanitization

**As a** developer
**I want** all user input sanitized
**So that** injection attacks are prevented

**Story Points:** 1
**WSJF Score:** 20 (BV:8, TC:8, RR:6, Size:1.1) - **P0**

### Acceptance Criteria

```gherkin
Given a user enters malicious input
When it's processed
Then it should be sanitized
```

### Implementation Checklist

- [ ] Input already validated with regex in US-010
- [ ] Update lib/validation.ts with sanitization:
  ```typescript
  export function sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>\"']/g, '') // Remove potential HTML/JS injection chars
      .slice(0, 100); // Limit length
  }

  export function validateAndSanitize(input: string): {
    valid: boolean;
    sanitized: string;
    error?: string;
  } {
    const sanitized = sanitizeInput(input);
    const validation = validateRepoName(sanitized);

    return {
      valid: validation.valid,
      sanitized,
      error: validation.error,
    };
  }
  ```
- [ ] Update API route to sanitize params:
  ```typescript
  // In app/api/releases/[owner]/[repo]/route.ts
  import { sanitizeInput } from '@/lib/validation';

  export async function GET(request: NextRequest, { params }: { params: Params }) {
    const owner = sanitizeInput(params.owner);
    const repo = sanitizeInput(params.repo);

    // ... rest of code
  }
  ```
- [ ] Test with malicious inputs:
  - [ ] `<script>alert('xss')</script>`
  - [ ] `'; DROP TABLE releases;--`
  - [ ] Very long strings (>1000 chars)
- [ ] Verify all are handled safely
- [ ] Commit: "Add input sanitization for security"

### Dependencies
- US-010 (validation)

### Files Modified
- lib/validation.ts
- app/api/releases/[owner]/[repo]/route.ts

---

## US-050: Add Rate Limiting to API Routes

**As a** developer
**I want** rate limiting on API routes
**So that** abuse is prevented

**Story Points:** 2
**WSJF Score:** 16 (BV:6, TC:6, RR:5, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given a user makes many requests
When they exceed the limit
Then they should be rate limited
```

### Implementation Checklist

- [ ] Install rate limiter: `npm install @upstash/ratelimit`
- [ ] Create lib/ratelimit.ts:
  ```typescript
  import { Ratelimit } from '@upstash/ratelimit';
  import { redis } from './cache';

  // Create rate limiter: 10 requests per 10 seconds per IP
  export const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    analytics: true,
  });
  ```
- [ ] Update app/api/releases/[owner]/[repo]/route.ts:
  ```typescript
  import { ratelimit } from '@/lib/ratelimit';

  export async function GET(request: NextRequest, { params }: { params: Params }) {
    // Get IP address
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1';

    // Check rate limit
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          limit,
          remaining,
          reset,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        }
      );
    }

    // ... existing code
  }
  ```
- [ ] Test rate limiting:
  - [ ] Make 10+ requests quickly
  - [ ] Verify 429 error after limit
- [ ] Commit: "Add rate limiting to API routes"

### Dependencies
- US-006 (Redis setup)

### Files Created
- lib/ratelimit.ts

### Files Modified
- app/api/releases/[owner]/[repo]/route.ts
- package.json

---

## US-051: Add Security Audit Script

**As a** developer
**I want** automated security scanning
**So that** vulnerabilities are caught

**Story Points:** 1
**WSJF Score:** 15 (BV:6, TC:5, RR:5, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given I run security audit
When vulnerabilities exist
Then they should be reported
```

### Implementation Checklist

- [ ] Add scripts to package.json:
  ```json
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "audit:production": "npm audit --production"
  }
  ```
- [ ] Run initial audit: `npm run audit`
- [ ] Fix any high/critical vulnerabilities
- [ ] Add to CI pipeline in .github/workflows/ci.yml:
  ```yaml
  - name: Security Audit
    run: npm audit --audit-level=moderate
  ```
- [ ] Document security policy in SECURITY.md:
  ```markdown
  # Security Policy

  ## Reporting a Vulnerability

  Please report security vulnerabilities to: security@example.com

  ## Supported Versions

  | Version | Supported          |
  | ------- | ------------------ |
  | 1.x     | :white_check_mark: |

  ## Security Measures

  - Input validation and sanitization
  - Content Security Policy headers
  - Rate limiting on API routes
  - Regular dependency audits
  - HTTPS only in production
  ```
- [ ] Commit: "Add security audit scripts and policy"

### Dependencies
- None

### Files Created
- SECURITY.md

### Files Modified
- package.json
- .github/workflows/ci.yml

---

## US-052: Configure HTTPS and Environment Security

**As a** developer
**I want** secure environment configuration
**So that** secrets are protected

**Story Points:** 1
**WSJF Score:** 18 (BV:7, TC:7, RR:6, Size:1.1) - **P1**

### Acceptance Criteria

```gherkin
Given the app is deployed
When I access it
Then it should use HTTPS
And environment variables should be secure
```

### Implementation Checklist

- [ ] HTTPS automatically handled by Vercel
- [ ] Verify .env.local in .gitignore
- [ ] Create .env.example with safe defaults (already done in US-005)
- [ ] Add environment validation at app startup in lib/env.ts:
  ```typescript
  // Add validation function
  export function validateEnv() {
    const required = ['REDIS_URL', 'REDIS_TOKEN'];
    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  // Call at app startup
  if (typeof window === 'undefined') {
    // Server-side only
    validateEnv();
  }
  ```
- [ ] Document environment setup in README.md
- [ ] Add deployment guide for Vercel
- [ ] Commit: "Add environment variable validation"

### Dependencies
- US-005 (environment setup)

### Files Modified
- lib/env.ts
- README.md

---

# Epic 11: UI/UX Polish

**Goal:** Polish the user interface
**Timeline:** Week 10 (Sprint 4, Part 3)
**Story Points:** 12 points total

---

## US-053: Add Page Header and Branding

**As a** user
**I want** clear branding and navigation
**So that** I understand what the app does

**Story Points:** 1
**WSJF Score:** 16 (BV:6, TC:6, RR:5, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given I visit the app
When the page loads
Then I should see a clear header with title and description
```

### Implementation Checklist

- [ ] Update app/page.tsx with header:
  ```typescript
  export default function Home() {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <header className="w-full bg-white border-b border-gray-200 py-6 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              GitHub Releases Dashboard
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Visualize release history and patterns for any GitHub repository
            </p>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {/* existing content */}
        </div>
      </main>
    );
  }
  ```
- [ ] Add footer:
  ```typescript
  <footer className="mt-20 py-8 border-t border-gray-200 text-center text-sm text-gray-600">
    <p>
      Built with Next.js • Data from{' '}
      <a
        href="https://docs.github.com/en/rest"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        GitHub API
      </a>
    </p>
  </footer>
  ```
- [ ] Test header on mobile and desktop
- [ ] Commit: "Add page header and footer"

### Dependencies
- None

### Files Modified
- app/page.tsx

---

## US-054: Add Dark Mode Support

**As a** user
**I want** dark mode option
**So that** I can use the app comfortably at night

**Story Points:** 2
**WSJF Score:** 12 (BV:5, TC:4, RR:4, Size:1.08) - **P2**

### Acceptance Criteria

```gherkin
Given I click the dark mode toggle
When the theme changes
Then all colors should adapt
And my preference should be saved
```

### Implementation Checklist

- [ ] Install theme package: `npm install next-themes`
- [ ] Create components/ThemeProvider.tsx:
  ```typescript
  'use client';

  import { ThemeProvider as NextThemesProvider } from 'next-themes';
  import { ReactNode } from 'react';

  export function ThemeProvider({ children }: { children: ReactNode }) {
    return (
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </NextThemesProvider>
    );
  }
  ```
- [ ] Update app/layout.tsx:
  ```typescript
  import { ThemeProvider } from '@/components/ThemeProvider';

  export default function RootLayout({ children }) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider>
            <ErrorBoundary>{children}</ErrorBoundary>
          </ThemeProvider>
        </body>
      </html>
    );
  }
  ```
- [ ] Create components/ThemeToggle.tsx:
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
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    );
  }
  ```
- [ ] Update tailwind.config.ts:
  ```typescript
  module.exports = {
    darkMode: 'class',
    // ... rest of config
  };
  ```
- [ ] Add dark mode classes to components
- [ ] Test theme toggle
- [ ] Commit: "Add dark mode support"

### Dependencies
- None

### Files Created
- components/ThemeProvider.tsx
- components/ThemeToggle.tsx

### Files Modified
- app/layout.tsx
- tailwind.config.ts

---

## US-055: Add Loading Progress Indicator

**As a** user
**I want** a progress indicator
**So that** I know data is loading

**Story Points:** 1
**WSJF Score:** 13 (BV:5, TC:4, RR:5, Size:1.05) - **P2**

### Acceptance Criteria

```gherkin
Given data is loading
When I wait
Then I should see a progress bar at the top
```

### Implementation Checklist

- [ ] Install nprogress: `npm install nprogress @types/nprogress`
- [ ] Create components/ProgressBar.tsx:
  ```typescript
  'use client';

  import { useEffect } from 'react';
  import NProgress from 'nprogress';
  import 'nprogress/nprogress.css';

  NProgress.configure({ showSpinner: false });

  interface ProgressBarProps {
    loading: boolean;
  }

  export function ProgressBar({ loading }: ProgressBarProps) {
    useEffect(() => {
      if (loading) {
        NProgress.start();
      } else {
        NProgress.done();
      }

      return () => {
        NProgress.done();
      };
    }, [loading]);

    return null;
  }
  ```
- [ ] Add styles to app/globals.css:
  ```css
  #nprogress .bar {
    @apply bg-blue-600 !important;
  }

  #nprogress .peg {
    @apply shadow-[0_0_10px_#3b82f6,0_0_5px_#3b82f6] !important;
  }
  ```
- [ ] Use in app/page.tsx:
  ```typescript
  import { ProgressBar } from '@/components/ProgressBar';

  export default function Home() {
    const { loading } = useReleases(repo);

    return (
      <main>
        <ProgressBar loading={loading} />
        {/* ... rest */}
      </main>
    );
  }
  ```
- [ ] Test progress bar appears when loading
- [ ] Commit: "Add loading progress indicator"

### Dependencies
- None

### Files Created
- components/ProgressBar.tsx

### Files Modified
- app/page.tsx
- app/globals.css
- package.json

---

## US-056: Add Responsive Layout Improvements

**As a** user
**I want** optimized mobile layout
**So that** the app works great on my phone

**Story Points:** 1
**WSJF Score:** 17 (BV:7, TC:6, RR:5, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given I view on mobile
When I interact with the app
Then everything should be touch-friendly
And properly spaced
```

### Implementation Checklist

- [ ] Audit mobile layout on devices 320px-480px wide
- [ ] Update app/page.tsx spacing:
  ```typescript
  <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <header className="w-full bg-white border-b border-gray-200 py-4 md:py-6 px-4">
      {/* ... */}
    </header>

    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Content with responsive spacing */}
    </div>
  </main>
  ```
- [ ] Ensure buttons are at least 44px tall (tap target size)
- [ ] Test on actual mobile devices or Chrome DevTools
- [ ] Verify horizontal scrolling doesn't occur
- [ ] Test landscape and portrait orientations
- [ ] Commit: "Improve mobile responsive layout"

### Dependencies
- All UI components created

### Files Modified
- app/page.tsx
- Various component files

---

## US-057: Add Animations and Transitions

**As a** user
**I want** smooth animations
**So that** interactions feel polished

**Story Points:** 1
**WSJF Score:** 11 (BV:4, TC:3, RR:4, Size:1) - **P3**

### Acceptance Criteria

```gherkin
Given I interact with elements
When state changes
Then transitions should be smooth
```

### Implementation Checklist

- [ ] Add transition classes to interactive elements:
  ```typescript
  // Buttons
  className="... transition-all duration-200 hover:scale-105 active:scale-95"

  // Cards
  className="... transition-shadow duration-300 hover:shadow-lg"

  // Inputs
  className="... transition-colors duration-200 focus:ring-2"
  ```
- [ ] Add stagger animation for stats cards in StatsGrid:
  ```typescript
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
    {stats.map((stat, index) => (
      <div
        key={stat.label}
        className="animate-fadeIn"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <StatsCard {...stat} />
      </div>
    ))}
  </div>
  ```
- [ ] Add to tailwind.config.ts:
  ```typescript
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
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
- [ ] Test animations feel natural (not too fast/slow)
- [ ] Respect prefers-reduced-motion:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
- [ ] Commit: "Add animations and transitions"

### Dependencies
- All components created

### Files Modified
- tailwind.config.ts
- app/globals.css
- Various components

---

## US-058: Add Meta Tags for SEO

**As a** developer
**I want** proper meta tags
**So that** the app is discoverable

**Story Points:** 1
**WSJF Score:** 14 (BV:5, TC:5, RR:5, Size:1.05) - **P1**

### Acceptance Criteria

```gherkin
Given the app is deployed
When search engines crawl it
Then they should find proper metadata
```

### Implementation Checklist

- [ ] Update app/layout.tsx metadata:
  ```typescript
  import type { Metadata } from 'next';

  export const metadata: Metadata = {
    title: 'GitHub Releases Dashboard | Visualize Repository Release History',
    description: 'Analyze and visualize GitHub repository release patterns with interactive charts and statistics. See release frequency, trends, and more.',
    keywords: ['github', 'releases', 'dashboard', 'visualization', 'analytics'],
    authors: [{ name: 'Your Name' }],
    openGraph: {
      title: 'GitHub Releases Dashboard',
      description: 'Visualize release history and patterns for any GitHub repository',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'GitHub Releases Dashboard',
      description: 'Visualize release history and patterns for any GitHub repository',
    },
    robots: {
      index: true,
      follow: true,
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
    },
  };
  ```
- [ ] Add robots.txt in public/:
  ```
  User-agent: *
  Allow: /

  Sitemap: https://yourdomain.com/sitemap.xml
  ```
- [ ] Test with Google Rich Results Test
- [ ] Verify in browser dev tools
- [ ] Commit: "Add SEO meta tags"

### Dependencies
- None

### Files Modified
- app/layout.tsx

### Files Created
- public/robots.txt

---

# FUTURE VERSIONS (Post-MVP)

The following epics are for future versions after MVP launch.

---

# Epic 12: v1.1 Features

**Goal:** Add enhanced visualization options
**Timeline:** Week 13 (Post-MVP)
**Story Points:** 8 points total

This epic is intentionally kept brief as these are post-MVP features. The AI agent can expand these when implementing v1.1.

## US-059: Add Multiple Chart Types (F-011)

**Story Points:** 3
**WSJF Score:** 11 (BV:5, TC:3, RR:3, Size:1) - **P3**

- Add chart type selector (bar, line, timeline)
- Implement line chart for cumulative releases
- Implement timeline view
- Add smooth transitions between chart types

## US-060: Add Pre-release Filter (F-012)

**Story Points:** 2
**WSJF Score:** 10 (BV:4, TC:3, RR:3, Size:1) - **P3**

- Add checkbox to filter pre-releases
- Update stats and chart when toggled
- Tag pre-releases with badge in chart tooltips

## US-061: Add Date Range Filters (F-013)

**Story Points:** 3
**WSJF Score:** 12 (BV:5, TC:4, RR:3, Size:1) - **P3**

- Add preset buttons ("Last 6 months", "Last year", "All time")
- Add custom date range picker
- Filter data based on selected range
- Update URL with query params

---

# Epic 13: v1.2 Features

**Goal:** Add sharing and export capabilities
**Timeline:** Week 15 (Post-v1.1)
**Story Points:** 8 points total

## US-062: Add Hover Tooltips (F-014)

**Story Points:** 2
**WSJF Score:** 11 (BV:5, TC:3, RR:3, Size:1) - **P3**

- Show detailed tooltips on chart hover
- Display version number, date, and author
- Add link to GitHub release page
- Make tooltips accessible

## US-063: Add Shareable URLs (F-015)

**Story Points:** 3
**WSJF Score:** 13 (BV:6, TC:4, RR:3, Size:1) - **P3**

- Add repo name to URL (?repo=owner/repo)
- Implement URL-based initial load
- Add "Copy URL" button
- Add social sharing buttons (Twitter, LinkedIn)

## US-064: Add Export Features (F-016)

**Story Points:** 3
**WSJF Score:** 12 (BV:5, TC:4, RR:3, Size:1) - **P3**

- Add "Download chart as PNG" button
- Add "Export data as CSV" button
- Add "Copy to clipboard" option
- Implement canvas-based chart export

---

# Epic 14: v1.3 Features

**Goal:** Add advanced analytics
**Timeline:** Week 16 (Post-v1.2)
**Story Points:** 6 points total

## US-065: Add Enhanced Statistics (F-017)

**Story Points:** 3
**WSJF Score:** 11 (BV:5, TC:3, RR:3, Size:1) - **P3**

- Calculate longest gap between releases
- Calculate release velocity trend (speeding up/slowing down)
- Add consistency score metric
- Display in new stats section

## US-066: Add Recent Searches (F-018)

**Story Points:** 3
**WSJF Score:** 10 (BV:4, TC:3, RR:3, Size:1) - **P3**

- Store last 5 searches in localStorage
- Display recent searches below input
- Click to reload previous search
- Add clear history button

---

# Sprint Mapping & Roadmap

## Sprint Summary

**Total Story Points:** 135 points
**Estimated Duration:** 16 weeks
**Team Size:** 1 AI agent + optional QA

### MVP (Weeks 1-11)

| Sprint | Week | Epic | Stories | Points | Focus |
|--------|------|------|---------|--------|-------|
| Sprint 0 | Week 1 | Epic 1 | US-001 to US-008 | 15 | Project Setup |
| Sprint 1 | Weeks 3-4 | Epic 2-3 | US-009 to US-020 | 27 | Input & API |
| Sprint 2 | Weeks 5-6 | Epic 4-5 | US-021 to US-030 | 26 | Chart & Stats |
| Sprint 3 | Weeks 7-8 | Epic 6-7 | US-031 to US-040 | 18 | Errors & Performance |
| Sprint 4 | Weeks 9-10 | Epic 8-11 | US-041 to US-058 | 36 | Accessibility, Security, Polish |
| Launch | Week 11 | - | - | - | MVP Deployment |

### Post-MVP (Weeks 13-16)

| Sprint | Week | Epic | Stories | Points | Focus |
|--------|------|------|---------|--------|-------|
| Sprint 5 | Week 13 | Epic 12 | US-059 to US-061 | 8 | v1.1 Features |
| Sprint 6 | Week 15 | Epic 13 | US-062 to US-064 | 8 | v1.2 Features |
| Sprint 7 | Week 16 | Epic 14 | US-065 to US-066 | 6 | v1.3 Features |

---

## Implementation Priority

### Priority 0 (P0) - Critical Path
Must be completed first for MVP to function:
- US-001: Initialize Next.js Project
- US-004: Install Core Dependencies
- US-005: Configure Environment Variables
- US-009: Create Basic Input Component
- US-010: Add Input Validation Logic
- US-015: Create GitHub API Client
- US-016: Create API Route for Releases
- US-017: Create React Hook for Fetching Data
- US-023: Create ReleaseChart Component
- US-027: Create Stats Calculation Functions
- US-028: Create StatsCard Component
- US-049: Add Input Sanitization

### Priority 1 (P1) - High Priority
Core features that enhance usability:
- All accessibility stories (US-041 to US-045)
- All performance stories (US-036 to US-040)
- Error handling stories
- Security implementation stories
- Browser compatibility stories

### Priority 2 (P2) - Medium Priority
Nice-to-have features that improve experience:
- Animation stories
- Loading states
- Dark mode support

### Priority 3 (P3) - Low Priority
Post-MVP enhancements:
- All v1.1, v1.2, v1.3 features

---

## Dependencies Graph

```
US-001 (Next.js)
  ├─> US-002 (ESLint)
  ├─> US-003 (Structure)
  │    └─> US-015 (GitHub Client)
  │         └─> US-016 (API Route)
  │              └─> US-017 (React Hook)
  ├─> US-004 (Dependencies)
  │    ├─> US-021 (Recharts)
  │    │    └─> US-022 (Data Transform)
  │    │         └─> US-023 (Chart Component)
  │    └─> US-027 (Stats Calc)
  │         └─> US-028 (Stats Component)
  ├─> US-005 (Environment)
  │    └─> US-006 (Redis)
  │         └─> US-050 (Rate Limiting)
  └─> US-009 (Input Component)
       └─> US-010 (Validation)
            └─> US-049 (Sanitization)
```

---

## Success Criteria

### MVP Launch (Week 11)

**Functional Requirements:**
- [x] User can enter repository name
- [x] System fetches releases from GitHub API
- [x] Chart displays releases per month
- [x] Stats show key metrics
- [x] Errors handled gracefully
- [x] Works on all major browsers
- [x] Passes WCAG AA accessibility
- [x] Lighthouse score > 90

**Non-Functional Requirements:**
- [x] Page loads in < 2 seconds
- [x] Chart renders in < 1.5 seconds
- [x] No critical security vulnerabilities
- [x] 70%+ test coverage
- [x] Deployed to production

### Post-MVP Success Metrics

**Week 13 (v1.1):**
- 30% of users try multiple chart types
- 20% use pre-release filter

**Week 15 (v1.2):**
- 15% share URLs
- 10% export data

**Week 16 (v1.3):**
- 1,000 weekly active users
- 25% return rate
- >4.2/5 user satisfaction

---

## Final Notes for AI Coding Agent

### Implementation Order

1. **Start with infrastructure** (US-001 to US-008)
   - Get the project running first
   - Set up all tools and dependencies
   - Verify environment configuration

2. **Build core functionality** (US-009 to US-020)
   - Input → API → Data flow
   - Test each piece before moving forward

3. **Add visualization** (US-021 to US-030)
   - Chart first, then stats
   - Make sure data transformation works correctly

4. **Handle errors** (US-031 to US-035)
   - Test all error scenarios
   - Ensure graceful degradation

5. **Optimize** (US-036 to US-040)
   - Run Lighthouse audits
   - Fix performance bottlenecks

6. **Polish** (US-041 to US-058)
   - Accessibility is critical
   - Security cannot be skipped
   - UI polish makes it production-ready

7. **Test everything** (US-046, US-047)
   - Run E2E tests
   - Manual testing on multiple browsers

8. **Deploy MVP** (Week 11)
   - Follow deployment checklist
   - Monitor errors

9. **Post-MVP** (Weeks 13-16)
   - Implement based on user feedback
   - Follow priority rankings

### Key Reminders

- **Every user story is 1 story point** (1 day of work max)
- **Follow Definition of Done** for each story
- **Mark dependencies** before starting a story
- **Test after each story** completes
- **Commit frequently** with clear messages
- **Security and accessibility** are not optional
- **Performance targets** must be met

### When Stuck

1. Re-read the acceptance criteria
2. Check the PRD for additional context
3. Look at dependencies - did they complete properly?
4. Break the story into smaller tasks
5. Test incrementally

---

## Document End

**Version:** 1.0
**Total User Stories:** 66
**Total Story Points:** 135
**Estimated Duration:** 16 weeks
**Created:** November 7, 2025
**Status:** Ready for implementation

---

**For the AI Coding Agent:**

This document contains EVERY detail needed to build the GitHub Releases Dashboard from scratch. Each user story is designed to be implemented in 1 day or less. Follow them sequentially within each sprint, respecting dependencies. Mark checkboxes as you complete tasks. Good luck! 🚀
