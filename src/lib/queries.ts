import { ObjectId, type Filter } from "mongodb";
import { cache } from "react";
import { getDb } from "./mongodb";
import {
  ensureIndexes,
  feedsCol,
  itemsCol,
  type FeedDoc,
  type ItemDoc,
} from "./models";
import { fetchAndParseFeed } from "./rss";
import { resolveFeedUrl } from "./youtube";
import type { Feed, FeedKind, Item, ItemQuery } from "./types";

function serializeFeed(doc: FeedDoc): Feed {
  return {
    id: doc._id.toString(),
    url: doc.url,
    sourceUrl: doc.sourceUrl,
    title: doc.title,
    description: doc.description,
    siteUrl: doc.siteUrl,
    imageUrl: doc.imageUrl,
    kind: doc.kind,
    lastFetchedAt: doc.lastFetchedAt?.toISOString() ?? null,
    lastError: doc.lastError,
    unreadCount: doc.unreadCount,
    itemCount: doc.itemCount,
    createdAt: doc.createdAt.toISOString(),
  };
}

function serializeItem(doc: ItemDoc): Item {
  return {
    id: doc._id.toString(),
    feedId: doc.feedId.toString(),
    feedTitle: doc.feedTitle,
    guid: doc.guid,
    title: doc.title,
    link: doc.link,
    summary: doc.summary,
    content: doc.content ?? "",
    author: doc.author,
    publishedAt: doc.publishedAt.toISOString(),
    kind: doc.kind,
    thumbnail: doc.thumbnail,
    videoId: doc.videoId,
    audioUrl: doc.audioUrl,
    duration: doc.duration,
    read: doc.read,
    starred: doc.starred,
  };
}

export const withDb = cache(async () => {
  const db = await getDb();
  await ensureIndexes(db);
  return db;
});

async function refreshCounts(feedId: ObjectId) {
  const db = await withDb();
  const items = itemsCol(db);
  const [itemCount, unreadCount] = await Promise.all([
    items.countDocuments({ feedId }),
    items.countDocuments({ feedId, read: false }),
  ]);
  await feedsCol(db).updateOne(
    { _id: feedId },
    { $set: { itemCount, unreadCount, updatedAt: new Date() } },
  );
  return { itemCount, unreadCount };
}

async function upsertItems(feed: FeedDoc, parsedItems: Awaited<ReturnType<typeof fetchAndParseFeed>>["items"]) {
  const db = await withDb();
  const items = itemsCol(db);
  const now = new Date();

  if (parsedItems.length === 0) return 0;

  const ops = parsedItems.map((item) => ({
    updateOne: {
      filter: { feedId: feed._id, guid: item.guid },
      update: {
        $set: {
          feedTitle: feed.title,
          title: item.title,
          link: item.link,
          summary: item.summary,
          content: item.content,
          author: item.author,
          publishedAt: Number.isNaN(item.publishedAt.getTime())
            ? now
            : item.publishedAt,
          kind: item.kind,
          thumbnail: item.thumbnail,
          videoId: item.videoId,
          audioUrl: item.audioUrl,
          duration: item.duration,
          updatedAt: now,
        },
        $setOnInsert: {
          feedId: feed._id,
          guid: item.guid,
          read: false,
          starred: false,
          createdAt: now,
        },
      },
      upsert: true,
    },
  }));

  const result = await items.bulkWrite(ops, { ordered: false });
  await refreshCounts(feed._id);
  return result.upsertedCount + result.modifiedCount;
}

export async function listFeeds() {
  const db = await withDb();
  const docs = await feedsCol(db)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(serializeFeed);
}

export async function getFeed(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await withDb();
  const doc = await feedsCol(db).findOne({ _id: new ObjectId(id) });
  return doc ? serializeFeed(doc) : null;
}

export async function addFeed(
  rawUrl: string,
  options?: { title?: string; skipIfExists?: boolean },
) {
  const { feedUrl, sourceUrl } = await resolveFeedUrl(rawUrl);
  const db = await withDb();
  const feeds = feedsCol(db);
  const existing = await feeds.findOne({ url: feedUrl });
  if (existing && options?.skipIfExists) {
    return { feed: serializeFeed(existing), created: false };
  }

  const parsed = await fetchAndParseFeed(feedUrl);
  const title = options?.title?.trim() || parsed.title;
  if (existing) {
    await upsertItems(existing, parsed.items);
    await feeds.updateOne(
      { _id: existing._id },
      {
        $set: {
          title,
          description: parsed.description,
          siteUrl: parsed.siteUrl,
          imageUrl: parsed.imageUrl,
          kind: parsed.kind,
          lastFetchedAt: new Date(),
          lastError: null,
          updatedAt: new Date(),
        },
      },
    );
    const updated = await feeds.findOne({ _id: existing._id });
    return { feed: serializeFeed(updated!), created: false };
  }

  const now = new Date();
  const doc: Omit<FeedDoc, "_id"> = {
    url: feedUrl,
    sourceUrl,
    title,
    description: parsed.description,
    siteUrl: parsed.siteUrl,
    imageUrl: parsed.imageUrl,
    kind: parsed.kind,
    lastFetchedAt: now,
    lastError: null,
    unreadCount: 0,
    itemCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const _id = new ObjectId();
  await feeds.insertOne({ ...doc, _id });
  const feed = { ...doc, _id };
  await upsertItems(feed, parsed.items);
  const saved = await feeds.findOne({ _id });
  return { feed: serializeFeed(saved!), created: true };
}

export async function refreshFeed(id: string) {
  if (!ObjectId.isValid(id)) throw new Error("无效的订阅 ID");
  const db = await withDb();
  const feeds = feedsCol(db);
  const feed = await feeds.findOne({ _id: new ObjectId(id) });
  if (!feed) throw new Error("订阅不存在");

  try {
    const parsed = await fetchAndParseFeed(feed.url);
    await feeds.updateOne(
      { _id: feed._id },
      {
        $set: {
          title: parsed.title,
          description: parsed.description,
          siteUrl: parsed.siteUrl,
          imageUrl: parsed.imageUrl,
          kind: parsed.kind,
          lastFetchedAt: new Date(),
          lastError: null,
          updatedAt: new Date(),
        },
      },
    );
    const updated = { ...feed, title: parsed.title, kind: parsed.kind };
    await upsertItems(updated, parsed.items);
    const saved = await feeds.findOne({ _id: feed._id });
    return serializeFeed(saved!);
  } catch (error) {
    const message = error instanceof Error ? error.message : "刷新失败";
    await feeds.updateOne(
      { _id: feed._id },
      { $set: { lastError: message, updatedAt: new Date() } },
    );
    throw new Error(message);
  }
}

export async function refreshAllFeeds() {
  const db = await withDb();
  const feeds = await feedsCol(db).find({}).toArray();
  const results = [];
  for (const feed of feeds) {
    try {
      const updated = await refreshFeed(feed._id.toString());
      results.push({ id: updated.id, ok: true as const, title: updated.title });
    } catch (error) {
      results.push({
        id: feed._id.toString(),
        ok: false as const,
        title: feed.title,
        error: error instanceof Error ? error.message : "刷新失败",
      });
    }
  }
  return results;
}

export async function deleteFeed(id: string) {
  if (!ObjectId.isValid(id)) throw new Error("无效的订阅 ID");
  const db = await withDb();
  const feedId = new ObjectId(id);
  await itemsCol(db).deleteMany({ feedId });
  const result = await feedsCol(db).deleteOne({ _id: feedId });
  if (result.deletedCount === 0) throw new Error("订阅不存在");
}

export async function listItems(query: ItemQuery = {}) {
  const db = await withDb();
  const filter: Filter<ItemDoc> = {};
  if (query.kind) filter.kind = query.kind;
  if (query.feedId) {
    if (!ObjectId.isValid(query.feedId)) return [];
    filter.feedId = new ObjectId(query.feedId);
  }
  if (query.starred) filter.starred = true;
  if (query.unread) filter.read = false;
  if (query.q?.trim()) {
    filter.title = { $regex: escapeRegex(query.q.trim()), $options: "i" };
  }
  if (query.before) {
    const before = new Date(query.before);
    if (!Number.isNaN(before.getTime())) {
      filter.publishedAt = { $lt: before };
    }
  }

  const limit = Math.min(Math.max(query.limit ?? 30, 1), 60);
  const docs = await itemsCol(db)
    .find(filter, { projection: { content: 0 } })
    .sort({ publishedAt: -1, _id: -1 })
    .limit(limit)
    .toArray();
  return docs.map(serializeItem);
}

export async function getItem(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await withDb();
  const doc = await itemsCol(db).findOne({ _id: new ObjectId(id) });
  return doc ? serializeItem(doc) : null;
}

export async function updateItem(
  id: string,
  patch: { read?: boolean; starred?: boolean },
) {
  if (!ObjectId.isValid(id)) throw new Error("无效的条目 ID");
  const db = await withDb();
  const items = itemsCol(db);
  const _id = new ObjectId(id);
  const existing = await items.findOne({ _id });
  if (!existing) throw new Error("条目不存在");

  const $set: Partial<ItemDoc> = { updatedAt: new Date() };
  if (typeof patch.read === "boolean") $set.read = patch.read;
  if (typeof patch.starred === "boolean") $set.starred = patch.starred;

  await items.updateOne({ _id }, { $set });
  if (typeof patch.read === "boolean" && patch.read !== existing.read) {
    await refreshCounts(existing.feedId);
  }
  const updated = await items.findOne({ _id });
  return serializeItem(updated!);
}

export async function markFeedRead(feedId: string) {
  if (!ObjectId.isValid(feedId)) throw new Error("无效的订阅 ID");
  const db = await withDb();
  const id = new ObjectId(feedId);
  await itemsCol(db).updateMany(
    { feedId: id, read: false },
    { $set: { read: true, updatedAt: new Date() } },
  );
  await refreshCounts(id);
}

export async function countUnread(kind?: FeedKind) {
  const db = await withDb();
  return itemsCol(db).countDocuments({
    read: false,
    ...(kind ? { kind } : {}),
  });
}

export async function navCounts() {
  const db = await withDb();
  const [feedAgg, starred] = await Promise.all([
    feedsCol(db)
      .aggregate<{ unread: number; feeds: number }>([
        {
          $group: {
            _id: null,
            unread: { $sum: "$unreadCount" },
            feeds: { $sum: 1 },
          },
        },
      ])
      .next(),
    itemsCol(db).countDocuments({ starred: true }),
  ]);
  return {
    unread: feedAgg?.unread ?? 0,
    starred,
    feeds: feedAgg?.feeds ?? 0,
  };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
