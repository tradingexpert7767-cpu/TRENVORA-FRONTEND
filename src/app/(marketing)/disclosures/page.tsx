import type { Metadata } from "next";
import { PendingPage } from "@/components/marketing/pending-page";

export const metadata: Metadata = {
  title: "Disclosures",
};

export default function DisclosuresPage() {
  return (
    <PendingPage title="Disclosures">
      <p>
        Full regulatory disclosures are being prepared. Trenvora is an educational simulation: nothing on this site is investment advice, and simulated results do not guarantee future returns.
      </p>
    </PendingPage>
  );
}
