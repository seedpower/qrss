import { StreamPage } from "@/components/StreamPage";

export const dynamic = "force-dynamic";

export default function ArticlesPage() {
  return (
    <StreamPage
      title="文章"
      description="来自博客、新闻与杂志的 RSS / Atom 条目。"
      emptyTitle="还没有文章"
      emptyDescription="订阅一个博客或新闻 RSS，例如阮一峰的网络日志。"
      kind="article"
    />
  );
}
