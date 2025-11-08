export function LoadingSkeleton() {
  return (
    <div className="animate-pulse w-full max-w-4xl space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-gray-200 rounded" />
        ))}
      </div>
      <div className="h-96 bg-gray-200 rounded" />
    </div>
  );
}
