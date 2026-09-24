import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

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
    <section className="border-b border-border pt-16 pb-14 sm:pt-20 sm:pb-16">
      <Container>
        <Badge tone="intelligence">{eyebrow}</Badge>
        <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted text-pretty">
          {description}
        </p>
        {children}
      </Container>
    </section>
  );
}
