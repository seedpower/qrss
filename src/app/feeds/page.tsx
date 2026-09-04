import { AutoRefreshSwitch } from "@/components/AutoRefreshSwitch";
import { FeedManager } from "@/components/FeedManager";
import { getTranslator } from "@/lib/i18n/server";
import { getAppSettings, listFeeds } from "@/lib/queries";
import { ensureAutoRefreshScheduler } from "@/lib/scheduler";

export const dynamic = "force-dynamic";

export default async function FeedsPage() {
  const [{ t }, feeds, settings] = await Promise.all([
    getTranslator(),
    listFeeds(),
    getAppSettings(),
  ]);
  void ensureAutoRefreshScheduler();

  return (
    <section>
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-ink">{t.feeds.title}</h1>
          <p className="mt-2 text-sm text-ink/55">{t.feeds.description}</p>
        </div>
        <AutoRefreshSwitch enabled={settings.autoRefresh} />
      </header>
      <FeedManager feeds={feeds} />
    </section>
  );
}
