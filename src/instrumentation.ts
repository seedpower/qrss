export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") return;
  const { ensureAutoRefreshScheduler } = await import("./lib/scheduler");
  try {
    await ensureAutoRefreshScheduler();
  } catch (error) {
    console.error("[qrss] scheduler bootstrap failed", error);
  }
}
