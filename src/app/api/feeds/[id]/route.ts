import { NextResponse } from "next/server";
import { deleteFeed, getFeed } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const feed = await getFeed(id);
  if (!feed) {
    return NextResponse.json({ error: "订阅不存在" }, { status: 404 });
  }
  return NextResponse.json({ feed });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await deleteFeed(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "删除失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
