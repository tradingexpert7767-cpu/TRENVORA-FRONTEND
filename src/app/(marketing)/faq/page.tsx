import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { Container } from "@/components/ui/container";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { faqs } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "FAQ — Trenvora",
  description: "Answers to common questions about paper trading, Trade Guard, AI Coach, and how Trenvora works.",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Frequently asked questions."
        description="If your question isn't answered here, reach out from your account settings once you're signed in."
      />

      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <FaqAccordion items={faqs} />
        </Container>
      </section>
    </>
  );
}
