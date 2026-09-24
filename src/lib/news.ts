// Live market news, pulled from public RSS feeds — free, no API key, no
// signup. Multiple sources are merged so one feed going stale/down doesn't
// take the section with it. Fails soft: an unreachable source just
// contributes zero items instead of breaking the page.

export type LiveNewsItem = {
  id: string;
  headline: string;
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

function stripCdataAndTags(raw: string) {
  return raw
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
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
      headers: { "User-Agent": "Trenvora/1.0 (+https://trenvora.vercel.app)" },
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

    return items.slice(0, 6).map((block, i) => {
      const publishedAt = new Date(extractTag(block, "pubDate")).getTime() || 0;
      return {
        id: `${source.name}-${i}-${publishedAt}`,
        headline: extractTag(block, "title"),
        link: extractTag(block, "link"),
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
  return results
    .flat()
    .filter((item) => item.headline && item.link)
    .sort((a, b) => b.publishedAt - a.publishedAt)
    .slice(0, limit);
}
