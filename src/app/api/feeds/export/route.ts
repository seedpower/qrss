import { NextResponse } from "next/server";
import { serializeFeedCsv } from "@/lib/csv";
import { listFeeds } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const feeds = await listFeeds();
    const csv = serializeFeedCsv(
      feeds.map((feed) => ({ name: feed.title, url: feed.url })),
    );
    const stamp = new Date().toISOString().slice(0, 10);
    return new NextResponse(`\uFEFF${csv}`, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="qrss-feeds-${stamp}.csv"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "导出失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
