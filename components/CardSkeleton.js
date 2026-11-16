export default function CardSkeleton({
  count = 6,
  columns = 4,
}) {
  const gridClass =
    columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div
      className={`grid gap-4 ${gridClass}`}
      role="status"
      aria-label="পণ্য লোড হচ্ছে"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-[#e1e9e3] bg-white p-4"
        >
          <div className="flex items-center gap-3">
            <div className="skeleton h-12 w-12 shrink-0 rounded-xl" />

            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-32 max-w-full rounded-md" />
              <div className="skeleton h-3 w-20 rounded-md" />
            </div>
          </div>

          <div className="mt-5 flex items-end justify-between">
            <div className="space-y-2">
              <div className="skeleton h-3 w-20 rounded-md" />
              <div className="skeleton h-6 w-28 rounded-md" />
            </div>

            <div className="skeleton h-6 w-14 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
