import { FeedManager } from "@/components/FeedManager";
import { listFeeds } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function FeedsPage() {
  const feeds = await listFeeds();

  return (
    <section>
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-ink">订阅源</h1>
        <p className="mt-2 text-sm text-ink/55">
          管理 RSS / Atom / YouTube / 播客。条目存在 MongoDB 里，刷新时按 GUID 去重。
        </p>
      </header>
      <FeedManager feeds={feeds} />
    </section>
  );
}
