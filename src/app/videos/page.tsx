import { StreamPage } from "@/components/StreamPage";

export const dynamic = "force-dynamic";

export default function VideosPage() {
  return (
    <StreamPage
      title="视频"
      description="YouTube 频道与播放列表会自动转成官方 RSS。"
      emptyTitle="还没有视频"
      emptyDescription="在订阅页粘贴 YouTube 频道、@handle 或播放列表链接。"
      kind="youtube"
      layout="grid"
    />
  );
}
