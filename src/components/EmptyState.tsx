import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel: string;
};

export function EmptyState({
  title,
  description,
  actionHref = "/feeds",
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-ink/10 bg-white/70 px-8 py-14 text-center shadow-sm">
      <p className="font-serif text-2xl text-ink">{title}</p>
      <p className="mt-3 text-sm leading-6 text-ink/60">{description}</p>
      {actionLabel && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex rounded-full bg-ink px-4 py-2 text-sm text-cream hover:bg-ink/90"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
