import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in — Trenvora",
};

export default function LoginPage() {
  return (
    <Card>
      <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-1.5 text-sm text-muted">
        Log in to continue practicing.
      </p>

      <LoginForm />

      <div className="mt-5 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3.5 py-3 text-xs text-muted">
        <span className="font-medium text-foreground">Demo account</span> — no
        signup wired up yet:
        <br />
        <span className="font-mono">demo@trenvora.com</span> /{" "}
        <span className="font-mono">demo1234</span>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Start practicing
        </Link>
      </p>
    </Card>
  );
}
