import { X, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";

const problems = [
  "Emotional, undocumented entries",
  "Position sizing that creeps up after wins",
  "Exiting early out of fear, missing the plan",
  "Revenge trades after a loss",
  "No structured journal to learn from",
];

const solutions = [
  "Every trade requires a documented thesis, risk, and target before entry",
  "Deterministic risk engine flags oversized positions in real time",
  "Trade Autopsy separates process quality from outcome, every time",
  "Trading DNA tracks discipline, patience, and FOMO over months",
  "Automatic journal + AI Coach turn every trade into a lesson",
];

export function ProblemSolution() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Most traders remember their P&amp;L.
            <br />
            They forget their behaviour.
          </h2>
          <p className="mt-4 text-lg text-muted text-pretty">
            Trenvora turns every trade into a learning opportunity.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Card className="border-negative/20">
            <h3 className="text-sm font-medium text-negative">Without Trenvora</h3>
            <ul className="mt-5 flex flex-col gap-4">
              {problems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-negative" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-positive/20">
            <h3 className="text-sm font-medium text-positive">With Trenvora</h3>
            <ul className="mt-5 flex flex-col gap-4">
              {solutions.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-positive" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Container>
    </section>
  );
}
