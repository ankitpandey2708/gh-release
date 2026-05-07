export function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'GitHub Releases Dashboard',
    description:
      'Visualize release history and patterns for any GitHub repository. Track release frequency, trends, and statistics with beautiful interactive charts.',
    url: 'https://release-history.vercel.app',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Person',
      name: 'Ankit Pandey',
    },
    featureList: [
      'Visualize GitHub release history',
      'Track release frequency and trends',
      'Export release data to CSV',
      'Filter releases by date range',
      'Analyze release consistency',
      'Interactive charts and analytics',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
