"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  LineChart,
  History,
  ShieldAlert,
  Sparkles,
  Dna,
  FlaskConical,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { ButtonLink } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

const primaryLinks = [
  { href: "/practice", label: "Practice", icon: LineChart },
  { href: "/replay-desk", label: "Market Replay", icon: History },
  { href: "/insights", label: "Trading DNA", icon: Dna },
];

// Product tours on the marketing site — they leave the app shell.
const exploreLinks = [
  { href: "/trade-guard", label: "Trade Guard", icon: ShieldAlert },
  { href: "/ai-coach", label: "AI Coach", icon: Sparkles },
  { href: "/strategy-lab", label: "Strategy Lab", icon: FlaskConical },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 border-r border-border lg:flex lg:flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <Link href="/" className="flex min-h-11 items-center gap-2.5">
          <Logo />
          <span className="text-[15px] font-semibold tracking-tight">Trenvora</span>
        </Link>
        <ThemeToggle />
      </div>

      <nav aria-label="App" className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-1">
          {primaryLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-10 items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm transition-colors",
                  active ? "text-primary" : "text-muted hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 rounded-[var(--radius-sm)] bg-primary/10"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <Icon className="relative h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                <span className="relative">{label}</span>
              </Link>
            );
          })}
        </div>

        <div>
          <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted">
            Explore features
          </p>
          <div className="mt-2 flex flex-col gap-1">
            {exploreLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex min-h-10 items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                {label}
                <ArrowUpRight className="ml-auto h-3.5 w-3.5 opacity-60" aria-hidden="true" />
                <span className="sr-only">(product tour)</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="border-t border-border p-3">
        {user ? (
          <div className="flex flex-col gap-1">
            <Link
              href="/profile"
              aria-current={pathname === "/profile" ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2 py-2 transition-colors hover:bg-surface",
                pathname === "/profile" && "bg-surface-2",
              )}
            >
              <UserAvatar name={user.name} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-2">{user.email}</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-[var(--radius-sm)] px-2 py-2 text-sm text-negative transition-colors hover:bg-negative/10"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </button>
          </div>
        ) : (
          <ButtonLink href="/login" variant="secondary" size="sm" className="w-full">
            Log in
          </ButtonLink>
        )}
      </div>
    </aside>
  );
}
