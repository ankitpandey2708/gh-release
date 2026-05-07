[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/ankitpandey2708/gh-release)

# GitHub Releases Dashboard

A web application to analyze and visualize GitHub repository release patterns. Get insights into release frequency, consistency, and trends for any public GitHub repository.

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

- **Framework:** Next.js 16 (React 18)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Caching:** Upstash Redis
- **Date Utilities:** date-fns
- **API:** GitHub REST API (public repos, unauthenticated)

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

1. **Analyze a Repository**
   - Enter a repository in any format:
     - `facebook/react`
     - `https://github.com/facebook/react`
     - Paste any GitHub URL
   - Click "Analyze"

2. **View Statistics**
   - See comprehensive release statistics
   - Explore the releases per month chart
   - Hover over chart points for details

3. **Filter Results**
   - Toggle pre-releases checkbox
   - Set date ranges to focus on specific periods
   - Clear filters to reset

4. **Export Data**
   - Click "Export to CSV"
   - Save filtered release data for further analysis

5. **Analyze Another Repository**
   - Click "Analyze different repo" button
   - Or use recent searches for quick access

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run knip` - Find unused code and dependencies

## GitHub API Rate Limits

The app uses GitHub's unauthenticated API which has a rate limit of **60 requests per hour per IP address**.

- With Redis caching enabled, you'll rarely hit this limit
- Cached data is served for 24 hours
- Consider adding a GitHub token for higher limits (5,000 req/hour)

## Project Structure

```
gh-release/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   └── [owner]/[repo]/    # Dynamic repository pages
├── components/            # React components
├── lib/                   # Utilities and helpers
│   ├── cache.ts          # Redis caching logic
│   ├── github.ts         # GitHub API client
│   ├── stats.ts          # Statistics calculations
│   ├── validation.ts     # Input validation
│   └── types.ts          # TypeScript types
├── docs/                  # Documentation
└── public/               # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- GitHub API for providing release data
- Upstash for Redis hosting
- Recharts for visualization library
