export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-40 rounded bg-ink/10" />
      <div className="h-4 w-72 rounded bg-ink/8" />
      <div className="mt-8 space-y-3">
        <div className="h-24 rounded-xl bg-white/60" />
        <div className="h-24 rounded-xl bg-white/60" />
        <div className="h-24 rounded-xl bg-white/60" />
      </div>
    </div>
  );
}
