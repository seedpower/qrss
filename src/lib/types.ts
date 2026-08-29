export type FeedKind = "article" | "youtube" | "podcast";

export type Feed = {
  id: string;
  url: string;
  sourceUrl: string;
  title: string;
  description: string;
  siteUrl: string;
  imageUrl: string | null;
  kind: FeedKind;
  lastFetchedAt: string | null;
  lastError: string | null;
  unreadCount: number;
  itemCount: number;
  createdAt: string;
};

export type Item = {
  id: string;
  feedId: string;
  feedTitle: string;
  guid: string;
  title: string;
  link: string;
  summary: string;
  content: string;
  author: string | null;
  publishedAt: string;
  kind: FeedKind;
  thumbnail: string | null;
  videoId: string | null;
  audioUrl: string | null;
  duration: string | null;
  read: boolean;
  starred: boolean;
};

export type ItemQuery = {
  kind?: FeedKind;
  feedId?: string;
  starred?: boolean;
  unread?: boolean;
  q?: string;
  before?: string;
  limit?: number;
};
