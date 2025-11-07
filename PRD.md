# GitHub Releases Dashboard - Product Requirements Document

**Version:** 1.0
**Date:** November 7, 2025
**Status:** Ready for Development

---

## Document Overview

This PRD translates business requirements into detailed product specs.

**Source:** BRD.md v2.0
**Target:** Development team
**Timeline:** 16 weeks (5 phases)

---

## 1. Feature Breakdown (Kano Model)

We classify features by user satisfaction impact.

### Basic Features (Must Have)

Users expect these. Missing them causes dissatisfaction.

| Feature ID | Feature Name | Category | Priority | Release |
|------------|--------------|----------|----------|---------|
| F-001 | Repository Input | Basic | P0 | MVP |
| F-002 | GitHub API Integration | Basic | P0 | MVP |
| F-003 | Chart Visualization | Basic | P0 | MVP |
| F-004 | Release Statistics | Basic | P0 | MVP |
| F-005 | Error Handling | Basic | P0 | MVP |
| F-006 | Performance Baseline | Basic | P0 | MVP |
| F-007 | Accessibility Support | Basic | P0 | MVP |
| F-008 | Browser Compatibility | Basic | P0 | MVP |
| F-009 | Security Baseline | Basic | P0 | MVP |
| F-010 | Basic UI/UX | Basic | P0 | MVP |

**Kano insight:** These are table stakes. No delight, but required.

---

### Performance Features (Should Have)

Better performance = higher satisfaction. Linear relationship.

| Feature ID | Feature Name | Category | Priority | Release |
|------------|--------------|----------|----------|---------|
| F-011 | Multiple Chart Types | Performance | P1 | v1.1 |
| F-012 | Pre-release Filtering | Performance | P1 | v1.1 |
| F-013 | Date Range Selection | Performance | P1 | v1.1 |
| F-014 | Hover Tooltips | Performance | P1 | v1.2 |
| F-015 | Shareable URLs | Performance | P1 | v1.2 |
| F-016 | Export Capabilities | Performance | P1 | v1.2 |
| F-017 | Enhanced Stats Panel | Performance | P1 | v1.3 |
| F-018 | Recent Search History | Performance | P2 | v1.3 |

**Kano insight:** More features = more value. Predictable satisfaction boost.

---

### Excitement Features (Could Have)

Unexpected features. High delight when present, no harm when absent.

| Feature ID | Feature Name | Category | Priority | Release |
|------------|--------------|----------|----------|---------|
| F-019 | Multi-Repo Comparison | Excitement | P2 | v2.0 |
| F-020 | Repository Autocomplete | Excitement | P2 | v2.0 |
| F-021 | Calendar Heatmap View | Excitement | P2 | v2.0 |
| F-022 | Embed Code Generator | Excitement | P2 | v2.1 |
| F-023 | Dark Mode | Excitement | P2 | v2.1 |
| F-024 | Predictive Analytics | Excitement | P3 | v2.2 |
| F-025 | Release Notifications | Excitement | P3 | v2.2 |
| F-026 | Private Repo Access | Excitement | P3 | v2.3 |

**Kano insight:** These create "wow" moments. Build after basics are solid.

---

## 2. Functional Requirements

Detailed specs for each feature.

### F-001: Repository Input

**What it does:**
Accepts GitHub repo names and validates format.

**Functional specs:**

**FR-001-01: Input Field**
- Single text input field
- Placeholder: "username/repo-name"
- Auto-focus on page load
- Supports copy-paste

**FR-001-02: Format Validation**
- Pattern: `^[a-zA-Z0-9_-]+/[a-zA-Z0-9_.-]+$`
- Real-time validation (on blur)
- Show error icon for invalid format
- Disable submit until valid

**FR-001-03: Submit Mechanism**
- Submit button labeled "Analyze"
- Enter key triggers submit
- Button disabled during loading
- Show loading state

**FR-001-04: Error Messages**
- "Invalid format. Use: username/repo-name"
- "Repository not found"
- "Private repo or no releases available"

**FR-001-05: Examples**
- Show 3 example repos below input
- Click example to auto-populate
- Examples: facebook/react, vuejs/core, angular/angular

**Input behavior:**
```
Valid inputs:
✓ facebook/react
✓ microsoft/vscode
✓ apache/kafka
✓ my-org/my-repo

Invalid inputs:
✗ facebook (missing repo)
✗ /react (missing owner)
✗ facebook/react/extra (too many slashes)
✗ facebook react (space not allowed)
```

**Dependencies:** None

---

### F-002: GitHub API Integration

**What it does:**
Fetches release data from GitHub REST API.

**Functional specs:**

**FR-002-01: API Endpoint**
- Endpoint: `GET https://api.github.com/repos/{owner}/{repo}/releases`
- Method: GET
- Timeout: 10 seconds
- Retry: 2 attempts with exponential backoff

**FR-002-02: Request Headers**
```
Accept: application/vnd.github.v3+json
User-Agent: GitHub-Releases-Dashboard/1.0
```

**FR-002-03: Response Parsing**
Extract these fields:
- `tag_name` → Version number
- `name` → Release title
- `published_at` → Release date (ISO 8601)
- `created_at` → Creation date
- `prerelease` → Boolean flag
- `draft` → Boolean flag (ignore drafts)

**FR-002-04: Data Filtering**
- Exclude draft releases
- Include pre-releases by default
- Sort by `published_at` descending

**FR-002-05: Error Handling**
- 404: "Repository not found"
- 403: "Rate limit exceeded. Try again in X minutes."
- 500: "GitHub API error. Try again later."
- Network error: "Connection failed. Check your internet."

**FR-002-06: Rate Limit Management**
- Check `X-RateLimit-Remaining` header
- Show warning at 10 requests remaining
- Display reset time from `X-RateLimit-Reset`
- Cache responses (see caching spec)

**FR-002-07: Caching Strategy**
- Cache key: `releases:{owner}:{repo}`
- TTL: 24 hours (86400 seconds)
- Use ETags for conditional requests
- Store in Redis

**API response structure:**
```json
[
  {
    "tag_name": "v19.0.0",
    "name": "19.0.0 (Nov 1, 2025)",
    "published_at": "2025-11-01T14:30:00Z",
    "prerelease": false,
    "draft": false
  }
]
```

**Dependencies:** Redis cache, GitHub API access

---

### F-003: Chart Visualization

**What it does:**
Displays release frequency as an interactive chart.

**Functional specs:**

**FR-003-01: Chart Library**
- Use Recharts (React charting library)
- Responsive container
- SVG rendering

**FR-003-02: Primary Chart Type**
- Type: Bar chart
- X-axis: Time periods (months)
- Y-axis: Number of releases
- Bars: Colored by frequency (gradient)

**FR-003-03: Time Aggregation**
- Group releases by month
- Show last 12 months by default
- Auto-adjust if data is < 12 months
- Format: "Jan 2025", "Feb 2025"

**FR-003-04: Chart Styling**
- Primary color: #3b82f6 (blue-500)
- Grid lines: Light gray (#e5e7eb)
- Font: System font stack
- Bar radius: 4px (rounded corners)

**FR-003-05: Responsive Behavior**
- Desktop: 800px width
- Tablet: 600px width
- Mobile: 100% width (min 320px)
- Maintain aspect ratio 16:9

**FR-003-06: Empty State**
- Show message: "No releases found"
- Display helper text
- Show example repos

**FR-003-07: Chart Interactions**
- Hover: Highlight bar
- Click: Show release details
- Touch: Same as click (mobile)

**Chart data format:**
```javascript
[
  { month: "Jan 2025", count: 3 },
  { month: "Feb 2025", count: 5 },
  { month: "Mar 2025", count: 2 }
]
```

**Dependencies:** F-002 (API data)

---

### F-004: Release Statistics

**What it does:**
Calculates and displays key metrics.

**Functional specs:**

**FR-004-01: Total Releases**
- Count all non-draft releases
- Display as: "142 releases"
- Prominent display

**FR-004-02: Average Time Between Releases**
- Calculate: Total days / (releases - 1)
- Display as: "14 days average"
- Handle edge cases (0 or 1 release)

**FR-004-03: Releases Per Month**
- Calculate: Total releases / months active
- Display as: "2.3 per month"
- Round to 1 decimal

**FR-004-04: Last Release Date**
- Show most recent release date
- Format: "Last release: 3 days ago"
- Use relative time (moment.js style)

**FR-004-05: First Release Date**
- Show oldest release date
- Format: "First release: Jan 15, 2020"
- Absolute date format

**FR-004-06: Statistics Layout**
- 2x2 grid on desktop
- 1 column on mobile
- Cards with icons
- Hover effect

**Calculation examples:**
```
Total: 142 releases
First: Jan 1, 2020
Last: Nov 1, 2025
Days active: 2130 days

Average: 2130 / 141 = 15.1 days
Per month: 142 / 71 = 2.0 per month
```

**Dependencies:** F-002 (API data)

---

### F-005: Error Handling

**What it does:**
Shows user-friendly errors for all failure scenarios.

**Functional specs:**

**FR-005-01: Error Types**

| Error Code | Message | Action |
|------------|---------|--------|
| ERR-001 | "Invalid format. Use: username/repo-name" | Show inline error |
| ERR-002 | "Repository not found" | Show error card |
| ERR-003 | "Rate limit exceeded. Resets in 45 minutes." | Show error card + timer |
| ERR-004 | "Network error. Check your connection." | Show error card + retry |
| ERR-005 | "GitHub API unavailable. Try again later." | Show error card + retry |
| ERR-006 | "No releases found for this repo" | Show empty state |

**FR-005-02: Error Display**
- Toast notification for minor errors
- Error card for major errors
- Inline validation for input errors
- Console logging for debugging

**FR-005-03: Error Recovery**
- Retry button for network errors
- Clear button to reset
- Auto-retry for transient errors (max 2 attempts)

**FR-005-04: Error Logging**
- Log to console (dev mode)
- Log to Sentry (production)
- Include context: repo name, timestamp, user agent

**Error UI components:**
```
┌─────────────────────────────┐
│ ⚠️  Error                    │
│                             │
│ Repository not found        │
│                             │
│ [Try Another Repo] [Clear]  │
└─────────────────────────────┘
```

**Dependencies:** Sentry (error tracking)

---

### F-006: Performance Baseline

**What it does:**
Ensures fast load and render times.

**Functional specs:**

**FR-006-01: Page Load Performance**
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

**FR-006-02: Chart Render Performance**
- Initial render: < 1.5s
- Re-render on filter: < 500ms
- Animation: 60fps (16.67ms per frame)

**FR-006-03: API Response Time**
- Cache hit: < 100ms
- Cache miss (GitHub API): < 3s
- Timeout threshold: 10s

**FR-006-04: Asset Optimization**
- Code splitting: Lazy load Recharts
- Image optimization: Next.js Image component
- Font loading: System fonts (no web fonts)
- CSS: Tailwind purge (< 10kb)

**FR-006-05: Bundle Size**
- Total JS: < 150kb gzipped
- Initial load: < 50kb gzipped
- Recharts: Lazy loaded on demand

**FR-006-06: Performance Monitoring**
- Real User Monitoring (RUM)
- Lighthouse CI on every deploy
- Minimum score: 90
- Alert if score drops below 85

**Performance budget:**
```
Max sizes:
- HTML: 5kb
- CSS: 10kb
- JS (initial): 50kb
- JS (total): 150kb
- Images: 0kb (none in MVP)
```

**Dependencies:** Vercel Analytics, Lighthouse CI

---

### F-007: Accessibility Support

**What it does:**
Makes the app usable for all users.

**Functional specs:**

**FR-007-01: Keyboard Navigation**
- Tab through all interactive elements
- Enter to submit form
- Escape to close modals/tooltips
- Arrow keys for chart navigation

**FR-007-02: Screen Reader Support**
- Semantic HTML elements
- ARIA labels on all inputs
- ARIA live regions for dynamic content
- Alt text for all images (if any)

**FR-007-03: Focus Management**
- Visible focus indicators
- Focus outline: 2px solid #3b82f6
- Focus trap in modals
- Skip to content link

**FR-007-04: Color Contrast**
- Text: 4.5:1 minimum ratio
- Large text: 3:1 minimum
- Interactive elements: 3:1
- Test with WCAG contrast checker

**FR-007-05: Text Scaling**
- Support up to 200% zoom
- No horizontal scrolling
- Responsive breakpoints
- Min font size: 14px

**FR-007-06: Motion Preferences**
- Respect `prefers-reduced-motion`
- Disable animations if set
- Instant transitions instead

**ARIA labels example:**
```html
<input
  type="text"
  aria-label="GitHub repository name"
  aria-describedby="input-help"
  aria-invalid={hasError}
/>
<button aria-label="Analyze repository">
  Analyze
</button>
```

**Dependencies:** Testing with screen readers (NVDA, VoiceOver)

---

### F-008: Browser Compatibility

**What it does:**
Works on all modern browsers.

**Functional specs:**

**FR-008-01: Supported Browsers**
- Chrome 120+ (Dec 2023)
- Firefox 121+ (Dec 2023)
- Safari 17+ (Sep 2023)
- Edge 120+ (Dec 2023)

**FR-008-02: Mobile Browsers**
- iOS Safari 17+
- Chrome Mobile 120+
- Samsung Internet 23+

**FR-008-03: Feature Detection**
- Check for Fetch API
- Check for ES6 support
- Show upgrade message if missing
- Graceful degradation

**FR-008-04: Polyfills**
- None needed (Next.js handles this)
- Target ES2020 compilation

**FR-008-05: Testing Matrix**
- BrowserStack for manual testing
- Playwright for automated tests
- Test on real devices (iOS, Android)

**Unsupported browsers:**
- IE 11 (show upgrade message)
- Chrome < 90
- Safari < 14

**Dependencies:** BrowserStack, Playwright

---

### F-009: Security Baseline

**What it does:**
Protects users and the application.

**Functional specs:**

**FR-009-01: HTTPS Only**
- Force HTTPS redirect
- HSTS header enabled
- Secure cookies only

**FR-009-02: Content Security Policy**
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  connect-src 'self' https://api.github.com;
  img-src 'self' data:;
```

**FR-009-03: No Sensitive Data Storage**
- No cookies with user data
- LocalStorage: Only search history
- No PII collected

**FR-009-04: API Key Protection**
- No API keys in frontend
- Server-side API calls only
- GitHub API requests via Next.js API routes

**FR-009-05: Input Sanitization**
- Sanitize all user inputs
- Prevent XSS attacks
- Escape special characters

**FR-009-06: Dependency Security**
- Dependabot alerts enabled
- npm audit on every PR
- No critical vulnerabilities

**FR-009-07: Rate Limiting**
- Client-side: 10 requests/minute
- Server-side: 100 requests/hour per IP
- Show friendly message when limited

**Security headers:**
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

**Dependencies:** Next.js security features, Snyk

---

### F-010: Basic UI/UX

**What it does:**
Provides clean, intuitive interface.

**Functional specs:**

**FR-010-01: Layout Structure**
```
┌─────────────────────────────────────┐
│ Header: Logo + Title                │
├─────────────────────────────────────┤
│ Input Section                        │
│ ┌─────────────────────┐              │
│ │ username/repo-name  │ [Analyze]    │
│ └─────────────────────┘              │
├─────────────────────────────────────┤
│ Stats Cards (4 metrics)              │
├─────────────────────────────────────┤
│ Chart Visualization                  │
│                                      │
│   ████████                           │
│   ██████████                         │
│   ████████████                       │
│                                      │
└─────────────────────────────────────┘
```

**FR-010-02: Color Palette**
- Primary: #3b82f6 (blue-500)
- Secondary: #8b5cf6 (violet-500)
- Success: #10b981 (green-500)
- Error: #ef4444 (red-500)
- Background: #ffffff (white)
- Text: #1f2937 (gray-800)

**FR-010-03: Typography**
- Font family: System UI stack
- Heading: 24px, 600 weight
- Body: 16px, 400 weight
- Small: 14px, 400 weight

**FR-010-04: Spacing**
- Base unit: 4px
- Padding: 16px (4 units)
- Margin: 24px (6 units)
- Gap: 16px (4 units)

**FR-010-05: Loading States**
- Spinner on button during fetch
- Skeleton loaders for chart
- Progress indicator for slow loads

**FR-010-06: Mobile Responsive**
- Breakpoints: 640px, 768px, 1024px
- Stack layout on mobile
- Touch-friendly buttons (44px min)

**FR-010-07: Animations**
- Fade in: 200ms ease
- Slide in: 300ms ease-out
- Chart render: 500ms ease-in-out
- Respect reduced motion

**Component hierarchy:**
```
Page
├── Header
│   ├── Logo
│   └── Title
├── InputSection
│   ├── Input
│   └── Button
├── StatsGrid
│   ├── StatCard (Total)
│   ├── StatCard (Average)
│   ├── StatCard (Per Month)
│   └── StatCard (Last Release)
└── ChartSection
    └── BarChart
```

**Dependencies:** Tailwind CSS, Headless UI

---

## 3. Non-Functional Requirements

System-wide quality attributes.

### NFR-001: Performance

**Metrics:**
- Page load: < 2s (p95)
- Chart render: < 1.5s
- API response: < 3s
- Time to Interactive: < 3.5s

**How we achieve it:**
- Next.js SSR for fast initial load
- Code splitting for smaller bundles
- Redis caching for API responses
- CDN (Vercel Edge) for static assets
- Lazy loading for chart library

**Measurement:**
- Lighthouse CI: Minimum score 90
- Real User Monitoring: Vercel Analytics
- Synthetic monitoring: Hourly checks

---

### NFR-002: Scalability

**Capacity:**
- 10,000 daily active users
- 50,000 chart views/day
- 100,000 API requests/day

**Scaling strategy:**
- Serverless functions (auto-scale)
- Redis caching (reduce API calls by 90%)
- CDN for static content
- GitHub API rate limit: 5000/hour (authenticated)

**Bottlenecks:**
- GitHub API rate limits (mitigated with caching)
- Redis memory (scale vertically if needed)

---

### NFR-003: Reliability

**Uptime target:** 99.5% (43 hours downtime/year)

**Failure scenarios:**
- GitHub API down: Show cached data + warning
- Redis down: Fallback to direct API calls
- Vercel down: Deploy on backup (Netlify)

**Monitoring:**
- Uptime checks: Every 5 minutes (UptimeRobot)
- Error tracking: Sentry (95% threshold)
- Alerts: Slack webhook

---

### NFR-004: Security

**Standards:**
- OWASP Top 10 compliance
- HTTPS everywhere
- No sensitive data storage
- CSP headers enabled

**Audits:**
- npm audit: Weekly
- Snyk scan: On every PR
- Security review: Before launch

**Incident response:**
- P0 (critical): Fix within 4 hours
- P1 (high): Fix within 24 hours
- P2 (medium): Fix within 1 week

---

### NFR-005: Accessibility

**Standard:** WCAG 2.1 AA

**Requirements:**
- Keyboard navigation
- Screen reader support
- Color contrast 4.5:1
- Focus indicators
- Alt text for images

**Testing:**
- Lighthouse accessibility: Score > 90
- Manual testing: NVDA, VoiceOver
- Automated tests: axe-core

---

### NFR-006: Maintainability

**Code quality:**
- TypeScript for type safety
- ESLint + Prettier for consistency
- Test coverage: > 70%
- Documentation: All components

**Architecture:**
- Component-based (React)
- Clear separation of concerns
- No circular dependencies
- Modular design

**Deployment:**
- CI/CD: GitHub Actions
- Automated tests on PR
- Preview deployments
- Zero-downtime releases

---

### NFR-007: Compatibility

**Browsers:**
- Last 2 versions of major browsers
- 95% browser coverage (caniuse.com)

**Devices:**
- Desktop: 1920x1080 to 1280x720
- Tablet: 1024x768 to 768x1024
- Mobile: 375x667 to 414x896

**Networks:**
- Fast 3G minimum
- Offline: Show cached data

---

## 4. User Workflows & Journeys

Detailed flows for each user type.

### Workflow 1: First-Time User

**User type:** Developer evaluating a library

**Goal:** Check if a library is actively maintained

**Journey:**

```
1. Land on homepage
   ↓
2. See input field + examples
   ↓
3. Click example "facebook/react"
   OR
   Type own repo name
   ↓
4. Click "Analyze" button
   ↓
5. [Loading state]
   ↓
6. View results:
   - Stats card shows "Last release: 2 days ago"
   - Chart shows consistent releases
   ↓
7. Decision: Library is active ✓
   ↓
8. [Optional] Bookmark URL
   ↓
9. Close tab (task complete)
```

**Pain points:**
- Unclear input format → Fix: Show examples
- Slow loading → Fix: <3s target
- Can't share results → Fix: Shareable URLs (v1.2)

**Success criteria:**
- User completes journey in < 30 seconds
- User understands result immediately
- > 90% task completion rate

---

### Workflow 2: Engineering Manager

**User type:** Engineering Manager

**Goal:** Track team's release velocity

**Journey:**

```
1. Bookmark team's repo URL
   ↓
2. Visit bookmark weekly
   ↓
3. Check stats:
   - "2.3 releases per month"
   - "Last release: 5 days ago"
   ↓
4. View chart trends:
   - Compare to last month
   - Spot slowdowns
   ↓
5. [Optional] Export chart for presentation
   ↓
6. Share URL with team/executives
   ↓
7. Return next week
```

**Pain points:**
- Can't export chart → Fix: Export feature (v1.2)
- Can't compare to history → Fix: Date range filter (v1.1)
- Manual weekly check → Fix: Notifications (v2.2)

**Success criteria:**
- < 10 seconds to get insights
- Shareable with stakeholders
- 25% return rate

---

### Workflow 3: OSS Maintainer

**User type:** Open Source Maintainer

**Goal:** Prove project health to potential users

**Journey:**

```
1. Generate chart for own project
   ↓
2. Copy shareable URL
   ↓
3. Add to README:
   "📊 [Release History](link)"
   ↓
4. Potential users click link
   ↓
5. See active project:
   - Regular releases
   - Recent activity
   ↓
6. Increased trust → More adoption
```

**Pain points:**
- Can't embed chart → Fix: Embed codes (v2.1)
- URL is long → Fix: Short links (v2.1)
- No badge → Fix: Badge generator (v2.1)

**Success criteria:**
- Easy to share in README
- Builds credibility
- Increases project adoption

---

### User Story Map

```
                BACKBONE: USER GOALS
                ┌─────────────────────────────────────┐
                │  Discover   Analyze   Understand    │
                │  Project    Releases  Patterns      │
                └─────────────────────────────────────┘
                           ↓
WALKING         ┌─────────────────────────────────────┐
SKELETON        │  Enter repo → View chart → Read stats│
(MVP)           └─────────────────────────────────────┘
                           ↓
RELEASE 1.1     ┌─────────────────────────────────────┐
                │  Filter dates → Switch chart types  │
                │  Hide pre-releases                   │
                └─────────────────────────────────────┘
                           ↓
RELEASE 1.2     ┌─────────────────────────────────────┐
                │  Share URL → Export chart → Hover   │
                │  details → Recent searches           │
                └─────────────────────────────────────┘
                           ↓
RELEASE 2.0     ┌─────────────────────────────────────┐
                │  Compare repos → Autocomplete →     │
                │  Calendar view → Dark mode           │
                └─────────────────────────────────────┘
```

---

## 5. Technical Architecture

High-level system design.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│  ┌────────────────────────────────────────────────┐     │
│  │  Next.js 14 (React)                            │     │
│  │  ├── Pages: / (index)                          │     │
│  │  ├── Components: Input, Chart, Stats, Error    │     │
│  │  ├── Hooks: useReleaseData, useChart           │     │
│  │  └── Utils: formatDate, calculateStats         │     │
│  └────────────────────────────────────────────────┘     │
│                        ↓ HTTP                           │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                   API LAYER (Vercel)                    │
│  ┌────────────────────────────────────────────────┐     │
│  │  Next.js API Routes                            │     │
│  │  ├── /api/releases/[owner]/[repo]              │     │
│  │  │   ├── Check cache                           │     │
│  │  │   ├── Fetch from GitHub if miss             │     │
│  │  │   └── Return data                           │     │
│  │  └── /api/health (monitoring)                  │     │
│  └────────────────────────────────────────────────┘     │
│                        ↓                                │
└─────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────┐      ┌──────────────────────────┐
│   CACHE (Redis)      │      │  EXTERNAL API (GitHub)   │
│  ┌────────────────┐  │      │ ┌──────────────────────┐ │
│  │ Upstash Redis  │  │      │ │ api.github.com       │ │
│  │ TTL: 24h       │  │      │ │ /repos/:owner/:repo/ │ │
│  │ Key: repo name │  │      │ │ /releases            │ │
│  └────────────────┘  │      │ └──────────────────────┘ │
└──────────────────────┘      └──────────────────────────┘
         ↑                                  ↑
         └──────── Cache hit ───────────────┘
```

### Component Architecture

```
src/
├── app/
│   ├── page.tsx                 # Main page
│   ├── layout.tsx               # Root layout
│   └── api/
│       └── releases/
│           └── [owner]/
│               └── [repo]/
│                   └── route.ts  # API endpoint
├── components/
│   ├── RepoInput.tsx            # Input form
│   ├── ReleaseChart.tsx         # Chart component
│   ├── StatsGrid.tsx            # Stats cards
│   ├── ErrorMessage.tsx         # Error display
│   └── LoadingSpinner.tsx       # Loading state
├── hooks/
│   ├── useReleaseData.ts        # Data fetching
│   └── useChartData.ts          # Data transformation
├── lib/
│   ├── github.ts                # GitHub API client
│   ├── cache.ts                 # Redis cache
│   ├── stats.ts                 # Calculations
│   └── types.ts                 # TypeScript types
└── utils/
    ├── format.ts                # Date formatting
    └── validate.ts              # Input validation
```

### Data Flow

```
1. User enters repo name
   ↓
2. Client validates format
   ↓
3. Client calls /api/releases/[owner]/[repo]
   ↓
4. Server checks Redis cache
   ├─ Cache hit → Return data (100ms)
   └─ Cache miss ↓
      ├─ Call GitHub API
      ├─ Store in cache (TTL: 24h)
      └─ Return data (2-3s)
   ↓
5. Client receives data
   ↓
6. Client transforms data:
   ├─ Calculate stats
   └─ Group by month
   ↓
7. Client renders:
   ├─ Stats cards
   └─ Chart
```

### Technology Decisions

| Component | Technology | Why |
|-----------|-----------|-----|
| Framework | Next.js 14 | SSR, API routes, optimized |
| UI Library | React 18 | Component model, ecosystem |
| Styling | Tailwind CSS | Fast, utility-first, small |
| Charts | Recharts | React-native, customizable |
| Cache | Redis (Upstash) | Fast, serverless-friendly |
| Hosting | Vercel | Next.js optimized, CDN |
| Monitoring | Sentry + Vercel | Error tracking + analytics |
| Testing | Jest + Playwright | Unit + E2E coverage |

### Scalability Plan

**Current capacity:**
- 10K DAU
- 50K requests/day

**Scaling triggers:**
- > 80% CPU → Add serverless capacity (auto)
- > 80% Redis memory → Upgrade plan
- > 80% API quota → Add GitHub auth

**Scaling path:**
```
MVP (10K DAU)
  ↓
v1.x (50K DAU) → Add CDN caching
  ↓
v2.x (100K DAU) → Add read replicas
  ↓
v3.x (500K DAU) → Microservices split
```

---

## 6. Acceptance Criteria (Gherkin)

Testable specs for each feature.

### Feature: F-001 Repository Input

**Scenario 1: Valid repo name**
```gherkin
Given I am on the homepage
When I enter "facebook/react" in the input field
And I click the "Analyze" button
Then the input should be accepted
And the API should be called with "facebook/react"
And the chart should be displayed
```

**Scenario 2: Invalid format**
```gherkin
Given I am on the homepage
When I enter "invalid-format" in the input field
And I click the "Analyze" button
Then I should see an error message
And the message should say "Invalid format. Use: username/repo-name"
And the API should not be called
```

**Scenario 3: Empty input**
```gherkin
Given I am on the homepage
When I leave the input field empty
And I click the "Analyze" button
Then the button should be disabled
And no error message should appear
```

**Scenario 4: Submit with Enter key**
```gherkin
Given I am on the homepage
When I enter "vuejs/core" in the input field
And I press the Enter key
Then the form should submit
And the chart should load
```

---

### Feature: F-002 GitHub API Integration

**Scenario 1: Successful API call**
```gherkin
Given the GitHub API is available
When I request data for "facebook/react"
Then the API should return 200 OK
And the response should contain release data
And the data should be cached for 24 hours
```

**Scenario 2: Repository not found**
```gherkin
Given I request data for "invalid/notfound"
When the GitHub API returns 404
Then I should see "Repository not found"
And no chart should be displayed
```

**Scenario 3: Rate limit exceeded**
```gherkin
Given I have exceeded the GitHub API rate limit
When I request data for any repository
Then the API should return 403
And I should see "Rate limit exceeded. Resets in X minutes."
And the reset time should be displayed
```

**Scenario 4: Cache hit**
```gherkin
Given "facebook/react" data is cached
And the cache has not expired
When I request "facebook/react"
Then the data should be returned from cache
And the response time should be < 100ms
And GitHub API should not be called
```

**Scenario 5: Cache miss**
```gherkin
Given "vuejs/core" data is not cached
When I request "vuejs/core"
Then the GitHub API should be called
And the response should be cached
And subsequent requests should hit cache
```

---

### Feature: F-003 Chart Visualization

**Scenario 1: Display bar chart**
```gherkin
Given I have loaded release data for "facebook/react"
When the chart renders
Then I should see a bar chart
And the X-axis should show months
And the Y-axis should show release counts
And bars should be colored blue
```

**Scenario 2: Empty data**
```gherkin
Given a repository has no releases
When I load the chart
Then I should see "No releases found"
And no bars should be displayed
And example repos should be suggested
```

**Scenario 3: Mobile responsive**
```gherkin
Given I am on a mobile device (375px width)
When I view the chart
Then the chart should fit the screen width
And all labels should be readable
And no horizontal scrolling should occur
```

**Scenario 4: Chart renders within time**
```gherkin
Given I have release data
When the chart starts rendering
Then it should complete within 1.5 seconds
And animations should be smooth (60fps)
```

---

### Feature: F-004 Release Statistics

**Scenario 1: Calculate total releases**
```gherkin
Given a repo has 142 releases
When I view the stats
Then "Total releases" should show "142"
And the count should exclude draft releases
```

**Scenario 2: Calculate average time**
```gherkin
Given a repo has:
  | First release | Jan 1, 2020  |
  | Last release  | Nov 1, 2025  |
  | Total releases| 142          |
When I view the stats
Then "Average time" should show "15 days"
And the calculation should be accurate
```

**Scenario 3: Handle edge case (single release)**
```gherkin
Given a repo has only 1 release
When I view the stats
Then "Average time" should show "N/A"
And "Releases per month" should show "0.1"
```

---

### Feature: F-005 Error Handling

**Scenario 1: Network error**
```gherkin
Given my internet connection is lost
When I try to fetch repo data
Then I should see "Network error. Check your connection."
And a "Retry" button should appear
And clicking retry should attempt again
```

**Scenario 2: GitHub API down**
```gherkin
Given GitHub API returns 500 error
When I fetch repo data
Then I should see "GitHub API unavailable. Try again later."
And the error should be logged to Sentry
```

---

### Feature: F-006 Performance

**Scenario 1: Page load time**
```gherkin
Given I visit the homepage
When the page loads
Then First Contentful Paint should occur < 1.5s
And Largest Contentful Paint should occur < 2.5s
And Time to Interactive should be < 3.5s
```

**Scenario 2: Lighthouse score**
```gherkin
Given the site is deployed
When I run Lighthouse audit
Then Performance score should be > 90
And Accessibility score should be > 90
And Best Practices score should be > 90
```

---

### Feature: F-007 Accessibility

**Scenario 1: Keyboard navigation**
```gherkin
Given I am on the homepage
When I press Tab
Then focus should move to the input field
And a visible focus outline should appear
When I press Tab again
Then focus should move to the button
When I press Enter
Then the form should submit
```

**Scenario 2: Screen reader**
```gherkin
Given I am using a screen reader
When I navigate the page
Then the input should announce "GitHub repository name"
And the button should announce "Analyze repository"
And chart data should be announced as a table
```

**Scenario 3: Color contrast**
```gherkin
Given the page is rendered
When I check color contrast
Then all text should have 4.5:1 ratio
And interactive elements should have 3:1 ratio
And Lighthouse accessibility should score > 90
```

---

### Feature: F-008 Browser Compatibility

**Scenario 1: Chrome desktop**
```gherkin
Given I am using Chrome 120
When I visit the site
Then all features should work
And no console errors should appear
```

**Scenario 2: Safari iOS**
```gherkin
Given I am using Safari on iPhone 13
When I visit the site
Then the layout should be responsive
And touch interactions should work
And the chart should render correctly
```

---

### Feature: F-009 Security

**Scenario 1: HTTPS enforcement**
```gherkin
Given I visit http://example.com
When the page loads
Then I should be redirected to https://example.com
And the connection should be secure
```

**Scenario 2: XSS prevention**
```gherkin
Given I enter "<script>alert('xss')</script>" in input
When the input is processed
Then the script should not execute
And the input should be sanitized
```

**Scenario 3: No API keys exposed**
```gherkin
Given the site is deployed
When I view page source
Then no API keys should be visible
And all API calls should go through server
```

---

### Feature: F-010 Basic UI

**Scenario 1: Mobile layout**
```gherkin
Given I am on a mobile device (375px)
When I view the page
Then stats should stack vertically
And the input should be full-width
And buttons should be at least 44px tall
```

**Scenario 2: Loading state**
```gherkin
Given I click "Analyze"
When data is fetching
Then the button should show a spinner
And the button should be disabled
And "Loading..." text should appear
```

---

## 7. Release Strategy & Roadmap

Incremental rollout plan.

### Release Timeline

```
MVP (Week 11)
  └─ All "Must Have" features
  └─ Core functionality only
  └─ 100 beta users
     ↓
v1.1 (Week 13)
  └─ Multiple chart types
  └─ Pre-release filtering
  └─ Date range selection
     ↓
v1.2 (Week 15)
  └─ Shareable URLs
  └─ Export capabilities
  └─ Hover tooltips
     ↓
v1.3 (Week 16)
  └─ Enhanced stats
  └─ Recent searches
     ↓
v2.0 (Month 5)
  └─ Multi-repo comparison
  └─ Autocomplete
  └─ Calendar view
     ↓
v2.1 (Month 6)
  └─ Embed codes
  └─ Dark mode
```

### Feature Release Matrix

| Feature | MVP | v1.1 | v1.2 | v1.3 | v2.0 |
|---------|-----|------|------|------|------|
| F-001: Repo Input | ✅ | | | | |
| F-002: API Integration | ✅ | | | | |
| F-003: Chart Display | ✅ | | | | |
| F-004: Stats | ✅ | | | | |
| F-005: Error Handling | ✅ | | | | |
| F-006: Performance | ✅ | | | | |
| F-007: Accessibility | ✅ | | | | |
| F-008: Browser Support | ✅ | | | | |
| F-009: Security | ✅ | | | | |
| F-010: Basic UI | ✅ | | | | |
| F-011: Multiple Charts | | ✅ | | | |
| F-012: Filter Pre-releases | | ✅ | | | |
| F-013: Date Range | | ✅ | | | |
| F-014: Hover Tooltips | | | ✅ | | |
| F-015: Shareable URLs | | | ✅ | | |
| F-016: Export | | | ✅ | | |
| F-017: Enhanced Stats | | | | ✅ | |
| F-018: Recent Searches | | | | ✅ | |
| F-019: Multi-Repo Compare | | | | | ✅ |
| F-020: Autocomplete | | | | | ✅ |
| F-021: Calendar View | | | | | ✅ |

### Dependency Map

```
MVP Foundation
├─ F-001 → F-002 (Input required for API)
├─ F-002 → F-003 (Data required for chart)
├─ F-002 → F-004 (Data required for stats)
└─ F-010 → ALL (UI wraps everything)

v1.1 Enhancements
├─ F-011 → F-003 (Extends chart)
├─ F-012 → F-002 (Filters API data)
└─ F-013 → F-003 (Filters chart data)

v1.2 Sharing
├─ F-014 → F-003 (Enhances chart)
├─ F-015 → F-001 (Enables URL params)
└─ F-016 → F-003 (Exports chart)

v2.0 Advanced
├─ F-019 → F-002 (Multiple API calls)
├─ F-020 → F-001 (Enhances input)
└─ F-021 → F-003 (New view type)
```

### Rollout Strategy

**MVP Launch (Week 11):**
```
Day 1: Deploy to production
  ├─ Monitor errors (Sentry)
  ├─ Check performance (Vercel Analytics)
  └─ Collect feedback (in-app survey)

Day 1-3: Soft launch
  ├─ Product Hunt
  ├─ Hacker News
  └─ Reddit (r/programming)

Day 4-7: Iterate
  ├─ Fix critical bugs
  ├─ Improve based on feedback
  └─ Monitor metrics

Week 2: Evaluate
  ├─ Review KPIs
  ├─ Plan v1.1
  └─ Prioritize feedback
```

**Feature Flags:**
```javascript
{
  "multipleCharts": false,      // v1.1
  "shareableUrls": false,        // v1.2
  "multiRepoCompare": false,     // v2.0
  "darkMode": false              // v2.1
}
```

Enable flags for:
- Beta users (test new features)
- A/B testing (compare variants)
- Gradual rollout (10% → 50% → 100%)

### Success Criteria per Release

**MVP (Week 11):**
- ✅ 500 users in week 1
- ✅ < 5% error rate
- ✅ > 4.0/5 satisfaction
- ✅ 90% task completion

**v1.1 (Week 13):**
- ✅ 1,000 weekly active users
- ✅ 30% use new chart types
- ✅ 20% use filters

**v1.2 (Week 15):**
- ✅ 15% share URLs
- ✅ 10% export charts
- ✅ 25% returning users

**v1.3 (Week 16):**
- ✅ Hit all launch targets
- ✅ Ready for v2.0 planning

---

## 8. Risk Management (RAID Log)

### Risks

| ID | Risk | Probability | Impact | Severity | Mitigation | Owner |
|----|------|-------------|--------|----------|------------|-------|
| R-001 | GitHub API rate limits | High | High | Critical | 24h cache, ETag, auth | Backend |
| R-002 | Low user adoption | High | Medium | High | Product Hunt, HN, Reddit | PM |
| R-003 | GitHub API changes | Low | Critical | High | Monitor changelog, adapter | Lead |
| R-004 | Performance issues | Medium | Medium | Medium | Load testing, optimization | Frontend |
| R-005 | Security vulnerability | Medium | High | High | Dependabot, audits | DevOps |
| R-006 | Browser compatibility | Low | Low | Low | Cross-browser testing | QA |
| R-007 | Scope creep | High | Medium | Medium | Strict MVP scope | PM |
| R-008 | Team availability | Medium | High | High | Documentation, backup | Lead |

### Assumptions

| ID | Assumption | Validation | Risk if Wrong | Status |
|----|------------|------------|---------------|--------|
| A-001 | Developers care about release tracking | 20 user interviews | Low adoption | To validate |
| A-002 | GitHub API has sufficient data | API prototype | Missing data | To validate |
| A-003 | Users accept no signup | User survey | Lower engagement | To validate |
| A-004 | Bar chart is best visualization | User testing | Poor UX | To validate |
| A-005 | 24h cache is acceptable | User feedback | Stale data complaints | To validate |
| A-006 | Vercel hosting is sufficient | Load testing | Scaling issues | To validate |
| A-007 | No database needed | Architecture review | Future limitations | Validated ✓ |
| A-008 | Budget covers 16 weeks | Finance approval | Timeline slip | Validated ✓ |

### Issues

| ID | Issue | Status | Impact | Resolution | Owner |
|----|-------|--------|--------|------------|-------|
| I-001 | None yet | - | - | - | - |

*To be populated during development*

### Dependencies

| ID | Dependency | Type | Criticality | Status | Mitigation |
|----|------------|------|-------------|--------|------------|
| D-001 | GitHub API | External | Critical | Active | Cache + retry logic |
| D-002 | Vercel hosting | External | Critical | Active | Backup: Netlify |
| D-003 | Redis (Upstash) | External | High | Active | Fallback: Direct API |
| D-004 | Recharts library | External | Medium | Active | Alternative: D3.js |
| D-005 | Next.js 14 | External | High | Active | Stable release |
| D-006 | BRD approval | Internal | Critical | Pending | This document |
| D-007 | Budget approval | Internal | Critical | Pending | Finance team |
| D-008 | Team assignment | Internal | Critical | Pending | Resource planning |

---

## 9. Implementation Checklist

Developer handoff checklist.

### Phase 0: Setup (Week 1)

**Environment:**
- [ ] Create GitHub repository
- [ ] Set up Next.js 14 project
- [ ] Configure TypeScript
- [ ] Set up Tailwind CSS
- [ ] Configure ESLint + Prettier

**Infrastructure:**
- [ ] Create Vercel account
- [ ] Set up Redis (Upstash)
- [ ] Configure environment variables
- [ ] Set up Sentry error tracking
- [ ] Enable Vercel Analytics

**CI/CD:**
- [ ] Set up GitHub Actions
- [ ] Configure Lighthouse CI
- [ ] Add npm audit checks
- [ ] Set up preview deployments

---

### Phase 1: MVP Development (Weeks 3-8)

**Sprint 1 (Weeks 3-4):**
- [ ] F-001: Build input component
- [ ] F-001: Add validation
- [ ] F-002: Create API route
- [ ] F-002: Integrate GitHub API
- [ ] F-002: Set up Redis caching
- [ ] F-005: Add error handling

**Sprint 2 (Weeks 5-6):**
- [ ] F-003: Install Recharts
- [ ] F-003: Build chart component
- [ ] F-003: Add responsiveness
- [ ] F-004: Calculate statistics
- [ ] F-004: Build stats grid
- [ ] F-010: Style all components

**Sprint 3 (Weeks 7-8):**
- [ ] F-006: Optimize performance
- [ ] F-006: Add code splitting
- [ ] F-007: Add keyboard nav
- [ ] F-007: Add ARIA labels
- [ ] F-008: Cross-browser testing
- [ ] F-009: Security review
- [ ] Write tests (70% coverage)
- [ ] Documentation

---

### Phase 2: Beta Testing (Weeks 9-10)

**Week 9:**
- [ ] Deploy to production
- [ ] Invite 100 beta users
- [ ] Set up feedback form
- [ ] Monitor Sentry errors
- [ ] Track Vercel Analytics

**Week 10:**
- [ ] Fix critical bugs
- [ ] Improve based on feedback
- [ ] Write launch blog post
- [ ] Create demo video
- [ ] Prepare social posts

---

### Phase 3: Launch (Week 11)

**Launch day:**
- [ ] Final production deploy
- [ ] Post to Product Hunt
- [ ] Submit to Hacker News
- [ ] Post on Reddit
- [ ] Tweet announcement
- [ ] Monitor 24/7

---

### Phase 4: v1.1-1.3 (Weeks 12-16)

**v1.1 (Week 13):**
- [ ] F-011: Multiple chart types
- [ ] F-012: Pre-release filter
- [ ] F-013: Date range selector
- [ ] Deploy + announce

**v1.2 (Week 15):**
- [ ] F-014: Hover tooltips
- [ ] F-015: Shareable URLs
- [ ] F-016: Export features
- [ ] Deploy + announce

**v1.3 (Week 16):**
- [ ] F-017: Enhanced stats
- [ ] F-018: Recent searches
- [ ] Deploy + announce
- [ ] Review metrics

---

## 10. Testing Strategy

### Unit Tests

**Coverage target:** 70%

**Test files:**
```
src/
├── components/
│   ├── RepoInput.test.tsx
│   ├── ReleaseChart.test.tsx
│   ├── StatsGrid.test.tsx
│   └── ErrorMessage.test.tsx
├── hooks/
│   ├── useReleaseData.test.ts
│   └── useChartData.test.ts
├── lib/
│   ├── github.test.ts
│   ├── cache.test.ts
│   └── stats.test.ts
└── utils/
    ├── format.test.ts
    └── validate.test.ts
```

**Example test:**
```typescript
// RepoInput.test.tsx
describe('RepoInput', () => {
  it('validates correct format', () => {
    render(<RepoInput />);
    const input = screen.getByLabelText('Repository');

    fireEvent.change(input, {
      target: { value: 'facebook/react' }
    });

    expect(input).toHaveValue('facebook/react');
    expect(screen.queryByText('Invalid format')).not.toBeInTheDocument();
  });

  it('shows error for invalid format', () => {
    render(<RepoInput />);
    const input = screen.getByLabelText('Repository');

    fireEvent.change(input, {
      target: { value: 'invalid' }
    });
    fireEvent.blur(input);

    expect(screen.getByText('Invalid format')).toBeInTheDocument();
  });
});
```

---

### E2E Tests

**Tool:** Playwright

**Test scenarios:**
```typescript
// e2e/happy-path.spec.ts
test('user can analyze a repository', async ({ page }) => {
  // Navigate to homepage
  await page.goto('/');

  // Enter repo name
  await page.fill('[aria-label="Repository"]', 'facebook/react');

  // Click analyze
  await page.click('button:has-text("Analyze")');

  // Wait for chart
  await page.waitForSelector('[data-testid="chart"]');

  // Verify stats are shown
  await expect(page.locator('text=Total releases')).toBeVisible();
  await expect(page.locator('text=Last release')).toBeVisible();

  // Verify chart is rendered
  const chart = page.locator('[data-testid="chart"]');
  await expect(chart).toBeVisible();
});
```

---

### Performance Tests

**Tool:** Lighthouse CI

**Run on every deploy:**
```yaml
# .github/workflows/lighthouse.yml
- name: Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun
```

**Thresholds:**
```json
{
  "ci": {
    "assert": {
      "assertions": {
        "performance": ["error", { "minScore": 0.9 }],
        "accessibility": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1500 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }]
      }
    }
  }
}
```

---

### Accessibility Tests

**Tool:** axe-core + manual testing

**Automated:**
```typescript
// a11y.test.tsx
import { axe } from 'jest-axe';

test('page has no accessibility violations', async () => {
  const { container } = render(<HomePage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

**Manual checklist:**
- [ ] Tab navigation works
- [ ] Screen reader announces correctly (NVDA, VoiceOver)
- [ ] Color contrast passes (4.5:1)
- [ ] Focus indicators visible
- [ ] No keyboard traps

---

## 11. Documentation Requirements

### User Documentation

**Help page content:**
```markdown
# How to Use

1. Enter a GitHub repository name
   - Format: username/repo-name
   - Example: facebook/react

2. Click "Analyze"
   - Wait 1-3 seconds for data to load

3. View results
   - Chart shows release frequency over time
   - Stats show key metrics

## FAQ

Q: Why "repository not found"?
A: Check the repo name is correct and the repo is public.

Q: Why are releases missing?
A: We only show published releases, not drafts.

Q: How often is data updated?
A: Data is cached for 24 hours.
```

---

### Developer Documentation

**README.md:**
```markdown
# GitHub Releases Dashboard

## Setup

1. Clone repo
2. Install dependencies: `npm install`
3. Copy .env.example to .env
4. Add Redis URL and GitHub token
5. Run dev server: `npm run dev`

## Architecture

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Recharts
- Redis (Upstash)

## API

GET /api/releases/[owner]/[repo]

Returns:
- 200: Release data
- 404: Repo not found
- 403: Rate limited
- 500: Server error

## Testing

- Unit: `npm test`
- E2E: `npm run test:e2e`
- Lint: `npm run lint`

## Deployment

Push to main → Auto-deploy to Vercel
```

---

## 12. Success Metrics

Track these KPIs post-launch.

### Primary Metrics

| Metric | Target | Measure | Frequency |
|--------|--------|---------|-----------|
| Weekly Active Repos | 1,000 | Backend logs | Weekly |
| Task Completion Rate | > 90% | Funnel analysis | Weekly |
| User Satisfaction | > 4.2/5 | In-app survey | Monthly |
| Error Rate | < 5% | Sentry | Daily |

### Secondary Metrics

| Metric | Target | Measure | Frequency |
|--------|--------|---------|-----------|
| Page Load (p95) | < 2.5s | Vercel Analytics | Daily |
| API Success Rate | > 98% | Backend logs | Daily |
| Returning Users | 25% | Analytics | Weekly |
| Social Shares | 100/week | UTM tracking | Weekly |

### Feature Adoption (v1.1+)

| Feature | Target Adoption | Measure | Timeline |
|---------|-----------------|---------|----------|
| Multiple Charts | 30% | Event tracking | Week 13 |
| Pre-release Filter | 20% | Event tracking | Week 13 |
| Shareable URLs | 15% | URL params | Week 15 |
| Export Chart | 10% | Download events | Week 15 |

---

## 13. Handoff Checklist

Before starting development, ensure:

### Documentation
- [ ] BRD approved by stakeholders
- [ ] PRD reviewed by engineering team
- [ ] Design mockups created
- [ ] Technical architecture validated

### Resources
- [ ] Budget approved ($80K)
- [ ] Team assigned:
  - [ ] Frontend Developer (40h/week)
  - [ ] Backend Developer (10h/week)
  - [ ] UI/UX Designer (20h/week)
  - [ ] QA Engineer (20h/week)
  - [ ] DevOps (10h/week)

### Infrastructure
- [ ] GitHub repo created
- [ ] Vercel account set up
- [ ] Redis (Upstash) provisioned
- [ ] Sentry account created
- [ ] Domain registered (optional)

### Agreements
- [ ] Timeline agreed (16 weeks)
- [ ] Scope agreed (MVP features only)
- [ ] Success metrics defined
- [ ] Launch plan approved

---

**Document Status:** ✅ Ready for Development Kickoff
**Version:** 1.0
**Last Updated:** November 7, 2025
**Next Review:** Week 8 (pre-beta)

---

## Appendix A: API Contracts

### GET /api/releases/:owner/:repo

**Request:**
```http
GET /api/releases/facebook/react HTTP/1.1
Host: dashboard.com
```

**Response (200):**
```json
{
  "owner": "facebook",
  "repo": "react",
  "totalReleases": 142,
  "firstRelease": "2013-05-29T00:00:00Z",
  "lastRelease": "2025-11-01T14:30:00Z",
  "avgDaysBetween": 15.1,
  "releasesPerMonth": 2.0,
  "releases": [
    {
      "tagName": "v19.0.0",
      "name": "19.0.0",
      "publishedAt": "2025-11-01T14:30:00Z",
      "prerelease": false
    }
  ],
  "monthlyData": [
    { "month": "2025-11", "count": 2 },
    { "month": "2025-10", "count": 3 }
  ]
}
```

**Response (404):**
```json
{
  "error": "Repository not found",
  "code": "REPO_NOT_FOUND"
}
```

**Response (403):**
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT",
  "resetAt": "2025-11-07T18:00:00Z"
}
```

---

## Appendix B: TypeScript Types

```typescript
// lib/types.ts

export interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  created_at: string;
  prerelease: boolean;
  draft: boolean;
}

export interface Release {
  tagName: string;
  name: string;
  publishedAt: string;
  prerelease: boolean;
}

export interface ReleaseStats {
  totalReleases: number;
  firstRelease: string;
  lastRelease: string;
  avgDaysBetween: number;
  releasesPerMonth: number;
}

export interface MonthlyData {
  month: string;
  count: number;
}

export interface ReleaseData {
  owner: string;
  repo: string;
  stats: ReleaseStats;
  releases: Release[];
  monthlyData: MonthlyData[];
}

export interface ApiError {
  error: string;
  code: string;
  resetAt?: string;
}
```

---

**End of PRD**
