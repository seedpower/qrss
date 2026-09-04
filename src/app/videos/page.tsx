import { StreamPage } from "@/components/StreamPage";
import { getTranslator } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  const { t } = await getTranslator();
  return (
    <StreamPage
      title={t.videos.title}
      description={t.videos.description}
      emptyTitle={t.videos.emptyTitle}
      emptyDescription={t.videos.emptyDescription}
      kind="youtube"
      layout="grid"
    />
  );
}
