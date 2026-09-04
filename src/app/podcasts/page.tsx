import { StreamPage } from "@/components/StreamPage";
import { getTranslator } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function PodcastsPage() {
  const { t } = await getTranslator();
  return (
    <StreamPage
      title={t.podcasts.title}
      description={t.podcasts.description}
      emptyTitle={t.podcasts.emptyTitle}
      emptyDescription={t.podcasts.emptyDescription}
      kind="podcast"
    />
  );
}
