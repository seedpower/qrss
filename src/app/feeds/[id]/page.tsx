import { notFound } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { FeedHeader } from "@/components/FeedHeader";
import { FeedStream } from "@/components/FeedStream";
import { getFeed, listItems } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function FeedDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [feed, items] = await Promise.all([
    getFeed(id),
    listItems({ feedId: id, limit: 30 }),
  ]);
  if (!feed) notFound();

  return (
    <section>
      <FeedHeader feed={feed} />
      {items.length === 0 ? (
        <EmptyState
          title="这个源还没有条目"
          description="点右上角刷新，或检查订阅地址是否可访问。"
          actionHref="/feeds"
          actionLabel="返回订阅"
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
