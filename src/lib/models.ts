import { ObjectId, type Collection, type Db } from "mongodb";
import type { FeedKind } from "./types";

export type FeedDoc = {
  _id: ObjectId;
  url: string;
  sourceUrl: string;
  title: string;
  description: string;
  siteUrl: string;
  imageUrl: string | null;
  kind: FeedKind;
  lastFetchedAt: Date | null;
  lastError: string | null;
  unreadCount: number;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ItemDoc = {
  _id: ObjectId;
  feedId: ObjectId;
  feedTitle: string;
  guid: string;
  title: string;
  link: string;
  summary: string;
  content: string;
  author: string | null;
  publishedAt: Date;
  kind: FeedKind;
  thumbnail: string | null;
  videoId: string | null;
  audioUrl: string | null;
  duration: string | null;
  read: boolean;
  starred: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AppSettingsDoc = {
  _id: "app";
  autoRefresh: boolean;
  updatedAt: Date;
};

let indexesReady = false;

export function feedsCol(db: Db): Collection<FeedDoc> {
  return db.collection<FeedDoc>("feeds");
}

export function itemsCol(db: Db): Collection<ItemDoc> {
  return db.collection<ItemDoc>("items");
}

export function settingsCol(db: Db): Collection<AppSettingsDoc> {
  return db.collection<AppSettingsDoc>("settings");
}

export async function ensureIndexes(db: Db) {
  if (indexesReady) return;

  await Promise.all([
    feedsCol(db).createIndex({ url: 1 }, { unique: true }),
    itemsCol(db).createIndex({ feedId: 1, guid: 1 }, { unique: true }),
    itemsCol(db).createIndex({ publishedAt: -1, _id: -1 }),
    itemsCol(db).createIndex({ kind: 1, publishedAt: -1 }),
    itemsCol(db).createIndex({ feedId: 1, publishedAt: -1 }),
    itemsCol(db).createIndex({ starred: 1, publishedAt: -1 }),
    itemsCol(db).createIndex({ read: 1, publishedAt: -1 }),
  ]);

  indexesReady = true;
}
