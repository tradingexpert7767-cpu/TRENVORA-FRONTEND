import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="border-t border-border py-20 sm:py-28">
      <Container className="text-center">
        <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Train before you trade.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted text-pretty">
          Practice the market before you risk your money.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/practice" size="lg">
            Start Practicing
            <ArrowUpRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/pricing" variant="secondary" size="lg">
            View Pricing
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
