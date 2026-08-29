const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (compatible; QRSS/1.0; +https://github.com/qrss) AppleWebKit/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

function isYoutubeHost(hostname: string) {
  return (
    hostname === "youtube.com" ||
    hostname === "www.youtube.com" ||
    hostname === "m.youtube.com" ||
    hostname === "youtu.be" ||
    hostname === "www.youtu.be" ||
    hostname === "music.youtube.com"
  );
}

function channelRss(channelId: string) {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
}

function playlistRss(playlistId: string) {
  return `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
}

async function extractChannelId(pageUrl: string): Promise<string> {
  const res = await fetch(pageUrl, {
    headers: FETCH_HEADERS,
    redirect: "follow",
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    throw new Error(`无法打开 YouTube 页面（${res.status}）`);
  }
  const html = await res.text();
  const patterns = [
    /<meta itemprop="channelId" content="(UC[\w-]{22})"/,
    /"channelId":"(UC[\w-]{22})"/,
    /"externalId":"(UC[\w-]{22})"/,
    /\/channel\/(UC[\w-]{22})/,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1];
  }
  throw new Error("无法从该 YouTube 链接解析频道 ID，请改用频道或 RSS 地址");
}

export async function youtubeToRss(inputUrl: URL): Promise<string> {
  const params = inputUrl.searchParams;

  if (inputUrl.pathname.includes("/feeds/videos.xml")) {
    return inputUrl.toString();
  }

  const playlistId = params.get("list");
  if (playlistId && !playlistId.startsWith("RD")) {
    return playlistRss(playlistId);
  }

  const channelMatch = inputUrl.pathname.match(/\/channel\/(UC[\w-]{22})/);
  if (channelMatch?.[1]) {
    return channelRss(channelMatch[1]);
  }

  const channelIdParam = params.get("channel_id");
  if (channelIdParam?.startsWith("UC")) {
    return channelRss(channelIdParam);
  }

  return extractChannelId(inputUrl.toString()).then(channelRss);
}

export async function resolveFeedUrl(raw: string): Promise<{
  feedUrl: string;
  sourceUrl: string;
}> {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("请输入订阅地址");
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let url: URL;
  try {
    url = new URL(withProtocol);
  } catch {
    throw new Error("订阅地址不是有效的 URL");
  }

  if (isYoutubeHost(url.hostname)) {
    return {
      feedUrl: await youtubeToRss(url),
      sourceUrl: url.toString(),
    };
  }

  return { feedUrl: url.toString(), sourceUrl: url.toString() };
}
