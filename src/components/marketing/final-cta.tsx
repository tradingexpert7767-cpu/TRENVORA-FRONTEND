import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { MarketBeast } from "@/components/marketing/market-beast";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-border py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <Container className="relative text-center">
        <MarketBeast
          kind="bull"
          className="pointer-events-none absolute bottom-0 left-2 hidden h-28 w-32 opacity-60 lg:block"
        />
        <MarketBeast
          kind="bear"
          className="pointer-events-none absolute bottom-0 right-2 hidden h-28 w-32 opacity-60 lg:block"
        />

        <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Train before you trade.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted text-pretty">
          Practice the market before you risk your money.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/signup" size="lg" className="group">
            Start Practicing
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </ButtonLink>
          <ButtonLink href="/pricing" variant="secondary" size="lg">
            View Pricing
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
