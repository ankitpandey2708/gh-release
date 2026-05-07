import { Suspense } from 'react';
import { DashboardContent } from '@/components/DashboardContent';
import { DashboardFallback } from '@/components/DashboardFallback';

export default function Home() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardContent />
    </Suspense>
  );
}
