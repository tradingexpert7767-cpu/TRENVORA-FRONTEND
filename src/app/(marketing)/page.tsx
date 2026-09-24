import { Hero } from "@/components/marketing/hero";
import { CapabilityStrip } from "@/components/marketing/capability-strip";
import { ProblemSolution } from "@/components/marketing/problem-solution";
import { FinalCta } from "@/components/marketing/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <CapabilityStrip />
      <ProblemSolution />
      <FinalCta />
    </>
  );
}
