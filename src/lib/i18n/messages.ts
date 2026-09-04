import type { Locale } from "./config";

export type Messages = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    all: string;
    articles: string;
    videos: string;
    podcasts: string;
    starred: string;
    feeds: string;
    searchPlaceholder: string;
    refreshAll: string;
    refreshing: string;
    language: string;
    langEn: string;
    langZh: string;
  };
  kind: {
    article: string;
    youtube: string;
    podcast: string;
  };
  home: {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    searchTitle: (q: string) => string;
    searchDescription: string;
    searchEmptyTitle: string;
    searchEmptyDescription: string;
  };
  articles: {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
  };
  videos: {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
  };
  podcasts: {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
  };
  starred: {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
  };
  feeds: {
    title: string;
    description: string;
    autoRefresh: string;
    autoRefreshHint: string;
    addTitle: string;
    addHint: string;
    urlPlaceholder: string;
    subscribe: string;
    parsing: string;
    importing: string;
    importCsv: string;
    exportCsv: string;
    csvHint: string;
    refresh: string;
    unsubscribe: string;
    confirmUnsubscribe: (title: string) => string;
    itemsCount: (n: number) => string;
    unreadCount: (n: number) => string;
    updatedAt: (time: string) => string;
    addFailed: string;
    networkError: string;
    csvParseFailed: string;
    csvEmpty: string;
    importDone: (created: number, skipped: number, failed: number) => string;
    importProgress: (done: number, total: number, current: string) => string;
  };
  feedDetail: {
    emptyTitle: string;
    emptyDescription: string;
    backToFeeds: string;
    markAllRead: string;
    refresh: string;
    pleaseWait: string;
  };
  item: {
    openOriginal: string;
    original: string;
    videoSummary: string;
    audioUnsupported: string;
    star: string;
    starred: string;
    markRead: string;
    markUnread: string;
  };
  empty: {
    addFeed: string;
  };
  stream: {
    loadMore: string;
    loading: string;
  };
  errors: {
    title: string;
    fallback: string;
    retry: string;
  };
  notFound: {
    title: string;
    description: string;
    home: string;
  };
  time: {
    justNow: string;
  };
};

const en: Messages = {
  meta: {
    title: "QRSS · Feed Reader",
    description:
      "Manage RSS articles, YouTube videos, and podcasts with Next.js and MongoDB.",
  },
  nav: {
    all: "All",
    articles: "Articles",
    videos: "Videos",
    podcasts: "Podcasts",
    starred: "Starred",
    feeds: "Feeds",
    searchPlaceholder: "Search titles…",
    refreshAll: "Refresh all",
    refreshing: "Refreshing…",
    language: "Language",
    langEn: "English",
    langZh: "中文",
  },
  kind: {
    article: "Article",
    youtube: "Video",
    podcast: "Podcast",
  },
  home: {
    title: "All updates",
    description: "Articles, YouTube videos, and podcasts mixed by publish time.",
    emptyTitle: "Nothing here yet",
    emptyDescription:
      "Add an article RSS feed or YouTube channel — items will show up after refresh.",
    searchTitle: (q) => `Search “${q}”`,
    searchDescription: "Matching item titles across your subscriptions.",
    searchEmptyTitle: "No matching items",
    searchEmptyDescription:
      "Try another keyword, or add more RSS feeds first.",
  },
  articles: {
    title: "Articles",
    description: "RSS / Atom items from blogs, news, and magazines.",
    emptyTitle: "No articles yet",
    emptyDescription: "Subscribe to a blog or news RSS feed, e.g. Ruanyifeng.",
  },
  videos: {
    title: "Videos",
    description:
      "YouTube channels and playlists are converted to the official RSS feed.",
    emptyTitle: "No videos yet",
    emptyDescription:
      "Paste a YouTube channel, @handle, or playlist URL on the Feeds page.",
  },
  podcasts: {
    title: "Podcasts",
    description:
      "RSS feeds with an audio enclosure appear here; play them on the item page.",
    emptyTitle: "No podcasts yet",
    emptyDescription: "Add a podcast RSS feed, e.g. The Vergecast.",
  },
  starred: {
    title: "Starred",
    description: "Starred articles, videos, and podcasts.",
    emptyTitle: "No starred items",
    emptyDescription: "Star items in the timeline to find them here later.",
  },
  feeds: {
    title: "Subscriptions",
    description:
      "Manage RSS / Atom / YouTube / podcasts, or import and export a name,rss CSV. Items are deduplicated by GUID.",
    autoRefresh: "Auto refresh",
    autoRefreshHint: "Fetch all feeds every 10 minutes",
    addTitle: "Add feed",
    addHint:
      "Supports article RSS, Atom, podcast RSS, and YouTube channel / @handle / playlist links.",
    urlPlaceholder:
      "https://example.com/feed.xml or https://www.youtube.com/@handle",
    subscribe: "Subscribe",
    parsing: "Parsing…",
    importing: "Importing…",
    importCsv: "Import CSV",
    exportCsv: "Export CSV",
    csvHint:
      "Two columns name,rss — existing feeds are skipped on import. UTF-8 encoding.",
    refresh: "Refresh",
    unsubscribe: "Remove",
    confirmUnsubscribe: (title) =>
      `Unsubscribe from “${title}”? Its items will be deleted too.`,
    itemsCount: (n) => `${n} items`,
    unreadCount: (n) => `${n} unread`,
    updatedAt: (time) => `Updated ${time}`,
    addFailed: "Failed to add",
    networkError: "Network error, please try again",
    csvParseFailed: "Failed to parse CSV",
    csvEmpty: "No valid feed URLs in the CSV",
    importDone: (created, skipped, failed) => {
      const parts = [`added ${created}`, `already existed ${skipped}`];
      if (failed > 0) parts.push(`failed ${failed}`);
      return `Import finished: ${parts.join(", ")}`;
    },
    importProgress: (done, total, current) =>
      `Importing ${done + 1}/${total}${current ? ` · ${current}` : ""}`,
  },
  feedDetail: {
    emptyTitle: "This feed has no items yet",
    emptyDescription:
      "Click refresh in the top right, or check that the feed URL is reachable.",
    backToFeeds: "Back to feeds",
    markAllRead: "Mark all read",
    refresh: "Refresh",
    pleaseWait: "Please wait…",
  },
  item: {
    openOriginal: "Open original",
    original: "Original",
    videoSummary: "Video summary",
    audioUnsupported: "Your browser does not support audio playback.",
    star: "Star",
    starred: "Starred",
    markRead: "Mark read",
    markUnread: "Mark unread",
  },
  empty: {
    addFeed: "Add feed",
  },
  stream: {
    loadMore: "Load more",
    loading: "Loading…",
  },
  errors: {
    title: "Something went wrong",
    fallback: "Make sure MongoDB is running, then try again.",
    retry: "Retry",
  },
  notFound: {
    title: "Not found",
    description: "This feed or item may have been deleted.",
    home: "Back home",
  },
  time: {
    justNow: "just now",
  },
};

const zhCN: Messages = {
  meta: {
    title: "QRSS · 订阅阅读",
    description: "用 Next.js 与 MongoDB 管理 RSS 文章、YouTube 视频与播客。",
  },
  nav: {
    all: "全部",
    articles: "文章",
    videos: "视频",
    podcasts: "播客",
    starred: "收藏",
    feeds: "订阅",
    searchPlaceholder: "搜索标题…",
    refreshAll: "刷新全部",
    refreshing: "刷新中…",
    language: "语言",
    langEn: "English",
    langZh: "中文",
  },
  kind: {
    article: "文章",
    youtube: "视频",
    podcast: "播客",
  },
  home: {
    title: "全部更新",
    description: "文章、YouTube 视频与播客按发布时间混排。",
    emptyTitle: "还没有内容",
    emptyDescription:
      "先添加文章 RSS 或 YouTube 频道，刷新后就会出现在这里。",
    searchTitle: (q) => `搜索「${q}」`,
    searchDescription: "按条目标题匹配当前订阅内容。",
    searchEmptyTitle: "没有匹配的条目",
    searchEmptyDescription: "换个关键词，或先去订阅源里加一些 RSS。",
  },
  articles: {
    title: "文章",
    description: "来自博客、新闻与杂志的 RSS / Atom 条目。",
    emptyTitle: "还没有文章",
    emptyDescription: "订阅一个博客或新闻 RSS，例如阮一峰的网络日志。",
  },
  videos: {
    title: "视频",
    description: "YouTube 频道与播放列表会自动转成官方 RSS。",
    emptyTitle: "还没有视频",
    emptyDescription: "在订阅页粘贴 YouTube 频道、@handle 或播放列表链接。",
  },
  podcasts: {
    title: "播客",
    description: "带音频 enclosure 的 RSS 会出现在这里，可直接在条目页播放。",
    emptyTitle: "还没有播客",
    emptyDescription: "添加一个播客 RSS，例如 The Vergecast。",
  },
  starred: {
    title: "收藏",
    description: "标了星的文章、视频和播客。",
    emptyTitle: "还没有收藏",
    emptyDescription: "在时间线里点「收藏」，稍后可以回到这里看。",
  },
  feeds: {
    title: "订阅源",
    description:
      "管理 RSS / Atom / YouTube / 播客，也可导入或导出 name,rss 格式的 CSV。条目按 GUID 去重。",
    autoRefresh: "自动刷新",
    autoRefreshHint: "每 10 分钟拉取全部订阅",
    addTitle: "添加订阅",
    addHint:
      "支持文章 RSS、Atom、播客 RSS，以及 YouTube 频道 / @handle / 播放列表链接。",
    urlPlaceholder:
      "https://example.com/feed.xml 或 https://www.youtube.com/@handle",
    subscribe: "订阅",
    parsing: "解析中…",
    importing: "导入中…",
    importCsv: "导入 CSV",
    exportCsv: "导出 CSV",
    csvHint:
      "两列 name,rss，导入时已订阅的会跳过。UTF-8 编码。",
    refresh: "刷新",
    unsubscribe: "取消",
    confirmUnsubscribe: (title) =>
      `取消订阅「${title}」？其中的条目也会被删除。`,
    itemsCount: (n) => `${n} 条`,
    unreadCount: (n) => `${n} 未读`,
    updatedAt: (time) => `更新于 ${time}`,
    addFailed: "添加失败",
    networkError: "网络错误，请稍后重试",
    csvParseFailed: "CSV 解析失败",
    csvEmpty: "CSV 里没有有效的订阅地址",
    importDone: (created, skipped, failed) => {
      const parts = [`新增 ${created}`, `已存在 ${skipped}`];
      if (failed > 0) parts.push(`失败 ${failed}`);
      return `导入完成：${parts.join("，")}`;
    },
    importProgress: (done, total, current) =>
      `导入中 ${done + 1}/${total}${current ? ` · ${current}` : ""}`,
  },
  feedDetail: {
    emptyTitle: "这个源还没有条目",
    emptyDescription: "点右上角刷新，或检查订阅地址是否可访问。",
    backToFeeds: "返回订阅",
    markAllRead: "全部已读",
    refresh: "刷新",
    pleaseWait: "请稍候…",
  },
  item: {
    openOriginal: "打开原文",
    original: "原文",
    videoSummary: "视频总结",
    audioUnsupported: "你的浏览器不支持音频播放。",
    star: "收藏",
    starred: "已收藏",
    markRead: "标为已读",
    markUnread: "标为未读",
  },
  empty: {
    addFeed: "添加订阅",
  },
  stream: {
    loadMore: "加载更多",
    loading: "加载中…",
  },
  errors: {
    title: "出了点问题",
    fallback: "请确认 MongoDB 已启动，然后重试。",
    retry: "重试",
  },
  notFound: {
    title: "没有找到",
    description: "这条订阅或文章可能已被删除。",
    home: "回到首页",
  },
  time: {
    justNow: "刚刚",
  },
};

export const messages: Record<Locale, Messages> = {
  en,
  "zh-CN": zhCN,
};

export function getMessages(locale: Locale): Messages {
  return messages[locale] ?? messages.en;
}
