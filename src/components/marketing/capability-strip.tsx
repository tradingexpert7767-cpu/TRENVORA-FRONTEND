import Link from "next/link";
import {
  LineChart,
  ShieldAlert,
  Sparkles,
  History,
  Dna,
  FlaskConical,
} from "lucide-react";
import { Container } from "@/components/ui/container";

const items = [
  { href: "/features", icon: LineChart, label: "Paper Trading" },
  { href: "/trade-guard", icon: ShieldAlert, label: "Trade Guard" },
  { href: "/ai-coach", icon: Sparkles, label: "AI Coach" },
  { href: "/replay", icon: History, label: "Market Replay" },
  { href: "/features#trading-dna", icon: Dna, label: "Trading DNA" },
  { href: "/strategy-lab", icon: FlaskConical, label: "Strategy Lab" },
];

export function CapabilityStrip() {
  return (
    <section className="border-y border-border py-10">
      <Container>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {items.map(({ href, icon: Icon, label }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-2.5 rounded-[var(--radius-md)] border border-transparent px-3 py-5 text-center transition-colors hover:border-border hover:bg-surface"
            >
              <Icon className="h-5 w-5 text-muted-2" strokeWidth={1.75} />
              <span className="text-xs font-medium text-muted">{label}</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
