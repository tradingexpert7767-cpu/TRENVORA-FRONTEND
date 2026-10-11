import type { Metadata } from "next";
import { PendingPage } from "@/components/marketing/pending-page";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsofServicePage() {
  return (
    <PendingPage title="Terms of Service">
      <p>
        Trenvora&apos;s terms of service are being finalised and will be published here before public launch. Trenvora is a simulated, educational trading platform — no real money is traded.
      </p>
    </PendingPage>
  );
}
