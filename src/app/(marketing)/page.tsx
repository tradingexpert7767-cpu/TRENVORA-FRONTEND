import { Hero } from "@/components/marketing/hero";
import { WhyTrenvora } from "@/components/marketing/why-trenvora";
import { LiveMarketNews } from "@/components/marketing/live-market-news";
import { FinalCta } from "@/components/marketing/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyTrenvora />
      <LiveMarketNews />
      <FinalCta />
    </>
  );
}
