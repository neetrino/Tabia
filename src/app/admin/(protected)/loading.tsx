export default function AdminLoading() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="h-8 w-40 animate-pulse rounded-md bg-[var(--surface)]" />
      <div className="h-24 animate-pulse rounded-md bg-[var(--surface)]" />
    </div>
  );
}
