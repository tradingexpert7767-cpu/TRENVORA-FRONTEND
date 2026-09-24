import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Start practicing — Trenvora",
};

export default function SignupPage() {
  return (
    <Card>
      <h1 className="text-xl font-semibold tracking-tight">Start practicing</h1>
      <p className="mt-1.5 text-sm text-muted">
        Free forever. No real money, no card required.
      </p>

      <SignupForm />

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>

      <p className="mt-4 text-center text-xs text-muted-2">
        By continuing you agree to Trenvora&apos;s{" "}
        <Link href="/terms" className="underline hover:text-muted">Terms</Link> and{" "}
        <Link href="/privacy" className="underline hover:text-muted">Privacy Policy</Link>.
      </p>
    </Card>
  );
}
