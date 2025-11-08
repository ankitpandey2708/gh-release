export function LoadingSkeleton() {
  return (
    <div className="animate-pulse w-full max-w-4xl space-y-8">
      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-32 bg-neutral-200 rounded-md" />
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="h-96 bg-neutral-200 rounded-md" />
    </div>
  );
}
