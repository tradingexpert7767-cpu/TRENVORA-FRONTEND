import type { ReactNode } from "react";
import { FileClock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";

// Placeholder for pages that are linked from the site but whose content
// hasn't been written yet — better an honest page than a 404.
export function PendingPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <Card className="flex flex-col items-start gap-4 p-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-warning/10 text-warning">
            <FileClock className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <div className="text-sm leading-relaxed text-muted">{children}</div>
          <ButtonLink href="/" variant="secondary" size="md" className="mt-2">
            Back to home
          </ButtonLink>
        </Card>
      </Container>
    </section>
  );
}
