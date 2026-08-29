import { NextResponse } from "next/server";
import { listItems } from "@/lib/queries";
import type { FeedKind } from "@/lib/types";

export const dynamic = "force-dynamic";

const kinds = new Set<FeedKind>(["article", "youtube", "podcast"]);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kindParam = searchParams.get("kind");
    const kind = kindParam && kinds.has(kindParam as FeedKind)
      ? (kindParam as FeedKind)
      : undefined;

    const items = await listItems({
      kind,
      feedId: searchParams.get("feedId") ?? undefined,
      starred: searchParams.get("starred") === "1",
      unread: searchParams.get("unread") === "1",
      q: searchParams.get("q") ?? undefined,
      before: searchParams.get("before") ?? undefined,
      limit: Number(searchParams.get("limit") ?? 30),
    });
    return NextResponse.json({ items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "读取条目失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
