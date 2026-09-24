import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { NewsGrid } from "@/components/marketing/news-grid";
import { fetchMarketNews } from "@/lib/news";

export const metadata: Metadata = {
  title: "Market News — Trenvora",
  description:
    "Live market and financial news from Economic Times, LiveMint, and BusinessLine — the headlines that move NIFTY, BANK NIFTY, and SENSEX.",
};

export default async function NewsPage() {
  const news = await fetchMarketNews(18);

  return (
    <>
      <PageHeader
        eyebrow="Market News"
        title="What's moving the market, from sources you'd already trust."
        description="Pulled live from Economic Times, LiveMint, and BusinessLine — refreshed every 15 minutes. Tap a headline for a quick summary before you decide to read the full article."
      />

      <section className="py-16 sm:py-20">
        <Container>
          {news.length === 0 ? (
            <Card className="py-14 text-center text-sm text-muted-2">
              News feed is unavailable right now — check back shortly.
            </Card>
          ) : (
            <NewsGrid news={news} />
          )}
        </Container>
      </section>
    </>
  );
}
