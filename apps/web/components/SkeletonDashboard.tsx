export function SkeletonDashboard() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-1/3 rounded bg-muted animate-pulse" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-md bg-muted animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}