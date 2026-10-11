import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { TickerStrip } from "@/components/marketing/ticker-strip";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border pt-16 pb-10 sm:pt-20 sm:pb-12">
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
        <Badge tone="intelligence">{eyebrow}</Badge>
        <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted text-pretty">
          {description}
        </p>
        {children}
        <TickerStrip />
      </Container>
    </section>
  );
}
