export default function Loading() {
  return (
    <div className="wrap flex flex-col gap-4 pt-6" aria-busy="true" aria-label="載入中">
      <div className="h-9 w-56 animate-pulse rounded-lg bg-subtle" />
      <div className="card h-40 animate-pulse" />
      <div className="card h-32 animate-pulse" />
      <div className="card h-32 animate-pulse" />
    </div>
  );
}
