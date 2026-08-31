import { AutoRefreshSwitch } from "@/components/AutoRefreshSwitch";
import { FeedManager } from "@/components/FeedManager";
import { getAppSettings, listFeeds } from "@/lib/queries";
import { ensureAutoRefreshScheduler } from "@/lib/scheduler";

export const dynamic = "force-dynamic";

export default async function FeedsPage() {
  const [feeds, settings] = await Promise.all([listFeeds(), getAppSettings()]);
  void ensureAutoRefreshScheduler();

  return (
    <section>
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-ink">订阅源</h1>
          <p className="mt-2 text-sm text-ink/55">
            管理 RSS / Atom / YouTube / 播客，也可导入或导出 name,rss 格式的 CSV。条目按 GUID 去重。
          </p>
        </div>
        <AutoRefreshSwitch enabled={settings.autoRefresh} />
      </header>
      <FeedManager feeds={feeds} />
    </section>
  );
}
