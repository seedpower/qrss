import { EmptyState } from "@/components/EmptyState";
import { FeedStream } from "@/components/FeedStream";
import { listItems } from "@/lib/queries";
import type { FeedKind } from "@/lib/types";

export const dynamic = "force-dynamic";

type StreamPageProps = {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  kind?: FeedKind;
  feedId?: string;
  starred?: boolean;
  q?: string;
  layout?: "list" | "grid";
};

export async function StreamPage({
  title,
  description,
  emptyTitle,
  emptyDescription,
  kind,
  feedId,
  starred,
  q,
  layout = "list",
}: StreamPageProps) {
  const items = await listItems({ kind, feedId, starred, q, limit: 30 });

  return (
    <section>
      <header className="mb-8">
        <h1 className="font-serif text-3xl tracking-tight text-ink">{title}</h1>
        <p className="mt-2 text-sm text-ink/55">{description}</p>
      </header>
      {items.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <FeedStream
          initialItems={items}
          kind={kind}
          feedId={feedId}
          starred={starred}
          q={q}
          layout={layout}
        />
      )}
    </section>
  );
}
