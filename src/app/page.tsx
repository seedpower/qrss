import { StreamPage } from "@/components/StreamPage";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();

  return (
    <StreamPage
      title={query ? `搜索「${query}」` : "全部更新"}
      description={
        query
          ? "按条目标题匹配当前订阅内容。"
          : "文章、YouTube 视频与播客按发布时间混排。"
      }
      emptyTitle={query ? "没有匹配的条目" : "还没有内容"}
      emptyDescription={
        query
          ? "换个关键词，或先去订阅源里加一些 RSS。"
          : "先添加文章 RSS 或 YouTube 频道，刷新后就会出现在这里。"
      }
      q={query}
    />
  );
}
