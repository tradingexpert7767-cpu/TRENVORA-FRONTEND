import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pricingTiers } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Pricing — Trenvora",
  description: "Free, Pro, and Pro+ plans for practicing and understanding your trading.",
};

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Start free. Upgrade when you're ready to go deeper."
        description="Every plan includes unlimited access to the core practice loop. Pro and Pro+ unlock deeper AI analysis, replay, and strategy tools."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={cn(
                  "flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20",
                  tier.highlighted && "border-primary shadow-lg shadow-primary/10",
                )}
              >
                <h3 className="text-sm font-medium text-muted">{tier.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight">
                    {tier.price}
                  </span>
                  <span className="text-sm text-muted-2">{tier.period}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {tier.description}
                </p>

                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-positive" />
                      <span className="text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  href="/signup"
                  variant={tier.highlighted ? "primary" : "secondary"}
                  size="md"
                  className="mt-8"
                >
                  {tier.cta}
                </ButtonLink>
              </Card>
            ))}
          </div>

          <p className="mt-10 text-center text-xs text-muted-2">
            Prices shown in INR, configurable and subject to change. No
            guaranteed returns — Trenvora is an educational and simulation
            platform.
          </p>
        </Container>
      </section>
    </>
  );
}
