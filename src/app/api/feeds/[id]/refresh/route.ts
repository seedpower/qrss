import { NextResponse } from "next/server";
import { refreshFeed } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const feed = await refreshFeed(id);
    return NextResponse.json({ feed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "刷新失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
