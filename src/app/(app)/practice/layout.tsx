import type { Metadata } from "next";

// The page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Practice",
  description: "Simulated paper trading on NIFTY, BANK NIFTY and SENSEX — spot and options.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
