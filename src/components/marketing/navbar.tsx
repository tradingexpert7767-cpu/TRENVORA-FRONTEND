"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { useAuthStore } from "@/lib/auth-store";

const links = [
  { href: "/features", label: "Features" },
  { href: "/#market-news", label: "News" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Logo />
          <span className="text-[15px] font-semibold tracking-tight">Trenvora</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[var(--radius-sm)] px-3.5 py-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {user ? (
            <Link href="/profile" className="flex items-center gap-2 rounded-full p-0.5 transition-opacity hover:opacity-80">
              <UserAvatar name={user.name} className="h-8 w-8" />
            </Link>
          ) : (
            <ButtonLink href="/login" variant="ghost" size="sm">
              Login
            </ButtonLink>
          )}
          <ButtonLink href="/signup" variant="primary" size="sm">
            Start Practicing
          </ButtonLink>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] text-foreground"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-[var(--radius-sm)] px-3 py-2.5 text-sm text-muted hover:bg-surface hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2.5 border-t border-border pt-4">
              {user ? (
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2 py-2 hover:bg-surface"
                >
                  <UserAvatar name={user.name} />
                  <span className="text-sm font-medium">{user.name}</span>
                </Link>
              ) : (
                <ButtonLink href="/login" variant="secondary" size="md">
                  Login
                </ButtonLink>
              )}
              <ButtonLink href="/signup" variant="primary" size="md">
                Start Practicing
              </ButtonLink>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
