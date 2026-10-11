// Live market news, pulled from public RSS feeds — free, no API key, no
// signup. Multiple sources are merged so one feed going stale/down doesn't
// take the section with it. Fails soft: an unreachable source just
// contributes zero items instead of breaking the page.

export type LiveNewsItem = {
  id: string;
  headline: string;
  summary: string;
  link: string;
  source: string;
  time: string;
  publishedAt: number;
};

const SOURCES = [
  { name: "Economic Times", url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms" },
  { name: "LiveMint", url: "https://www.livemint.com/rss/markets" },
  { name: "BusinessLine", url: "https://www.thehindubusinessline.com/markets/feeder/default.rss" },
];

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  rupee: "₹",
};

function decodeEntities(raw: string) {
  return raw.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : match;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });
}

function stripCdataAndTags(raw: string) {
  // Decode before stripping tags: some feeds entity-encode their HTML
  // (`&lt;img …&gt;`), which would otherwise survive as visible markup.
  return decodeEntities(raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1"))
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function safeLink(raw: string) {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function extractTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? stripCdataAndTags(match[1]) : "";
}

function relativeTime(publishedAt: number) {
  if (!publishedAt) return "";
  const hours = Math.floor((Date.now() - publishedAt) / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

async function fetchSource(source: { name: string; url: string }): Promise<LiveNewsItem[]> {
  try {
    const res = await fetch(source.url, {
      next: { revalidate: 900 }, // 15 min cache — a marketing/profile page doesn't need real-time
      // One slow feed must not hold the whole page hostage.
      signal: AbortSignal.timeout(4000),
      headers: { "User-Agent": "Trenvora/1.0 (+https://trenvora.vercel.app)" },
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

    return items.slice(0, 8).map((block, i) => {
      const publishedAt = new Date(extractTag(block, "pubDate")).getTime() || 0;
      const rawSummary = extractTag(block, "description");
      const summary = rawSummary.length > 180 ? `${rawSummary.slice(0, 177)}…` : rawSummary;
      return {
        id: `${source.name}-${i}-${publishedAt}`,
        headline: extractTag(block, "title"),
        summary,
        link: safeLink(extractTag(block, "link")),
        source: source.name,
        time: relativeTime(publishedAt),
        publishedAt,
      };
    });
  } catch {
    return [];
  }
}

export async function fetchMarketNews(limit = 6): Promise<LiveNewsItem[]> {
  const results = await Promise.all(SOURCES.map(fetchSource));
  const seen = new Set<string>();
  return results
    .flat()
    .filter((item) => item.headline && item.link)
    .filter((item) => {
      // Syndicated stories show up in more than one feed.
      const key = item.headline.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.publishedAt - a.publishedAt)
    .slice(0, limit);
}
