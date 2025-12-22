# GitHub Releases Dashboard - Business Requirements

## Summary

We're building a web tool that shows GitHub release patterns.

Users enter a repo name. We fetch release data. We show it as a chart.

The goal: help people see how often a project ships.

---

## 1. Product Definition

### What We're Building

A single-page web app. It turns GitHub release data into charts.

**Core features:**
- Input box for repo names
- Charts showing release frequency
- Stats on shipping patterns
- Clean, fast interface

**What makes it different:**
- Focuses only on releases (not stars, commits, etc.)
- No signup needed
- Free to use
- Beautiful charts ready for presentations

**Example use:**
```
User types: "facebook/react"
We show: Timeline of all React releases
Stats display: "2 releases per month on average"
```

### Tech Stack

**Frontend:**
- Next.js 14
- Recharts for charts
- Tailwind CSS for styling
- Deploy on Vercel

**Data:**
- GitHub REST API
- Redis for caching
- No database needed


---

## 2. Users

### Who Needs This

We have 3 main user types.

#### Type 1: Engineering Managers (25% of users)

**What they need:**
- Track team shipping speed
- Show metrics to executives
- Compare against other teams

**Current problem:**
- Manually collecting release data takes hours
- GitHub doesn't show trends
- Hard to visualize patterns

**Our solution:**
- One click to see release velocity
- Charts ready for presentations
- Easy to bookmark and share

#### Type 2: Open Source Maintainers (30% of users)

**What they need:**
- Prove project is active
- Build trust with contributors
- Show consistent shipping

**Current problem:**
- No easy way to display reliability
- Enterprise users want proof of maintenance
- Manual metrics are tedious

**Our solution:**
- Instant proof of activity
- Shareable links for README files
- Visual credibility

#### Type 3: Developers Evaluating Libraries (35% of users)

**What they need:**
- Check if a library is maintained
- Avoid abandoned projects
- Make quick decisions

**Current problem:**
- Takes time to review release history
- Hard to spot red flags
- GitHub's interface isn't optimized for this

**Our solution:**
- See maintenance status in seconds
- Clear visual of activity
- Quick comparison between options

### Market Size

- GitHub: 100M+ developers
- Target market: 10M developers evaluating repos quarterly
- Realistic reach: 1M developers needing regular release insights

---

## 3. Problem & Solution

### The Problem

Developers can't easily see release patterns on GitHub.

**Why this matters:**
1. Choosing dead dependencies breaks production
2. Teams can't track their own velocity
3. OSS projects can't prove they're healthy
4. Making data-driven decisions is hard

**Current workarounds:**
- Manual spreadsheet tracking (slow)
- Scrolling through GitHub releases page (tedious)
- Ignoring the problem (risky)

### Our Solution

Show release frequency as a chart. Make it instant and beautiful.

**How we solve each problem:**

| Problem | Our Fix |
|---------|---------|
| Can't see if project is active | Chart shows last release date clearly |
| Can't compare libraries | Share links, view multiple repos |
| Manual tracking is slow | Auto-fetch in <3 seconds |
| Data isn't visual | Professional charts, not raw data |
| GitHub UI is basic | Purpose-built for this use case |

### Why Now

1. More remote teams need async metrics
2. DevOps culture values shipping velocity
3. OSS adoption requires trust signals
4. Existing tools don't focus on releases

### Competition

**GitHub native:**
- Shows releases as a list
- No trends or patterns
- No visualizations

**Generic analytics tools:**
- Track everything (stars, commits, etc.)
- Complex setup
- Not optimized for releases

**Us:**
- Only releases, done well
- Zero setup
- Built for this specific job

---

## 4. Requirements

### Must Have (10 items)

These are required for MVP launch.

#### M1: Repo Input
- Text box accepts "username/repo-name" format
- Validates format before submitting
- Shows clear errors for invalid input
- Works for orgs and individual users

**Test:** Enter "facebook/react" → fetches data
**Test:** Enter "invalid-format" → shows error

#### M2: GitHub API Integration
- Fetch from `api.github.com/repos/{owner}/{repo}/releases`
- Handle rate limits (show friendly message)
- Show error if repo doesn't exist
- Parse: version, date, pre-release flag

**Test:** API call succeeds in <3 seconds
**Test:** Rate limit hit → user sees clear message

#### M3: Chart Display
- Shows releases over time
- X-axis: dates
- Y-axis: number of releases per month
- Responsive (works on mobile)
- Renders in <1.5 seconds

**Test:** Chart shows on desktop and mobile
**Test:** 100+ releases render smoothly

#### M4: Release Stats
Display these numbers:
- Total releases
- Average time between releases
- Releases per month
- Last release date

**Test:** Stats match manual count
**Test:** Math is accurate

#### M5: Basic UI
- Clean design (inspired by star-history.com)
- Single page layout
- Loading spinner during fetch
- Professional colors and fonts
- Mobile responsive

**Test:** Looks good on phone and desktop
**Test:** No visual bugs

#### M6: Error Handling
Show friendly messages for:
- Repo not found
- API rate limit hit
- Network problems
- Invalid input

**Test:** Each error shows helpful message
**Test:** No crashes

#### M7: Performance
- Page loads in <2 seconds
- Chart renders in <1.5 seconds
- API responds in <3 seconds
- Smooth scrolling (60fps)

**Test:** Measure with Lighthouse
**Test:** Score >90

#### M8: Accessibility
- Works with keyboard only
- Screen reader compatible
- Color contrast passes WCAG AA
- Proper labels on all elements

**Test:** Tab through entire interface
**Test:** Lighthouse accessibility >90

#### M9: Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome)

**Test:** Manually test each browser
**Test:** No breaking bugs

#### M10: Security
- HTTPS only
- No user data stored
- No API keys in frontend code
- XSS protection enabled

**Test:** Security audit passes
**Test:** No vulnerabilities

---

### Should Have (8 items)

Add these if time allows.

#### S1: Multiple Chart Types
- Timeline view (scatter plot)
- Frequency view (bar chart)
- Cumulative view (line chart)
- Toggle between them

#### S2: Filter Pre-releases
- Checkbox to hide beta versions
- Visual tag on pre-releases
- Update chart when toggled

#### S3: Date Range Filter
- Last 6 months button
- Last year button
- All time button
- Custom date picker

#### S4: Hover Details
- Tooltip on chart hover
- Shows: version, date, name
- Link to full release on GitHub

#### S5: Shareable URLs
- URL includes repo in parameter
- Example: `dashboard.com?repo=facebook/react`
- Enables bookmarking

#### S6: Export Options
- Download chart as PNG
- Export data as CSV
- Copy URL button

#### S7: Stats Panel
- Average release frequency
- Longest gap between releases
- Trend (speeding up or slowing down)
- Consistency score

#### S8: Recent Searches
- Show last 5 repos searched
- Click to reload
- Stored in browser (localStorage)

---

### Could Have (8 items)

Add these in future versions.

#### C1: Compare Multiple Repos
- Add up to 5 repos
- Overlaid charts
- Side-by-side stats

#### C2: Autocomplete
- Suggest popular repos as user types
- Show recent searches

#### C3: Calendar View
- Heatmap of release activity
- Monthly calendar layout

#### C4: Embed Codes
- Generate HTML for embedding
- Badge for README files
- Customizable appearance

#### C5: Dark Mode
- Dark theme toggle
- Follows system preference
- Persists choice

#### C6: Advanced Analytics
- Trend line prediction
- Predict next release date
- Compare to stars and commits

#### C7: Notifications
- Bookmark repos
- Alert on new releases
- Email or webhook

#### C8: Private Repos
- OAuth login for GitHub
- Access private repo releases
- Higher API limits

---

### Won't Have (8 items)

Explicitly excluded from v1.

#### W1: User Accounts
No signup system. No user profiles. No saved dashboards in database.

#### W2: Real-time Updates
No push notifications. No webhooks. No live updates.

#### W3: Team Features
No collaboration. No comments. No shared workspaces.

#### W4: Other Platforms
No GitLab. No Bitbucket. GitHub only.

#### W5: Custom Reports
No report builder. No custom metrics. No scheduled exports.

#### W6: Mobile Apps
No iOS app. No Android app. Web only.

#### W7: AI Features
No predictions (except in C6). No anomaly detection. No automated insights.

#### W8: Payments
Free for everyone in v1. No premium tier. No subscriptions.


---


### API Info

**Endpoint:**
```
GET https://api.github.com/repos/{owner}/{repo}/releases
```

**Rate limits:**
- No auth: 60/hour
- With auth: 5,000/hour

**Cache strategy:**
- 24-hour TTL
- ETags for updates
- Backend proxy

### Chart Design

**Primary chart:**
- Type: Bar chart
- X-axis: Months
- Y-axis: Number of releases
- Shows: Release frequency over time

**Secondary chart:**
- Type: Timeline
- Shows: Individual releases as points
- Good for: Spotting gaps
