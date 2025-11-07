# GitHub Releases Dashboard - Product Requirements

**Version:** 2.0
**Date:** November 7, 2025
**For:** Development team

---

## What This Document Does

This PRD tells developers exactly what to build.

**Source:** BRD.md
**Output:** Working product in 16 weeks
**Format:** Specs + tests + timeline

---

## 1. Features to Build

All features, grouped by release.

### MVP Features (Week 11)

Build these 10 features for launch.

**F-001: Input Box**
- Text field for repo names
- Format: "username/repo-name"
- Validates on blur
- Shows error if wrong format
- Submit button (or press Enter)

**F-002: GitHub API**
- Fetch releases from GitHub
- Parse JSON response
- Cache for 24 hours
- Handle rate limits
- Show errors if fails

**F-003: Bar Chart**
- Shows releases per month
- X-axis: months
- Y-axis: release count
- Responsive (mobile + desktop)
- Renders in <1.5 seconds

**F-004: Stats Cards**
- Total releases
- Average days between releases
- Releases per month
- Last release date

**F-005: Error Messages**
- Repo not found
- Rate limit hit
- Network error
- Invalid input

**F-006: Fast Loading**
- Page loads in <2 seconds
- Chart renders in <1.5 seconds
- Smooth animations (60fps)

**F-007: Keyboard Works**
- Tab through all elements
- Enter to submit
- Visible focus outline
- Screen reader support

**F-008: All Browsers**
- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+
- Mobile browsers

**F-009: Secure**
- HTTPS only
- No API keys in code
- Sanitize user input
- No user data stored

**F-010: Clean UI**
- Simple layout
- Professional colors
- Clear fonts
- Mobile responsive
- Loading spinners

---

### v1.1 Features (Week 13)

Add these 3 features after launch.

**F-011: Chart Types**
- Bar chart (default)
- Timeline view
- Line chart (cumulative)
- Toggle button to switch

**F-012: Filter Pre-releases**
- Checkbox to hide betas
- Tag pre-releases in chart
- Update stats when toggled

**F-013: Date Filters**
- "Last 6 months" button
- "Last year" button
- "All time" button
- Custom date picker

---

### v1.2 Features (Week 15)

**F-014: Hover Tooltips**
- Show details on hover
- Version number
- Release date
- Link to GitHub

**F-015: Shareable Links**
- URL includes repo name
- Example: ?repo=facebook/react
- Copy URL button

**F-016: Export**
- Download chart as PNG
- Export data as CSV
- Copy to clipboard

---

### v1.3 Features (Week 16)

**F-017: Better Stats**
- Longest gap between releases
- Trend (speeding up/slowing down)
- Consistency score

**F-018: Recent Searches**
- Show last 5 repos
- Click to reload
- Store in browser

---

## 2. Technical Specs

How to build each feature.

### F-001: Input Box

**HTML structure:**
```html
<form>
  <input
    type="text"
    placeholder="username/repo-name"
    pattern="[a-zA-Z0-9_-]+/[a-zA-Z0-9_.-]+"
    required
  />
  <button type="submit">Analyze</button>
</form>
```

**Validation:**
```javascript
function validate(input) {
  const pattern = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/;
  return pattern.test(input);
}
```

**Error states:**
- Empty → Disable button
- Invalid format → Show "Use: username/repo-name"
- Valid → Enable button

**Test:**
- Enter "facebook/react" → Valid
- Enter "invalid" → Error
- Press Enter → Submit

---

### F-002: GitHub API

**Endpoint:**
```
GET https://api.github.com/repos/{owner}/{repo}/releases
```

**Request:**
```javascript
async function fetchReleases(owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}/releases`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Releases-Dashboard'
    }
  });

  if (!response.ok) {
    throw new Error(response.status);
  }

  return response.json();
}
```

**Parse response:**
```javascript
function parseReleases(data) {
  return data
    .filter(r => !r.draft)
    .map(r => ({
      version: r.tag_name,
      date: new Date(r.published_at),
      prerelease: r.prerelease
    }));
}
```

**Caching:**
- Key: `releases:{owner}:{repo}`
- TTL: 24 hours (86400 seconds)
- Use Redis (Upstash)

**Error handling:**
- 404 → "Repository not found"
- 403 → "Rate limit. Resets in X minutes."
- 500 → "GitHub error. Try again."
- Network → "Connection failed."

**Test:**
- Fetch "facebook/react" → Get 200+ releases
- Fetch "invalid/repo" → Get 404
- Check cache → Hit on 2nd request

---

### F-003: Bar Chart

**Library:** Recharts

**Data format:**
```javascript
[
  { month: "Jan 2025", count: 3 },
  { month: "Feb 2025", count: 5 },
  { month: "Mar 2025", count: 2 }
]
```

**Transform releases to monthly data:**
```javascript
function groupByMonth(releases) {
  const groups = {};

  releases.forEach(release => {
    const month = format(release.date, 'MMM yyyy');
    groups[month] = (groups[month] || 0) + 1;
  });

  return Object.entries(groups).map(([month, count]) => ({
    month,
    count
  }));
}
```

**Chart component:**
```jsx
<BarChart data={monthlyData} width={800} height={400}>
  <XAxis dataKey="month" />
  <YAxis />
  <Bar dataKey="count" fill="#3b82f6" />
</BarChart>
```

**Responsive:**
- Desktop: 800px width
- Tablet: 600px width
- Mobile: 100% width (min 320px)

**Test:**
- Render 100+ releases → Fast
- Check mobile → Fits screen
- Measure time → <1.5 seconds

---

### F-004: Stats Cards

**Calculate stats:**
```javascript
function calculateStats(releases) {
  const sorted = releases.sort((a, b) => a.date - b.date);

  const total = releases.length;
  const first = sorted[0].date;
  const last = sorted[total - 1].date;

  const daysDiff = (last - first) / (1000 * 60 * 60 * 24);
  const avgDays = daysDiff / (total - 1);

  const monthsDiff = daysDiff / 30;
  const perMonth = total / monthsDiff;

  return {
    total,
    avgDays: Math.round(avgDays),
    perMonth: perMonth.toFixed(1),
    lastRelease: formatRelative(last)
  };
}
```

**Display format:**
```
┌─────────────────┐  ┌─────────────────┐
│ 142 releases    │  │ 15 days average │
└─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐
│ 2.0 per month   │  │ 3 days ago      │
└─────────────────┘  └─────────────────┘
```

**Test:**
- Check math → Accurate
- Verify format → Clear
- Test edge case → 1 release shows "N/A"

---

### F-005: Error Messages

**Error types:**

| Code | Trigger | Message |
|------|---------|---------|
| E-001 | Invalid input | "Invalid format. Use: username/repo-name" |
| E-002 | 404 from API | "Repository not found" |
| E-003 | 403 from API | "Rate limit exceeded. Resets in 45 min." |
| E-004 | Network fail | "Connection failed. Check internet." |
| E-005 | 500 from API | "GitHub error. Try again later." |
| E-006 | No releases | "No releases found" |

**Display:**
```jsx
<div className="error-card">
  <Icon name="alert" />
  <p>{errorMessage}</p>
  <button onClick={retry}>Try Again</button>
</div>
```

**Test:**
- Trigger each error → See message
- Click retry → Attempts again
- Check console → Logged

---

### F-006: Fast Loading

**Targets:**
- Page load: <2 seconds
- Chart render: <1.5 seconds
- API call: <3 seconds
- Animations: 60fps

**Optimize:**
- Code split Recharts (lazy load)
- Use Next.js Image component
- Purge unused CSS
- Compress assets

**Measure:**
- Lighthouse: Score >90
- Real user monitoring: Vercel Analytics
- Set up alerts: If score <85

**Test:**
- Run Lighthouse → Check score
- Test on slow 3G → Still works
- Monitor in production → Track metrics

---

### F-007: Keyboard Works

**Tab order:**
1. Input field
2. Submit button
3. Chart (if rendered)
4. Stats cards
5. Example links

**Shortcuts:**
- Tab: Next element
- Shift+Tab: Previous element
- Enter: Submit form
- Escape: Clear input

**Screen reader:**
```html
<input
  aria-label="GitHub repository name"
  aria-describedby="input-help"
/>
<button aria-label="Analyze repository">
  Analyze
</button>
```

**Test:**
- Unplug mouse → Use keyboard only
- Test with NVDA → Hear announcements
- Check focus → Visible outline

---

### F-008: All Browsers

**Support:**
- Chrome 120+ (Dec 2023)
- Firefox 121+ (Dec 2023)
- Safari 17+ (Sep 2023)
- Edge 120+ (Dec 2023)
- iOS Safari 17+
- Chrome Mobile 120+

**Test matrix:**
```
Desktop:
- Windows: Chrome, Firefox, Edge
- Mac: Chrome, Firefox, Safari
- Linux: Chrome, Firefox

Mobile:
- iOS: Safari, Chrome
- Android: Chrome, Samsung Internet
```

**Test:**
- Manual: Check each browser
- Automated: Playwright tests
- Real devices: BrowserStack

---

### F-009: Secure

**HTTPS:**
- Force HTTPS redirect
- HSTS header enabled
- Secure cookies

**Content Security Policy:**
```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
connect-src 'self' https://api.github.com;
```

**Input sanitization:**
```javascript
function sanitize(input) {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 100);
}
```

**No secrets:**
- API calls via server
- No keys in frontend
- No user data stored

**Test:**
- Try XSS: `<script>alert('x')</script>` → Blocked
- Check headers → CSP enabled
- Scan code → No hardcoded secrets

---

### F-010: Clean UI

**Layout:**
```
┌─────────────────────────────┐
│ GitHub Releases Dashboard   │  ← Header
├─────────────────────────────┤
│ [username/repo-name] [Go]   │  ← Input
├─────────────────────────────┤
│ [142]  [15 days]            │  ← Stats
│ [2.0/mo]  [3 days ago]      │
├─────────────────────────────┤
│                             │
│    █████                    │  ← Chart
│    ███████                  │
│    █████████                │
│                             │
└─────────────────────────────┘
```

**Colors:**
- Primary: Blue (#3b82f6)
- Background: White (#ffffff)
- Text: Dark gray (#1f2937)
- Error: Red (#ef4444)

**Typography:**
- Font: System UI
- Heading: 24px
- Body: 16px
- Small: 14px

**Spacing:**
- Padding: 16px
- Gap: 16px
- Margin: 24px

**Test:**
- Check on phone → Looks good
- Test on tablet → Readable
- Verify colors → High contrast

---

## 3. Test Cases

How to verify each feature works.

### F-001: Input Box

**Test 1: Valid input**
```
1. Open homepage
2. Type "facebook/react"
3. Click "Analyze"
Expected: Form submits, chart loads
```

**Test 2: Invalid input**
```
1. Type "invalid"
2. Blur input field
Expected: See error message
```

**Test 3: Empty input**
```
1. Leave input empty
2. Click button
Expected: Button disabled, no submit
```

**Test 4: Enter key**
```
1. Type "vuejs/core"
2. Press Enter
Expected: Form submits
```

---

### F-002: GitHub API

**Test 1: Successful fetch**
```
1. Request "facebook/react"
Expected: Get 200+ releases, cache data
```

**Test 2: Not found**
```
1. Request "invalid/repo"
Expected: Get 404 error, show message
```

**Test 3: Rate limit**
```
1. Make 61 requests in 1 hour
Expected: Get 403, show reset time
```

**Test 4: Cache hit**
```
1. Request "facebook/react"
2. Request again within 24h
Expected: Return cached data in <100ms
```

---

### F-003: Bar Chart

**Test 1: Render chart**
```
1. Load "facebook/react"
Expected: See bar chart with months
```

**Test 2: Empty data**
```
1. Load repo with 0 releases
Expected: See "No releases found"
```

**Test 3: Mobile view**
```
1. Open on iPhone (375px)
Expected: Chart fits screen
```

**Test 4: Performance**
```
1. Load 1000 releases
Expected: Renders in <1.5 seconds
```

---

### F-004: Stats Cards

**Test 1: Calculate total**
```
Given: 142 releases
Expected: Shows "142 releases"
```

**Test 2: Calculate average**
```
Given: First = Jan 1, 2020, Last = Nov 1, 2025
Expected: Shows "~15 days"
```

**Test 3: Edge case**
```
Given: 1 release
Expected: Shows "N/A" for average
```

---

### F-005: Error Messages

**Test 1: Network error**
```
1. Disconnect internet
2. Try to fetch data
Expected: See "Connection failed"
```

**Test 2: Invalid input**
```
1. Type "invalid-format"
2. Submit
Expected: See "Invalid format"
```

---

### F-006: Fast Loading

**Test 1: Page load**
```
1. Open homepage
2. Measure with Lighthouse
Expected: Score >90
```

**Test 2: Chart render**
```
1. Load chart
2. Measure time
Expected: <1.5 seconds
```

---

### F-007: Keyboard Works

**Test 1: Tab navigation**
```
1. Press Tab
Expected: Focus moves to input
2. Press Tab
Expected: Focus moves to button
```

**Test 2: Screen reader**
```
1. Start NVDA
2. Tab to input
Expected: Hears "GitHub repository name"
```

---

### F-008: All Browsers

**Test 1: Chrome**
```
1. Open in Chrome 120
Expected: All features work
```

**Test 2: Mobile Safari**
```
1. Open on iPhone
Expected: Touch works, chart renders
```

---

### F-009: Secure

**Test 1: HTTPS**
```
1. Visit http://site.com
Expected: Redirect to https://
```

**Test 2: XSS prevention**
```
1. Enter "<script>alert('xss')</script>"
Expected: Script doesn't execute
```

---

### F-010: Clean UI

**Test 1: Mobile layout**
```
1. Open on phone (375px)
Expected: Stats stack vertically
```

**Test 2: Loading state**
```
1. Click "Analyze"
Expected: See spinner on button
```

---

## 4. How to Build It

Step-by-step implementation.

### Setup (Week 1)

**Install tools:**
```bash
# Create Next.js app
npx create-next-app@14 gh-releases-dashboard

# Install dependencies
npm install recharts date-fns
npm install -D @types/node typescript

# Set up Redis
# Sign up at upstash.com
# Get Redis URL and token
```

**Environment variables:**
```
REDIS_URL=redis://...
REDIS_TOKEN=xxx
GITHUB_TOKEN=ghp_xxx (optional)
```

**Project structure:**
```
src/
├── app/
│   ├── page.tsx
│   └── api/
│       └── releases/
│           └── [owner]/
│               └── [repo]/
│                   └── route.ts
├── components/
│   ├── input.tsx
│   ├── chart.tsx
│   ├── stats.tsx
│   └── error.tsx
└── lib/
    ├── github.ts
    ├── cache.ts
    └── stats.ts
```

---

### Sprint 1 (Weeks 3-4)

**Build input form:**
```tsx
// components/input.tsx
export function RepoInput({ onSubmit }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const validate = (input) => {
    const pattern = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/;
    return pattern.test(input);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate(value)) {
      setError('Invalid format. Use: username/repo-name');
      return;
    }

    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="username/repo-name"
      />
      <button type="submit">Analyze</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

**Build API route:**
```typescript
// app/api/releases/[owner]/[repo]/route.ts
export async function GET(request, { params }) {
  const { owner, repo } = params;

  // Check cache
  const cached = await redis.get(`releases:${owner}:${repo}`);
  if (cached) {
    return Response.json(cached);
  }

  // Fetch from GitHub
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases`
  );

  if (!response.ok) {
    return Response.json(
      { error: 'Repository not found' },
      { status: 404 }
    );
  }

  const data = await response.json();

  // Cache for 24 hours
  await redis.set(
    `releases:${owner}:${repo}`,
    JSON.stringify(data),
    { ex: 86400 }
  );

  return Response.json(data);
}
```

**Build data fetching hook:**
```typescript
// lib/use-releases.ts
export function useReleases(repo: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!repo) return;

    setLoading(true);

    fetch(`/api/releases/${repo}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [repo]);

  return { data, loading, error };
}
```

---

### Sprint 2 (Weeks 5-6)

**Build chart:**
```tsx
// components/chart.tsx
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

export function ReleaseChart({ data }) {
  const monthlyData = groupByMonth(data);

  return (
    <BarChart data={monthlyData} width={800} height={400}>
      <XAxis dataKey="month" />
      <YAxis />
      <Bar dataKey="count" fill="#3b82f6" />
    </BarChart>
  );
}

function groupByMonth(releases) {
  const groups = {};

  releases.forEach(release => {
    const month = format(new Date(release.published_at), 'MMM yyyy');
    groups[month] = (groups[month] || 0) + 1;
  });

  return Object.entries(groups).map(([month, count]) => ({
    month,
    count
  }));
}
```

**Build stats:**
```tsx
// components/stats.tsx
export function StatsGrid({ releases }) {
  const stats = calculateStats(releases);

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard label="Total releases" value={stats.total} />
      <StatCard label="Average" value={`${stats.avgDays} days`} />
      <StatCard label="Per month" value={stats.perMonth} />
      <StatCard label="Last release" value={stats.lastRelease} />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
```

**Calculate stats:**
```typescript
// lib/stats.ts
export function calculateStats(releases) {
  const sorted = releases
    .filter(r => !r.draft)
    .sort((a, b) => new Date(a.published_at) - new Date(b.published_at));

  const total = sorted.length;

  if (total === 0) {
    return { total: 0, avgDays: 0, perMonth: 0, lastRelease: 'N/A' };
  }

  const first = new Date(sorted[0].published_at);
  const last = new Date(sorted[total - 1].published_at);

  const daysDiff = (last - first) / (1000 * 60 * 60 * 24);
  const avgDays = total > 1 ? daysDiff / (total - 1) : 0;

  const monthsDiff = daysDiff / 30;
  const perMonth = monthsDiff > 0 ? total / monthsDiff : 0;

  return {
    total,
    avgDays: Math.round(avgDays),
    perMonth: perMonth.toFixed(1),
    lastRelease: formatRelative(last)
  };
}
```

---

### Sprint 3 (Weeks 7-8)

**Optimize performance:**
```typescript
// Lazy load chart
const ReleaseChart = dynamic(() => import('@/components/chart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false
});

// Add loading states
{loading && <Spinner />}
{error && <Error message={error} />}
{data && <ReleaseChart data={data} />}
```

**Add accessibility:**
```tsx
<input
  type="text"
  aria-label="GitHub repository name"
  aria-describedby="input-help"
  aria-invalid={error ? 'true' : 'false'}
/>

<button
  type="submit"
  aria-label="Analyze repository"
  disabled={loading}
>
  {loading ? 'Loading...' : 'Analyze'}
</button>
```

**Write tests:**
```typescript
// input.test.tsx
describe('RepoInput', () => {
  it('validates format', () => {
    render(<RepoInput />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'facebook/react' } });

    expect(input).toHaveValue('facebook/react');
  });

  it('shows error for invalid', () => {
    render(<RepoInput />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'invalid' } });
    fireEvent.blur(input);

    expect(screen.getByText('Invalid format')).toBeInTheDocument();
  });
});
```

---

## 5. Release Plan

When to ship what.

### Week 11: MVP Launch

**Ship:**
- All 10 MVP features
- Working product
- Deployed to production

**Launch steps:**
```
Day 1:
1. Final deploy to Vercel
2. Run smoke tests
3. Monitor errors (Sentry)
4. Post to Product Hunt (8am PST)
5. Submit to Hacker News (9am PST)

Day 2-3:
1. Respond to feedback
2. Fix critical bugs
3. Monitor metrics

Day 4-7:
1. Analyze data
2. Plan v1.1
3. Write blog post
```

**Success = All pass:**
- [ ] 500 users in week 1
- [ ] <5% error rate
- [ ] >4.0/5 satisfaction
- [ ] >90% complete their task

---

### Week 13: v1.1

**Ship:**
- Multiple chart types
- Pre-release filter
- Date range selector

**Deploy:**
```bash
# Enable feature flags
FEATURE_MULTIPLE_CHARTS=true
FEATURE_FILTERS=true

# Deploy
git push origin main

# Monitor
# Check error rates
# Track feature usage
```

**Success:**
- [ ] 30% try new charts
- [ ] 20% use filters
- [ ] No new bugs

---

### Week 15: v1.2

**Ship:**
- Shareable URLs
- Export features
- Hover tooltips

**Success:**
- [ ] 15% share URLs
- [ ] 10% export data

---

### Week 16: v1.3

**Ship:**
- Enhanced stats
- Recent searches

**Success:**
- [ ] Hit all targets
- [ ] 1,000 weekly users
- [ ] 25% return rate

---

## 6. What Could Fail

Problems and fixes.

### Problem 1: GitHub API Rate Limits

**Risk:** High
**Impact:** Critical

**What happens:**
- Free tier: 60 requests/hour
- App breaks when limit hit
- Users see errors

**Fix:**
```javascript
// Cache everything for 24h
await redis.set(key, data, { ex: 86400 });

// Use ETags
const etag = await redis.get(`etag:${key}`);
const response = await fetch(url, {
  headers: { 'If-None-Match': etag }
});

// Show friendly error
if (response.status === 403) {
  const resetTime = response.headers.get('X-RateLimit-Reset');
  showError(`Rate limit. Resets at ${formatTime(resetTime)}`);
}
```

**Backup plan:**
- Add GitHub OAuth (5000/hour limit)
- Implement request queue
- Pay for GitHub API if needed

**Owner:** Backend developer

---

### Problem 2: Low Users

**Risk:** High
**Impact:** Medium

**What happens:**
- Nobody uses the app
- Product fails

**Fix:**
- Launch on Product Hunt (day 1)
- Post to Hacker News (day 1)
- Share on Reddit: r/programming, r/webdev
- Write technical blog post
- Create demo video
- Email developer newsletters

**Measure:**
- Track daily signups
- Monitor social mentions
- Check referral sources

**Backup plan:**
- Interview users (find real problems)
- Adjust messaging
- Try different channels

**Owner:** Product manager

---

### Problem 3: GitHub API Changes

**Risk:** Low
**Impact:** Critical

**What happens:**
- API breaks without warning
- App stops working

**Fix:**
```javascript
// Use adapter pattern
class GitHubAdapter {
  async getReleases(owner, repo) {
    // Can swap implementations
    return this.restApi.getReleases(owner, repo);
  }
}

// Easy to switch
if (restApiBroken) {
  adapter.useGraphQL();
}
```

**Monitor:**
- Subscribe to GitHub changelog
- Set up health checks
- Get alerts on failures

**Backup plan:**
- Switch to GraphQL API
- Have migration plan ready
- Communicate with users fast

**Owner:** Tech lead

---

### Problem 4: Slow Performance

**Risk:** Medium
**Impact:** Medium

**What happens:**
- Page loads slow
- Users leave

**Fix before launch:**
```bash
# Test with large repos
npm run test:load -- --repo=kubernetes/kubernetes

# Optimize bundle
npm run analyze
# Remove unused code

# Add monitoring
# Set up Lighthouse CI
# Track Core Web Vitals
```

**Backup plan:**
- Switch to D3.js (faster than Recharts)
- Add data sampling for huge repos
- Implement pagination

**Owner:** Frontend developer

---

### Problem 5: Security Hole

**Risk:** Medium
**Impact:** High

**What happens:**
- Vulnerability found
- Data leak or attack

**Fix:**
```bash
# Automated scanning
npm audit
npx snyk test

# Regular audits
npm run test:security

# Update dependencies
npm update
```

**Process:**
- Run scans weekly
- Fix critical within 4 hours
- Fix high within 24 hours
- Have security policy ready

**Owner:** DevOps

---

## 7. Dependencies

What we need from others.

### External Dependencies

**GitHub API**
- Status: Active
- Critical: Yes
- Fallback: Cache + error message
- Monitor: https://www.githubstatus.com

**Vercel Hosting**
- Status: Active
- Critical: Yes
- Fallback: Netlify backup
- Cost: $0-20/month

**Redis (Upstash)**
- Status: Active
- Critical: No (can fallback to direct API)
- Cost: $0-10/month

**Recharts Library**
- Status: Active
- Critical: No (can switch to D3.js)
- Version: ^2.10.0

---

### Internal Dependencies

**BRD Approval**
- Status: Pending
- Needed by: Week 1
- Blocker: Can't start without it

**Budget Approval**
- Status: Pending
- Amount: $80K
- Needed by: Week 1

**Team Assignment**
- Status: Pending
- Needed by: Week 1
- Required:
  - Frontend dev (40h/week)
  - Backend dev (10h/week)
  - Designer (20h/week)
  - QA (20h/week)
  - DevOps (10h/week)

---

## 8. Quality Checklist

Before each release, verify:

### Code Quality
- [ ] TypeScript types all correct
- [ ] No console errors
- [ ] No unused code
- [ ] ESLint passes
- [ ] Prettier formatted

### Testing
- [ ] Unit tests pass (70% coverage)
- [ ] E2E tests pass
- [ ] Manual testing done
- [ ] Tested on all browsers
- [ ] Tested on mobile

### Performance
- [ ] Lighthouse score >90
- [ ] Page load <2s
- [ ] Chart render <1.5s
- [ ] No memory leaks

### Accessibility
- [ ] Keyboard works
- [ ] Screen reader works
- [ ] Color contrast passes
- [ ] Focus visible
- [ ] Lighthouse a11y >90

### Security
- [ ] npm audit clean
- [ ] No secrets in code
- [ ] HTTPS enabled
- [ ] CSP headers set
- [ ] Input sanitized

### Production
- [ ] Environment vars set
- [ ] Redis configured
- [ ] Monitoring enabled
- [ ] Error tracking on
- [ ] Analytics tracking

---

## 9. Metrics to Track

What to measure after launch.

### Daily Checks
- Error rate (keep <5%)
- API success rate (keep >98%)
- Uptime (keep >99.5%)
- Response time (keep <2.5s)

### Weekly Checks
- Total users
- Active repos analyzed
- Feature usage
- Browser breakdown
- Device breakdown

### Monthly Checks
- User satisfaction survey
- Net Promoter Score
- Task completion rate
- Returning user rate
- Growth rate

### Targets (Month 3)
- 5,000 total users
- 1,000 weekly active repos
- >4.2/5 satisfaction
- >90% task completion
- 25% return rate

---

## 10. Developer Handoff

Ready to start? Check these.

### Before Sprint 1
- [ ] Read BRD
- [ ] Read PRD
- [ ] Review design mockups
- [ ] Access granted:
  - [ ] GitHub repo
  - [ ] Vercel account
  - [ ] Redis dashboard
  - [ ] Sentry account
- [ ] Environment set up:
  - [ ] Node.js 18+
  - [ ] Git configured
  - [ ] Editor ready
  - [ ] Tools installed

### Week 1 Tasks
- [ ] Clone repo
- [ ] Install dependencies
- [ ] Set up environment vars
- [ ] Run dev server
- [ ] Deploy to preview
- [ ] Set up CI/CD
- [ ] Configure monitoring
- [ ] Join team channels

### Questions?
- Technical: Ask tech lead
- Product: Ask product manager
- Design: Ask designer
- Blocked: Escalate immediately

---

**Status:** Ready for development
**Version:** 2.0
**Updated:** November 7, 2025

---

**End of PRD**
