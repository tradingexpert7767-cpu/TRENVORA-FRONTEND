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
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      status: "idle",
      error: null,
      login: async (email, password) => {
        set({ status: "loading", error: null });
        try {
          const data = await apiFetch<LoginResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
          });
          set({ token: data.accessToken, user: data.user, status: "idle", error: null });
        } catch (err) {
          const message =
            err instanceof ApiError
              ? err.status === 401
                ? "Incorrect email or password."
                : err.message
              : "Couldn't reach the server. Is the backend running?";
          set({ status: "error", error: message });
          throw new Error(message);
        }
      },
      logout: () => set({ token: null, user: null, status: "idle", error: null }),
    }),
    { name: "trenvora-auth", partialize: (s) => ({ token: s.token, user: s.user }) },
  ),
);
