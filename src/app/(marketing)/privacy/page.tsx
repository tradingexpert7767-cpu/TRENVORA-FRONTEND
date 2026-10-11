import type { Metadata } from "next";
import { PendingPage } from "@/components/marketing/pending-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <PendingPage title="Privacy Policy">
      <p>
        Our privacy policy is being finalised and will be published here before public launch. Today, paper trades are stored only in your browser on this device.
      </p>
    </PendingPage>
  );
}
