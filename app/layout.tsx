import type { Metadata } from 'next';
import './globals.css';
import { ClientProvider } from '@/components/ClientProvider';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'GitHub Releases Dashboard - Visualize Release History',
  description: 'Visualize release history and patterns for any GitHub repository. Track release frequency, trends, and statistics with beautiful charts.',
  keywords: ['github', 'releases', 'dashboard', 'analytics', 'visualization', 'charts'],
  openGraph: {
    title: 'GitHub Releases Dashboard',
    description: 'Visualize release history for any GitHub repository',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
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
