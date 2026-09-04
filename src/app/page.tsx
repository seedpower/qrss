import { StreamPage } from "@/components/StreamPage";
import { getTranslator } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();
  const { t } = await getTranslator();

  return (
    <StreamPage
      title={query ? t.home.searchTitle(query) : t.home.title}
      description={
        query ? t.home.searchDescription : t.home.description
      }
      emptyTitle={query ? t.home.searchEmptyTitle : t.home.emptyTitle}
      emptyDescription={
        query ? t.home.searchEmptyDescription : t.home.emptyDescription
      }
      q={query}
    />
  );
}
