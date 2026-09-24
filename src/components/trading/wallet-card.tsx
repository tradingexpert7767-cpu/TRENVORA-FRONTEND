"use client";

import { Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { STARTING_BALANCE } from "@/lib/wallet";
import { cn } from "@/lib/utils";

function formatInr(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function WalletCard({
  available,
  used,
  equity,
}: {
  available: number;
  used: number;
  equity: number;
}) {
  const pnl = equity - STARTING_BALANCE;

  return (
    <Card>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-2">
        <Wallet className="h-3.5 w-3.5" />
        Paper wallet
      </div>

      <div className="mt-3">
        <p className="text-xs text-muted-2">Available balance</p>
        <AnimatedNumber
          value={available}
          format={formatInr}
          className="mt-1 block font-mono text-2xl font-semibold tracking-tight"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
        <div>
          <p className="text-xs text-muted-2">In open positions</p>
          <p className="mt-1 font-mono text-sm font-medium">{formatInr(used)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-2">Total equity</p>
          <p className="mt-1 font-mono text-sm font-medium">
            {formatInr(equity)}{" "}
            <span className={cn("text-xs", pnl >= 0 ? "text-positive" : "text-negative")}>
              ({pnl >= 0 ? "+" : "-"}
              {formatInr(Math.abs(pnl))})
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}
