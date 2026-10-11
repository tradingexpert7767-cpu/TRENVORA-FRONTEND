import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { Container } from "@/components/ui/container";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { faqs } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about paper trading, Trade Guard, AI Coach, and how Trenvora works.",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Frequently asked questions."
        description="How paper trading, Trade Guard, the AI Coach and your data work. For a tour of each tool, see the Features page."
      />

      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <FaqAccordion items={faqs} />
        </Container>
      </section>
    </>
  );
}
