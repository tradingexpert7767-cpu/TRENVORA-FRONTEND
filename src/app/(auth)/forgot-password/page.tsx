import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset password",
};

export default function ForgotPasswordPage() {
  return (
    <Card>
      <h1 className="text-xl font-semibold tracking-tight">Reset your password</h1>
      <p className="mt-1.5 text-sm text-muted">
        Enter your email and we&apos;ll send a 6-digit code to reset your password.
      </p>

      <ForgotPasswordForm />

      <p className="mt-6 text-center text-sm text-muted">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </Card>
  );
}
