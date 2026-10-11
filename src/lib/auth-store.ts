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

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  status: "idle" | "loading" | "error";
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
};

async function runAuthRequest(
  set: (partial: Partial<AuthState>) => void,
  path: string,
  body: Record<string, unknown>,
  fallbackErrorByStatus?: Record<number, string>,
) {
  set({ status: "loading", error: null });
  try {
    const data = await apiFetch<LoginResponse>(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
    set({ token: data.accessToken, user: data.user, status: "idle", error: null });
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
      login: (email, password) =>
        runAuthRequest(set, "/auth/login", { email, password }, { 401: "Incorrect email or password." }),
      signup: (email, password, name) =>
        runAuthRequest(set, "/auth/signup", { email, password, name }, {
          409: "An account with this email already exists.",
        }),
      loginWithGoogle: (idToken) => runAuthRequest(set, "/auth/google", { idToken }),
      logout: () => set({ token: null, user: null, status: "idle", error: null }),
    }),
    { name: "trenvora-auth", partialize: (s) => ({ token: s.token, user: s.user }) },
  ),
);
