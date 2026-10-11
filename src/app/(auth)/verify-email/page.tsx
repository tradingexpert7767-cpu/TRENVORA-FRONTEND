import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export const metadata: Metadata = {
  title: "Verify your email",
};

export default function VerifyEmailPage() {
  return (
    <Card>
      <h1 className="text-xl font-semibold tracking-tight">Check your inbox</h1>
      <p className="mt-1.5 text-sm text-muted">
        We sent a 6-digit code to your email. Enter it below to activate your account.
      </p>
      <VerifyEmailForm />
    </Card>
  );
}
