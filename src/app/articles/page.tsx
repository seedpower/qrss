import { StreamPage } from "@/components/StreamPage";
import { getTranslator } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const { t } = await getTranslator();
  return (
    <StreamPage
      title={t.articles.title}
      description={t.articles.description}
      emptyTitle={t.articles.emptyTitle}
      emptyDescription={t.articles.emptyDescription}
      kind="article"
    />
  );
}
