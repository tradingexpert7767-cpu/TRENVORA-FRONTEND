"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import {
  LogOut,
  Wallet,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Newspaper,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink, Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { InstrumentSymbol } from "@/components/instrument-symbol";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { ScoreRing } from "@/components/trading/score-ring";
import { useAuthStore } from "@/lib/auth-store";
import { useTradeStore } from "@/lib/trade-store";
import { availableBalance, usedMargin, totalEquity } from "@/lib/wallet";
import { analyzeTrades } from "@/lib/behavior-analysis";
import type { LiveNewsItem } from "@/lib/news";
import { cn } from "@/lib/utils";

function formatInr(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const positions = useTradeStore((s) => s.positions);
  const history = useTradeStore((s) => s.history);

  const wallet = useMemo(
    () => ({
      available: availableBalance(positions, history),
      used: usedMargin(positions),
      equity: totalEquity(history),
    }),
    [positions, history],
  );

  const behavior = useMemo(() => analyzeTrades(history), [history]);
  const recentTrades = history.slice(0, 5);

  const [news, setNews] = useState<LiveNewsItem[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setNews(data.news ?? []);
      })
      .catch(() => {
        if (!cancelled) setNews([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!user) {
    return (
      <div className="flex min-h-[70dvh] flex-1 flex-col items-center justify-center p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <h1 className="mt-4 text-xl font-semibold">You&apos;re not logged in</h1>
        <p className="mt-1.5 max-w-xs text-sm text-muted">
          Log in to see your profile, wallet, trading statistics, and behavioural insights.
        </p>
        <ButtonLink href="/login" size="lg" className="mt-6">
          Log in
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-8">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <UserAvatar name={user.name} className="h-14 w-14 text-base" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">{user.name}</h1>
              <Badge tone="intelligence">{user.subscriptionTier}</Badge>
            </div>
            <p className="mt-0.5 text-sm text-muted">{user.email}</p>
            <p className="mt-1 text-xs text-muted-2">
              {user.tradingExperience} trader &middot; {user.riskPreference.toLowerCase()} risk &middot;
              joined {new Date(user.joinedAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={logout}>
          <LogOut className="h-3.5 w-3.5" />
          Log out
        </Button>
      </motion.div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}>
          <Card>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-2">
              <Wallet className="h-3.5 w-3.5" />
              Paper wallet
            </div>
            <AnimatedNumber
              value={wallet.available}
              format={formatInr}
              className="mt-2 block font-mono text-2xl font-semibold tracking-tight"
            />
            <p className="mt-1 text-xs text-muted-2">
              {formatInr(wallet.used)} in open positions &middot; {formatInr(wallet.equity)} total equity
            </p>
            <ButtonLink href="/practice" variant="secondary" size="sm" className="mt-4 w-full">
              Go to Practice
            </ButtonLink>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}>
          <Card>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-2">
              <TrendingUp className="h-3.5 w-3.5" />
              Trading statistics
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-2">Trades closed</p>
                <p className="mt-1 font-mono text-lg font-semibold">{behavior.stats.totalTrades}</p>
              </div>
              <div>
                <p className="text-xs text-muted-2">Win rate</p>
                <p className="mt-1 font-mono text-lg font-semibold">
                  {behavior.hasEnoughData ? `${behavior.stats.winRate}%` : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-2">Open positions</p>
                <p className="mt-1 font-mono text-lg font-semibold">{positions.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-2">Realized P&amp;L</p>
                <p
                  className={cn(
                    "mt-1 font-mono text-lg font-semibold",
                    wallet.equity - 500000 >= 0 ? "text-positive" : "text-negative",
                  )}
                >
                  {formatInr(wallet.equity - 500000)}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}>
          <Card className="flex items-center gap-4">
            <ScoreRing score={behavior.disciplineScore} />
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-2">Discipline score</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {behavior.hasEnoughData
                  ? behavior.insights[0].title
                  : "Close a few paper trades to unlock this."}
              </p>
              <Link
                href="/insights"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-intelligence hover:underline"
              >
                View Trading DNA
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4} className="mt-5">
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-muted-2">Recent trades</p>
            <Link href="/practice" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          {recentTrades.length === 0 ? (
            <p className="mt-4 text-sm text-muted-2">
              No closed trades yet. Head to Practice to place your first paper trade.
            </p>
          ) : (
            <div className="mt-4 flex flex-col divide-y divide-border">
              {recentTrades.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2.5">
                    <InstrumentSymbol instrument={t.instrument} />
                    <div>
                      <p className="text-sm font-medium">{t.instrument}</p>
                      <p className="text-xs text-muted-2">
                        {t.side} &middot; Qty {t.quantity}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "font-mono text-sm font-medium",
                      t.pnl >= 0 ? "text-positive" : "text-negative",
                    )}
                  >
                    {t.pnl >= 0 ? "+" : "-"}
                    {formatInr(Math.abs(t.pnl))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5} className="mt-5">
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-2">
              <Sparkles className="h-3.5 w-3.5" />
              Your patterns
            </div>
            <Link
              href="/insights"
              className="inline-flex items-center gap-1 text-xs font-medium text-intelligence hover:underline"
            >
              Full analysis
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-3 flex flex-col divide-y divide-border">
            {behavior.insights.slice(0, 3).map((insight) => (
              <div key={insight.id} className="py-3 first:pt-0 last:pb-0">
                <p className="text-sm font-medium">{insight.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{insight.detail}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-intelligence">
                  How to improve: {insight.action}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6} className="mt-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-2">
          <Newspaper className="h-3.5 w-3.5" />
          Market news
        </div>
        <p className="mt-1 text-xs text-muted-2">
          Live from Economic Times, LiveMint, and BusinessLine.
        </p>
        {news === null ? (
          <p className="mt-4 text-sm text-muted-2">Loading news…</p>
        ) : news.length === 0 ? (
          <p className="mt-4 text-sm text-muted-2">News feed is unavailable right now.</p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {news.map((item) => (
              <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" className="group">
                <Card className="h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-border-strong group-hover:shadow-lg group-hover:shadow-black/10">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs text-muted-2">
                      {item.source} &middot; {item.time}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-2 transition-colors group-hover:text-primary" />
                  </div>
                  <p className="mt-2.5 text-sm font-medium leading-snug">{item.headline}</p>
                </Card>
              </a>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
