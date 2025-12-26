import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { ClientProvider } from '@/components/ClientProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { StructuredData } from '@/components/StructuredData';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gh-release.vercel.app'),
  title: {
    default: 'GitHub Releases Dashboard - Visualize Release History & Analytics',
    template: '%s | GitHub Releases Dashboard',
  },
  description: 'Visualize release history and patterns for any GitHub repository. Track release frequency, trends, and statistics with beautiful interactive charts. Export data, filter by date range, and analyze release consistency.',
  keywords: ['github', 'releases', 'dashboard', 'analytics', 'visualization', 'charts', 'release tracker', 'github analytics', 'repository statistics', 'release frequency', 'open source', 'software releases'],
  authors: [{ name: 'Ankit Pandey' }],
  creator: 'Ankit Pandey',
  publisher: 'GitHub Releases Dashboard',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'GitHub Releases Dashboard',
    title: 'GitHub Releases Dashboard - Visualize Release History & Analytics',
    description: 'Visualize release history and patterns for any GitHub repository. Track release frequency, trends, and statistics with beautiful interactive charts.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GitHub Releases Dashboard - Visualize Release History',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHub Releases Dashboard - Visualize Release History & Analytics',
    description: 'Visualize release history and patterns for any GitHub repository. Track release frequency, trends, and statistics.',
    images: ['/og-image.png'],
    creator: '@ankitpandey2708',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <StructuredData />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-lg"
          >
            Skip to content
          </a>
          <ClientProvider>{children}</ClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
