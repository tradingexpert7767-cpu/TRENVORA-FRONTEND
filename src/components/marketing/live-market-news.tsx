import { Suspense } from "react";
import Link from "next/link";
import { Newspaper, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { NewsGrid } from "@/components/marketing/news-grid";
import { NewsSkeleton } from "@/components/marketing/news-skeleton";
import { fetchMarketNews } from "@/lib/news";

// Headlines come from external RSS feeds; stream them in behind a skeleton
// so a slow source never holds up the section header or the rest of the page.
async function NewsFeed() {
  const news = await fetchMarketNews(6);
  if (news.length === 0) {
    return (
      <Card className="mt-8 py-10 text-center text-sm text-muted">
        News sources aren&apos;t responding right now. Headlines refresh every 15
        minutes —{" "}
        <Link href="/news" className="font-medium text-primary hover:underline">
          try the news page
        </Link>{" "}
        again shortly.
      </Card>
    );
  }
  return <NewsGrid news={news} className="mt-8" />;
}

export function LiveMarketNews() {
  return (
    <section id="market-news" className="relative scroll-mt-20 overflow-hidden border-t border-border py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-medium text-muted">
              <Newspaper className="h-4 w-4 text-primary" aria-hidden="true" />
              Latest market news
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Know what&apos;s moving the market today.
            </h2>
          </div>
          <Link
            href="/news"
            className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all news
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <Suspense fallback={<NewsSkeleton className="mt-8" />}>
          <NewsFeed />
        </Suspense>
      </Container>
    </section>
  );
}
