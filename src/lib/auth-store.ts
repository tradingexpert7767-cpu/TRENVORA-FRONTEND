"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiFetch, ApiError } from "@/lib/api";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  subscriptionTier: "FREE" | "PRO" | "PRO_PLUS";
  tradingExperience: string;
  riskPreference: string;
  joinedAt: string;
};

type LoginResponse = { accessToken: string; user: AuthUser };
type VerifyNeededResponse = { requiresVerification: true; email: string };

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  status: "idle" | "loading" | "error";
  error: string | null;
  pendingEmail: string | null;
  login: (email: string, password: string) => Promise<{ requiresVerification?: boolean }>;
  signup: (email: string, password: string, name?: string) => Promise<{ requiresVerification?: boolean }>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
};

async function runAuthRequest(
  set: (partial: Partial<AuthState>) => void,
  path: string,
  body: Record<string, unknown>,
  fallbackErrorByStatus?: Record<number, string>,
): Promise<LoginResponse | VerifyNeededResponse> {
  set({ status: "loading", error: null });
  try {
    const data = await apiFetch<LoginResponse | VerifyNeededResponse>(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
    if ("requiresVerification" in data && data.requiresVerification) {
      set({ pendingEmail: data.email, status: "idle" });
      return data;
    }
    const loginData = data as LoginResponse;
    set({ token: loginData.accessToken, user: loginData.user, status: "idle", error: null, pendingEmail: null });
    return loginData;
  } catch (err) {
    const message =
      err instanceof ApiError
        ? (fallbackErrorByStatus?.[err.status] ?? err.message)
        : "Couldn't reach the server. Is the backend running?";
    set({ status: "error", error: message });
    throw new Error(message);
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      status: "idle",
      error: null,
      pendingEmail: null,

      login: async (email, password) => {
        const result = await runAuthRequest(set, "/auth/login", { email, password }, {
          401: "Incorrect email or password.",
        });
        return "requiresVerification" in result ? { requiresVerification: true } : {};
      },

      signup: async (email, password, name) => {
        const result = await runAuthRequest(set, "/auth/signup", { email, password, name }, {
          409: "An account with this email already exists.",
        });
        return "requiresVerification" in result ? { requiresVerification: true } : {};
      },

      verifyOtp: async (email, code) => {
        await runAuthRequest(set, "/auth/verify-otp", { email, code }, {
          400: "Invalid or expired code. Try again.",
        });
      },

      resendOtp: async (email) => {
        set({ status: "loading", error: null });
        try {
          await apiFetch("/auth/resend-otp", { method: "POST", body: JSON.stringify({ email }) });
          set({ status: "idle" });
        } catch (err) {
          const message = err instanceof ApiError ? err.message : "Failed to resend code.";
          set({ status: "error", error: message });
          throw new Error(message);
        }
      },

      loginWithGoogle: async (idToken) => {
        await runAuthRequest(set, "/auth/google", { idToken });
      },

      logout: () => set({ token: null, user: null, status: "idle", error: null, pendingEmail: null }),
    }),
    {
      name: "trenvora-auth",
      partialize: (s) => ({ token: s.token, user: s.user, pendingEmail: s.pendingEmail }),
    },
  ),
);
