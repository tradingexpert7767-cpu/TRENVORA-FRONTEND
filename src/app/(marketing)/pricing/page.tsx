import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pricingTiers } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Free, Pro, and Pro+ plans for practicing and understanding your trading.",
};

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Start free. Upgrade when you're ready to go deeper."
        description="The Free plan covers the core practice loop on equities. Pro and Pro+ add index options, deeper AI analysis, replay, and strategy tools."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="sr-only">Plans</h2>
          <div className="mx-auto grid max-w-md gap-6 md:max-w-none md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={cn(
                  "relative flex flex-col",
                  tier.highlighted && "border-primary shadow-lg shadow-primary/10",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-medium text-muted">{tier.name}</h3>
                  {tier.highlighted && <Badge tone="positive">Most popular</Badge>}
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight tabular-nums">
                    {tier.price}
                  </span>
                  <span className="text-sm text-muted">{tier.period}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {tier.description}
                </p>

                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-positive" aria-hidden="true" />
                      <span className="text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  href={`/signup?plan=${tier.name.toLowerCase().replace("+", "-plus")}`}
                  variant={tier.highlighted ? "primary" : "secondary"}
                  size="md"
                  className="mt-8"
                >
                  {tier.cta}
                </ButtonLink>
              </Card>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-muted">
            Prices shown in INR, configurable and subject to change. No
            guaranteed returns — Trenvora is an educational and simulation
            platform.
          </p>
        </Container>
      </section>
    </>
  );
}
