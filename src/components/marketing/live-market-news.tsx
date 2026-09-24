import Link from "next/link";
import { Newspaper, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { NewsGrid } from "@/components/marketing/news-grid";
import { fetchMarketNews } from "@/lib/news";

export async function LiveMarketNews() {
  const news = await fetchMarketNews(6);

  return (
    <section id="market-news" className="scroll-mt-20 border-t border-border py-20 sm:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-medium text-muted">
              <Newspaper className="h-4 w-4 text-primary" />
              Live market news
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Know what&apos;s moving the market today.
            </h2>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all news
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {news.length === 0 ? (
          <Card className="mt-8 py-10 text-center text-sm text-muted-2">
            News feed is unavailable right now — check back shortly.
          </Card>
        ) : (
          <NewsGrid news={news} className="mt-8" />
        )}
      </Container>
    </section>
  );
}
