import { LoadingSkeleton } from '@/components/LoadingSkeleton';

export function DashboardFallback() {
  return (
    <main className="min-h-screen px-4 py-8 md:px-8 flex flex-col items-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-neutral-900">GitHub releases dashboard</h1>
      <LoadingSkeleton />
    </main>
  );
}
