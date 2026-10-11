import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Reset password",
};

export default function ForgotPasswordPage() {
  return (
    <Card>
      <h1 className="text-xl font-semibold tracking-tight">Reset your password</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Self-service password reset isn&apos;t available yet. While Trenvora is in
        preview, sign in with the shared demo account shown on the login page.
      </p>
      <Link
        href="/login"
        className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-md)] bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Back to log in
      </Link>
    </Card>
  );
}
