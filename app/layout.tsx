import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ClientProvider } from '@/components/ClientProvider';
import { ThemeProvider } from '@/components/ThemeProvider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
          >
            Skip to content
          </a>
          <ClientProvider>{children}</ClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
