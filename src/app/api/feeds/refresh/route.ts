import { NextResponse } from "next/server";
import { refreshAllFeeds } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const results = await refreshAllFeeds();
    return NextResponse.json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "刷新失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
