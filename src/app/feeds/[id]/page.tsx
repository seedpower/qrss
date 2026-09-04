import { notFound } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { FeedHeader } from "@/components/FeedHeader";
import { FeedStream } from "@/components/FeedStream";
import { getTranslator } from "@/lib/i18n/server";
import { getFeed, listItems } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function FeedDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ t }, feed, items] = await Promise.all([
    getTranslator(),
    getFeed(id),
    listItems({ feedId: id, limit: 30 }),
  ]);
  if (!feed) notFound();

  return (
    <section>
      <FeedHeader feed={feed} />
      {items.length === 0 ? (
        <EmptyState
          title={t.feedDetail.emptyTitle}
          description={t.feedDetail.emptyDescription}
          actionHref="/feeds"
          actionLabel={t.feedDetail.backToFeeds}
        />
      ) : (
        <FeedStream
          initialItems={items}
          feedId={id}
          layout={feed.kind === "youtube" ? "grid" : "list"}
        />
      )}
    </section>
  );
}
