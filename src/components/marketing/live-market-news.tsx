import { Newspaper, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { fetchMarketNews } from "@/lib/news";

export async function LiveMarketNews() {
  const news = await fetchMarketNews(6);

  return (
    <section id="market-news" className="scroll-mt-20 border-t border-border py-20 sm:py-28">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-medium text-muted">
              <Newspaper className="h-4 w-4 text-primary" />
              Live market news
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Know what&apos;s moving the market today.
            </h2>
          </div>
        </div>

        {news.length === 0 ? (
          <Card className="mt-8 py-10 text-center text-sm text-muted-2">
            News feed is unavailable right now — check back shortly.
          </Card>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-border-strong group-hover:shadow-lg group-hover:shadow-black/10">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs text-muted-2">
                      {item.source} &middot; {item.time}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-2 transition-colors group-hover:text-primary" />
                  </div>
                  <p className="mt-2.5 text-sm font-medium leading-snug">{item.headline}</p>
                </Card>
              </a>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
