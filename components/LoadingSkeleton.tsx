export function LoadingSkeleton() {
  return (
    <div className="w-full max-w-4xl space-y-8">
      {/* Stats grid skeleton with shimmer */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-32 bg-neutral-100 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-neutral-100 via-white to-neutral-100" />
          </div>
        ))}
      </div>

      {/* Chart skeleton with shimmer */}
      <div className="h-96 bg-neutral-100 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-neutral-100 via-white to-neutral-100" />
      </div>
    </div>
  );
}
