"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  LineChart,
  History,
  Menu,
  X,
  ShieldAlert,
  Sparkles,
  Dna,
  FlaskConical,
  User,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { useAuthStore } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import { useDialog } from "@/hooks/use-dialog";

const tabs = [
  { href: "/practice", label: "Practice", icon: LineChart },
  { href: "/replay-desk", label: "Replay", icon: History },
  { href: "/insights", label: "DNA", icon: Dna },
];

const exploreLinks = [
  { href: "/trade-guard", label: "Trade Guard", icon: ShieldAlert },
  { href: "/ai-coach", label: "AI Coach", icon: Sparkles },
  { href: "/strategy-lab", label: "Strategy Lab", icon: FlaskConical },
];

export function MobileTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const panelRef = useDialog<HTMLDivElement>(open, () => setOpen(false));
  const drawerTitleId = useId();

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

  return (
    <>
      <nav aria-label="App" className="sticky top-0 z-30 flex items-center border-b border-border bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md lg:hidden">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-h-12 flex-1 items-center justify-center gap-1.5 text-sm font-medium transition-colors",
                active ? "text-foreground" : "text-muted",
              )}
            >
              {active && (
                <motion.span
                  layoutId="mobile-active-tab"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
        <button
          type="button"
          aria-label="More"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="flex h-12 w-14 shrink-0 cursor-pointer items-center justify-center text-muted hover:text-foreground"
        >
          <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={drawerTitleId}
              tabIndex={-1}
              initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
              animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 z-50 flex w-[min(18rem,85vw)] flex-col overflow-y-auto border-l border-border bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] outline-none lg:hidden"
            >
              <h2 id={drawerTitleId} className="sr-only">
                Menu
              </h2>
              <div className="flex items-center justify-between">
                <Link href="/" className="flex min-h-11 items-center gap-2.5" onClick={() => setOpen(false)}>
                  <Logo />
                  <span className="text-[15px] font-semibold tracking-tight">Trenvora</span>
                </Link>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="-mr-2 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] text-muted hover:bg-surface-2 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-1">
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  aria-current={pathname === "/profile" ? "page" : undefined}
                  className="flex min-h-11 items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
                >
                  {user ? (
                    <UserAvatar name={user.name} className="h-6 w-6 text-[10px]" />
                  ) : (
                    <User className="h-4 w-4" strokeWidth={1.75} />
                  )}
                  {user ? user.name : "Profile"}
                </Link>
                <p className="mt-3 px-3 text-xs font-medium uppercase tracking-wider text-muted">
                  Explore features
                </p>
                {exploreLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    {label}
                  </Link>
                ))}
              </div>

              <div className="mt-6 border-t border-border pt-3">
                {user ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex min-h-11 w-full cursor-pointer items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm text-negative transition-colors hover:bg-negative/10"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.75} />
                    Log out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center rounded-[var(--radius-sm)] px-3 text-sm font-medium text-primary hover:bg-primary/10"
                  >
                    Log in
                  </Link>
                )}
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-11 items-center text-sm text-muted hover:text-foreground"
                >
                  Back to Trenvora.com
                </Link>
                <ThemeToggle />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
