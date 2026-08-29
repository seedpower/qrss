import type { FeedKind } from "./types";

export const EXAMPLE_FEEDS: {
  title: string;
  url: string;
  kind: FeedKind;
  hint: string;
}[] = [
  {
    title: "阮一峰的网络日志",
    url: "https://www.ruanyifeng.com/blog/atom.xml",
    kind: "article",
    hint: "文章",
  },
  {
    title: "Hacker News",
    url: "https://hnrss.org/frontpage",
    kind: "article",
    hint: "文章",
  },
  {
    title: "少数派",
    url: "https://sspai.com/feed",
    kind: "article",
    hint: "文章",
  },
  {
    title: "Fireship",
    url: "https://www.youtube.com/@Fireship",
    kind: "youtube",
    hint: "YouTube",
  },
  {
    title: "The Vergecast",
    url: "https://feeds.megaphone.fm/vergecast",
    kind: "podcast",
    hint: "播客",
  },
];
