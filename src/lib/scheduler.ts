import { getAppSettings, refreshAllFeeds } from "./queries";

const INTERVAL_MS = 10 * 60 * 1000;

type SchedulerStore = {
  timer?: ReturnType<typeof setInterval>;
};

function getStore(): SchedulerStore {
  const globalForScheduler = globalThis as typeof globalThis & {
    _qrssScheduler?: SchedulerStore;
  };
  if (!globalForScheduler._qrssScheduler) {
    globalForScheduler._qrssScheduler = {};
  }
  return globalForScheduler._qrssScheduler;
}

async function tick() {
  try {
    const { autoRefresh } = await getAppSettings();
    if (!autoRefresh) return;
    await refreshAllFeeds();
  } catch (error) {
    console.error("[qrss] auto refresh failed", error);
  }
}

export function syncAutoRefreshScheduler(enabled: boolean) {
  const store = getStore();
  if (store.timer) {
    clearInterval(store.timer);
    store.timer = undefined;
  }
  if (!enabled) return;
  store.timer = setInterval(() => {
    void tick();
  }, INTERVAL_MS);
}

export async function ensureAutoRefreshScheduler() {
  const { autoRefresh } = await getAppSettings();
  const store = getStore();
  if (autoRefresh && !store.timer) {
    syncAutoRefreshScheduler(true);
  }
  if (!autoRefresh && store.timer) {
    syncAutoRefreshScheduler(false);
  }
}
