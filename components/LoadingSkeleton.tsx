export function LoadingSkeleton() {
  return (
    <div className="animate-pulse w-full max-w-4xl space-y-4">
      {/* Stats grid skeleton (Design Spec H.3) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-24 bg-neutral-200 rounded-md" />
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="h-80 bg-neutral-200 rounded-md" />
    </div>
  );
}
