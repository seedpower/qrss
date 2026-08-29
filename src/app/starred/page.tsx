import { StreamPage } from "@/components/StreamPage";

export const dynamic = "force-dynamic";

export default function StarredPage() {
  return (
    <StreamPage
      title="收藏"
      description="标了星的文章、视频和播客。"
      emptyTitle="还没有收藏"
      emptyDescription="在时间线里点「收藏」，稍后可以回到这里看。"
      starred
    />
  );
}
