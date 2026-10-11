import type { Metadata } from "next";

// The page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Market Replay",
  description: "Replay historical sessions candle by candle and trade them with no hindsight.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
