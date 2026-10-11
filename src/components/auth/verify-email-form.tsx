"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";

export function VerifyEmailForm() {
  const router = useRouter();
  const { verifyOtp, resendOtp, pendingEmail } = useAuthStore();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!pendingEmail) router.replace("/signup");
  }, [pendingEmail, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    if (digits.length === 0) return;
    const next = [...code];
    digits.forEach((d, i) => { if (i < 6) next[i] = d; });
    setCode(next);
    const lastFilled = Math.min(digits.length, 5);
    inputRefs.current[lastFilled]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6 || !pendingEmail) return;
    setLoading(true);
    setError(null);
    try {
      await verifyOtp(pendingEmail, fullCode);
      toast.success("Email verified", { description: "Welcome to Trenvora." });
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code. Try again.");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!pendingEmail || cooldown > 0) return;
    setResending(true);
    try {
      await resendOtp(pendingEmail);
      toast.success("Code resent", { description: "Check your inbox." });
      setCooldown(60);
    } catch {
      toast.error("Failed to resend code");
    } finally {
      setResending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      {pendingEmail && (
        <p className="text-xs text-muted">
          Sent to <span className="font-medium text-foreground">{pendingEmail}</span>
        </p>
      )}

      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
        {code.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="h-12 w-12 rounded-[var(--radius-md)] border border-border bg-surface-2 text-center text-xl font-semibold text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            required
          />
        ))}
      </div>

      {error && (
        <p role="alert" className="text-center text-sm text-negative">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading || code.join("").length !== 6}
        className="mt-2"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {loading ? "Verifying…" : "Verify email"}
      </Button>

      <p className="text-center text-sm text-muted">
        Didn&apos;t receive it?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className="font-medium text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resending ? "Sending…" : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </button>
      </p>
    </form>
  );
}
