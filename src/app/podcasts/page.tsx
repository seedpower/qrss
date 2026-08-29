import { StreamPage } from "@/components/StreamPage";

export const dynamic = "force-dynamic";

export default function PodcastsPage() {
  return (
    <StreamPage
      title="播客"
      description="带音频 enclosure 的 RSS 会出现在这里，可直接在条目页播放。"
      emptyTitle="还没有播客"
      emptyDescription="添加一个播客 RSS，例如 The Vergecast。"
      kind="podcast"
    />
  );
}
