export default function CardSkeleton({ count = 8 }) {
  const items = Array.from({ length: count });
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((_, i) => (
        <div key={i} className="skeleton h-36 w-full"></div>
      ))}
    </div>
  );
}