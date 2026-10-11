import type { Metadata } from "next";

// The page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Profile",
  description: "Your paper wallet, trading statistics and patterns.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
