export type CsvFeedRow = {
  name: string;
  url: string;
};

const URL_HEADERS = new Set([
  "rss",
  "url",
  "link",
  "href",
  "feedurl",
  "feed_url",
  "feed url",
  "source",
  "订阅",
  "地址",
]);

const NAME_HEADERS = new Set([
  "name",
  "title",
  "channel",
  "频道",
  "名称",
  "标题",
]);

function parseCsv(text: string): string[][] {
  const input = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }
    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }
    if (char === "\n") {
      row.push(field);
      field = "";
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      continue;
    }
    field += char;
  }

  row.push(field);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
}

function looksLikeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/^https?:\/\//i.test(trimmed)) return true;
  if (/^(www\.)?(youtube\.com|youtu\.be)\//i.test(trimmed)) return true;
  return false;
}

function headerIndex(headers: string[], aliases: Set<string>) {
  return headers.findIndex((header) => aliases.has(header.trim().toLowerCase()));
}

export function parseFeedCsv(text: string): CsvFeedRow[] {
  const table = parseCsv(text);
  if (table.length === 0) return [];

  const headers = table[0].map((cell) => cell.trim());
  let urlIndex = headerIndex(headers, URL_HEADERS);
  let nameIndex = headerIndex(headers, NAME_HEADERS);
  let dataStart = 1;

  if (urlIndex < 0) {
    if (headers.length >= 2 && looksLikeUrl(headers[1])) {
      nameIndex = 0;
      urlIndex = 1;
      dataStart = 0;
    } else if (headers.length === 1 && looksLikeUrl(headers[0])) {
      nameIndex = -1;
      urlIndex = 0;
      dataStart = 0;
    } else if (headers.length >= 2) {
      nameIndex = nameIndex < 0 ? 0 : nameIndex;
      urlIndex = 1;
    }
  }

  if (urlIndex < 0) {
    throw new Error("CSV 需要 rss / url 列，例如 name,rss");
  }

  const seen = new Set<string>();
  const rows: CsvFeedRow[] = [];

  for (const cells of table.slice(dataStart)) {
    const url = (cells[urlIndex] ?? "").trim();
    if (!looksLikeUrl(url)) continue;
    const key = url.replace(/\/+$/, "").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({
      name: (nameIndex >= 0 ? cells[nameIndex] ?? "" : "").trim(),
      url,
    });
  }

  return rows;
}
