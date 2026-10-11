"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { User, LogOut } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { useAuthStore, type AuthUser } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

export function UserMenu({ user, className }: { user: AuthUser; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-opacity hover:opacity-80"
      >
        <UserAvatar name={user.name} className="h-8 w-8" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-[var(--radius-md)] border border-border-strong bg-surface shadow-xl"
          >
            <div className="border-b border-border px-3.5 py-3">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-2">{user.email}</p>
            </div>
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex min-h-10 items-center gap-2.5 px-3.5 py-2.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              role="menuitem"
              className="flex min-h-10 w-full cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-negative transition-colors hover:bg-negative/10"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
