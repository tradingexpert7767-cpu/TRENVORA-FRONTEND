import type { Metadata } from "next";
import { PendingPage } from "@/components/marketing/pending-page";

export const metadata: Metadata = {
  title: "Resources",
};

export default function ResourcesPage() {
  return (
    <PendingPage title="Resources">
      <p>
        Guides and learning resources are on the way. In the meantime, the FAQ covers how paper trading, Trade Guard and the AI Coach work.
      </p>
    </PendingPage>
  );
}
