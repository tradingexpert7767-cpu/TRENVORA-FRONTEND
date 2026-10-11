"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { apiFetch, ApiError } from "@/lib/api";

type Step = "email" | "reset";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setStep("reset");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleDigitKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    if (!digits.length) return;
    const next = [...code];
    digits.forEach((d, i) => { if (i < 6) next[i] = d; });
    setCode(next);
    inputRefs.current[Math.min(digits.length, 5)]?.focus();
  }

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6) return;
    setLoading(true);
    setError(null);
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, code: fullCode, newPassword }),
      });
      toast.success("Password reset", { description: "Log in with your new password." });
      router.push("/login");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid or expired code.");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  if (step === "email") {
    return (
      <form onSubmit={handleEmailSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {error && <p role="alert" className="text-sm text-negative">{error}</p>}
        <Button type="submit" disabled={loading} className="mt-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {loading ? "Sending…" : "Send reset code"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleResetSubmit} className="mt-6 flex flex-col gap-4">
      <p className="text-xs text-muted">
        Code sent to <span className="font-medium text-foreground">{email}</span>
      </p>

      <div>
        <Label>6-digit code</Label>
        <div className="mt-1.5 flex gap-2" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleDigitKeyDown(i, e)}
              className="h-12 w-12 rounded-[var(--radius-md)] border border-border bg-surface-2 text-center text-xl font-semibold text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              required
            />
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="new-password">New password</Label>
        <div className="relative mt-1.5">
          <input
            id="new-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            required
            placeholder="At least 8 characters"
            className="h-11 w-full rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 pr-10 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <p className="mt-1.5 text-xs text-muted">At least 8 characters.</p>
      </div>

      {error && <p role="alert" className="text-sm text-negative">{error}</p>}

      <Button type="submit" disabled={loading || code.join("").length !== 6} className="mt-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {loading ? "Resetting…" : "Reset password"}
      </Button>

      <button
        type="button"
        onClick={() => setStep("email")}
        className="text-center text-sm text-muted hover:text-foreground"
      >
        Use a different email
      </button>
    </form>
  );
}
