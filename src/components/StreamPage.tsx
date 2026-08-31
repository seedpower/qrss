import { Suspense } from "react";
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

function ItemsFallback() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-24 rounded-xl bg-white/60" />
      <div className="h-24 rounded-xl bg-white/60" />
      <div className="h-24 rounded-xl bg-white/60" />
    </div>
  );
}

async function StreamItems({
  emptyTitle,
  emptyDescription,
  kind,
  feedId,
  starred,
  q,
  layout = "list",
}: Omit<StreamPageProps, "title" | "description">) {
  const items = await listItems({ kind, feedId, starred, q, limit: 30 });

  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <FeedStream
      initialItems={items}
      kind={kind}
      feedId={feedId}
      starred={starred}
      q={q}
      layout={layout}
    />
  );
}

export function StreamPage({
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
  return (
    <section>
      <header className="mb-8">
        <h1 className="font-serif text-3xl tracking-tight text-ink">{title}</h1>
        <p className="mt-2 text-sm text-ink/55">{description}</p>
      </header>
      <Suspense fallback={<ItemsFallback />}>
        <StreamItems
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
          kind={kind}
          feedId={feedId}
          starred={starred}
          q={q}
          layout={layout}
        />
      </Suspense>
    </section>
  );
}
