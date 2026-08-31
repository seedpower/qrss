import { NextResponse } from "next/server";
import { getAppSettings, refreshAllFeeds, setAutoRefresh } from "@/lib/queries";
import { syncAutoRefreshScheduler } from "@/lib/scheduler";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getAppSettings();
    return NextResponse.json(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "读取设置失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { autoRefresh?: boolean };
    if (typeof body.autoRefresh !== "boolean") {
      return NextResponse.json({ error: "请提供 autoRefresh" }, { status: 400 });
    }
    const settings = await setAutoRefresh(body.autoRefresh);
    syncAutoRefreshScheduler(settings.autoRefresh);
    if (settings.autoRefresh) {
      void refreshAllFeeds().catch((error) => {
        console.error("[qrss] auto refresh on enable failed", error);
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "保存设置失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
