import { StreamPage } from "@/components/StreamPage";
import { getTranslator } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function StarredPage() {
  const { t } = await getTranslator();
  return (
    <StreamPage
      title={t.starred.title}
      description={t.starred.description}
      emptyTitle={t.starred.emptyTitle}
      emptyDescription={t.starred.emptyDescription}
      starred
    />
  );
}
