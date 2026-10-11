import type { Metadata } from "next";

// The page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Trading DNA",
  description: "Your behavioural profile, built from your own paper trades.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
