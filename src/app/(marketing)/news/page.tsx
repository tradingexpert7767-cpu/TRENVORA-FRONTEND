import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { NewsGrid } from "@/components/marketing/news-grid";
import { NewsSkeleton } from "@/components/marketing/news-skeleton";
import { fetchMarketNews } from "@/lib/news";

export const metadata: Metadata = {
  title: "Market News",
  description:
    "Live market and financial news from Economic Times, LiveMint, and BusinessLine — the headlines that move NIFTY, BANK NIFTY, and SENSEX.",
};

async function NewsFeed() {
  const news = await fetchMarketNews(18);
  if (news.length === 0) {
    return (
      <Card className="py-14 text-center text-sm text-muted">
        News sources aren&apos;t responding right now. Headlines refresh every 15
        minutes — reload this page shortly.
      </Card>
    );
  }
  return <NewsGrid news={news} />;
}

export default function NewsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Market News"
        title="What's moving the market, from sources you'd already trust."
        description="Pulled live from Economic Times, LiveMint, and BusinessLine — refreshed every 15 minutes. Select a headline for a quick summary before you decide to read the full article."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <Suspense fallback={<NewsSkeleton count={9} />}>
            <NewsFeed />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
