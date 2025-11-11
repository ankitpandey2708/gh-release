[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/ankitpandey2708/gh-release)

# GitHub Releases Dashboard

A powerful web application to analyze and visualize GitHub repository release patterns. Get comprehensive insights into release frequency, consistency, and trends for **any GitHub repository** - both public and private.

## How It Works

This dashboard connects to the GitHub API to fetch and analyze release data from any repository. Simply enter a repository name or URL, and the application will:

1. **Fetch Release Data** - Retrieves all releases from the GitHub repository using the GitHub REST API
2. **Calculate Statistics** - Computes key metrics including total releases, release frequency, time between releases, and consistency scores
3. **Visualize Patterns** - Generates interactive charts showing release trends over time
4. **Enable Filtering** - Allows you to focus on specific date ranges or exclude pre-releases
5. **Export Results** - Provides CSV export functionality for further analysis

The application supports both **public** and **private repositories**. For private repos, you can securely provide a GitHub Personal Access Token that's stored only in your browser.

## Features

### 📊 Release Analytics

- **Comprehensive Statistics**
  - Total number of releases
  - Average days between releases
  - Releases per month
  - Time since last release
  - Release consistency score (High/Medium/Low)

- **Visual Timeline**
  - Interactive chart showing releases per month
  - Chronological visualization of release patterns
  - Hover tooltips with detailed information

### 🔍 Flexible Input

- **Multiple Input Formats**
  - `owner/repo` (e.g., `facebook/react`)
  - Full GitHub URLs: `https://github.com/owner/repo`
  - Any GitHub page URL: `https://github.com/owner/repo/releases`
  - Auto-extracts repository from URLs

### 🔐 Private Repository Support

- **Personal Access Token (PAT) Authentication**
  - Securely analyze private repositories
  - Token stored only in your browser (localStorage)
  - Automatic token detection and prompt when private repo is detected
  - Show/hide token visibility toggle
  - Optional "Remember Token" functionality
  - One-click token generation link to GitHub settings
  - Direct "Clear Saved Token" button for security management

- **How It Works**
  1. Enter a private repository name
  2. If access is denied, PAT input prompt appears automatically
  3. Create a GitHub token with `repo` scope
  4. Paste token and choose to remember it (optional)
  5. Token is sent with API requests via secure headers
  6. Clear saved token anytime with a single click

### 🎛️ Filtering & Export

- **Filter Releases**
  - Toggle pre-releases on/off
  - Date range filtering (from/to dates)
  - Real-time filter updates

- **Export Data**
  - Download filtered data as CSV
  - Includes version, date, and pre-release status

### ⚡ Performance

- **Redis Caching**
  - Server-side caching with Upstash Redis
  - Reduces GitHub API calls
  - Faster subsequent loads
  - Cache status indicator

- **Recent Searches**
  - Saves recent repository searches
  - Quick access to previously analyzed repos
  - Stored in browser localStorage

### 🎨 User Experience

- **Modern Design System**
  - Clean, professional interface
  - Consistent typography and spacing
  - Responsive layout (mobile, tablet, desktop)
  - Smooth animations and transitions

- **Repository Information**
  - Shows current repository name
  - Direct link to GitHub releases page
  - Easy navigation to analyze different repos

- **Error Handling**
  - Helpful error messages
  - Actionable suggestions for fixes
  - Graceful fallbacks

## Tech Stack

- **Framework:** Next.js 16 (React 18) - Server-side rendering & API routes
- **Language:** TypeScript - Type-safe development
- **Styling:** Tailwind CSS - Responsive design system
- **Charts:** Recharts - Interactive data visualization
- **Caching:** Upstash Redis - Serverless caching layer
- **Date Utilities:** date-fns - Date manipulation and formatting
- **API:** GitHub REST API - Supports both public and private repositories
- **Authentication:** GitHub Personal Access Tokens (optional)
- **Storage:** Browser localStorage - Client-side token and preferences storage

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- (Optional) Upstash Redis account for caching

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ankitpandey2708/gh-release.git
cd gh-release
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up environment variables for Redis caching:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Upstash Redis credentials:
```env
REDIS_URL=https://your-redis-url.upstash.io
REDIS_TOKEN=your-redis-token
```

> **Note:** The app works without Redis - it will simply skip caching and fetch from GitHub API each time.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Analyzing Public Repositories

1. **Enter Repository**
   - Type repository in any format:
     - `facebook/react`
     - `https://github.com/facebook/react`
     - Any GitHub URL
   - Click "Analyze" or press Enter

2. **View Results**
   - Comprehensive statistics displayed automatically
   - Interactive chart shows releases per month
   - Hover over data points for detailed information
   - Cache status indicator shows if data is cached

3. **Apply Filters**
   - Toggle "Include pre-releases" checkbox
   - Set date ranges (from/to) for specific time periods
   - Clear filters to view all releases
   - Charts and statistics update in real-time

4. **Export Data**
   - Click "Export to CSV" button
   - Downloads CSV file with current filtered data
   - Includes version, date, and pre-release status

### Analyzing Private Repositories

1. **Initial Attempt**
   - Enter private repository name
   - Click "Analyze"
   - System automatically detects if repository is private or inaccessible

2. **Provide Authentication**
   - PAT input form appears automatically
   - Click the link to create a GitHub token
   - Generate token with `repo` scope
   - Copy and paste token into the form
   - Check "Remember this token" to save in browser (optional)
   - Click "Analyze with Token"

3. **Token Management**
   - Token is stored securely in browser localStorage
   - Used automatically for subsequent requests
   - Click "Clear Saved Token" button to remove from browser
   - Token button only appears when a token is saved

### Quick Actions

- **Recent Searches**: Access previously analyzed repositories from dropdown
- **Analyze Different Repo**: Reset form to analyze a new repository
- **Direct GitHub Link**: Click repository name to view releases on GitHub

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run knip` - Find unused code and dependencies

## GitHub API Rate Limits

The app intelligently handles GitHub API rate limits based on authentication:

### Unauthenticated Requests (Public Repos)
- **Rate Limit**: 60 requests per hour per IP address
- **Caching**: Redis caching significantly reduces API calls
- **Cache Duration**: 24 hours for public repository data
- **Best Practice**: With caching enabled, you'll rarely hit this limit

### Authenticated Requests (Private Repos with PAT)
- **Rate Limit**: 5,000 requests per hour per token
- **Caching**: Private repositories are NOT cached for security reasons
- **Token Security**: Tokens stored only in browser, never on server
- **Benefits**: Higher limits + access to private repositories

### Optimization Strategies
1. **Use Caching**: Enable Redis for public repos (free tier available)
2. **Recent Searches**: Previously analyzed repos load from cache instantly
3. **PAT for Heavy Use**: Use a token for frequent analysis of many repos
4. **Rate Limit Headers**: App monitors and displays remaining API quota

## Functionality Deep Dive

### Data Flow Architecture

```
User Input → Validation → API Route → Cache Check → GitHub API → Statistics Engine → UI Rendering
```

1. **Input Processing**
   - Accepts multiple URL formats and repository strings
   - Sanitizes and validates input
   - Extracts owner/repo from various GitHub URL patterns
   - Normalizes to lowercase for consistency

2. **Cache Strategy**
   - Checks Upstash Redis for cached data (public repos only)
   - Cache key format: `releases:{owner}:{repo}`
   - 24-hour TTL (Time To Live) for cached entries
   - Cache miss triggers fresh GitHub API call
   - Cache indicator displayed to user

3. **API Communication**
   - Fetches releases via GitHub REST API (`/repos/{owner}/{repo}/releases`)
   - Handles authentication with PAT via `x-github-token` header
   - Validates token format (ghp_xxx or github_pat_xxx)
   - Error detection for 404 (not found) vs 403 (private/auth required)
   - Automatic retry logic for network issues

4. **Statistics Calculation**
   - Computes total release count
   - Calculates average days between releases
   - Determines releases per month metric
   - Calculates time since last release
   - Assigns consistency score (High/Medium/Low) based on release patterns
   - All calculations update dynamically when filters applied

5. **Client-Side Processing**
   - Real-time filtering by date range and pre-release status
   - Chart data aggregation by month
   - CSV export generation from filtered dataset
   - LocalStorage management for tokens and recent searches

### Security Features

- **Token Security**
  - PAT never sent to backend for storage
  - Stored only in browser localStorage
  - Transmitted via secure HTTPS headers
  - One-click token removal functionality
  - Token validation before API calls

- **Input Sanitization**
  - All user inputs sanitized before processing
  - SQL injection prevention (though no SQL used)
  - XSS attack prevention
  - Repository name validation

- **Error Handling**
  - Graceful degradation when APIs fail
  - User-friendly error messages
  - Actionable suggestions for resolution
  - Automatic detection of private repos

## Project Structure

```
gh-release/
├── app/                              # Next.js app directory
│   ├── api/                         # API routes
│   │   └── releases/[owner]/[repo]/ # Release data endpoint
│   ├── [owner]/[repo]/              # Dynamic repository pages
│   ├── page.tsx                     # Home page
│   └── layout.tsx                   # Root layout
├── components/                       # React components
│   ├── DashboardContent.tsx         # Main dashboard UI
│   ├── PATInput.tsx                 # Private repo token input
│   ├── RepoInput.tsx                # Repository search input
│   ├── StatsGrid.tsx                # Statistics display
│   ├── ReleaseChart.tsx             # Chart visualization
│   ├── DateRangePicker.tsx          # Date filtering
│   ├── ErrorMessage.tsx             # Error handling UI
│   ├── LoadingSkeleton.tsx          # Loading states
│   └── ...                          # Other UI components
├── lib/                              # Core functionality
│   ├── cache.ts                     # Redis caching logic
│   ├── github.ts                    # GitHub API client & authentication
│   ├── stats.ts                     # Release statistics calculations
│   ├── validation.ts                # Input sanitization & validation
│   └── types.ts                     # TypeScript type definitions
├── docs/                             # Documentation
└── public/                           # Static assets
```

### Key Files Functionality

- **`lib/github.ts`**: GitHub API integration, PAT validation, error handling
- **`lib/cache.ts`**: Upstash Redis caching with 24-hour TTL
- **`lib/stats.ts`**: Statistical analysis engine for release patterns
- **`lib/validation.ts`**: Input sanitization and URL parsing
- **`components/PATInput.tsx`**: Private repository authentication UI
- **`components/DashboardContent.tsx`**: Main analytics dashboard
- **`app/api/releases/[owner]/[repo]/route.ts`**: API endpoint with caching and authentication

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- GitHub API for providing release data
- Upstash for Redis hosting
- Recharts for visualization library
