import { NextResponse } from "next/server";
import { addFeed, listFeeds } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const feeds = await listFeeds();
    return NextResponse.json({ feeds });
  } catch (error) {
    const message = error instanceof Error ? error.message : "读取订阅失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      url?: string;
      title?: string;
      skipIfExists?: boolean;
    };
    if (!body.url?.trim()) {
      return NextResponse.json({ error: "请输入订阅地址" }, { status: 400 });
    }
    const result = await addFeed(body.url, {
      title: body.title,
      skipIfExists: body.skipIfExists,
    });
    return NextResponse.json(result, { status: result.created ? 201 : 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "添加订阅失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
