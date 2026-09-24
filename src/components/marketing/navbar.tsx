"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { UserMenu } from "@/components/user-menu";
import { useAuthStore } from "@/lib/auth-store";

const links = [
  { href: "/features", label: "Features" },
  { href: "/news", label: "News" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const pathname = usePathname();

  // A hash link to a section on the page you're already on doesn't
  // auto-scroll via Next's router (only full navigations trigger that) —
  // so scroll it into view ourselves when that's the case.
  function handleNavClick(e: React.MouseEvent, href: string) {
    setOpen(false);
    if (href.startsWith("/#") && pathname === "/") {
      const id = href.slice(2);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", href);
      }
    }
  }

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

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
              onClick={(e) => handleNavClick(e, link.href)}
              className="rounded-[var(--radius-sm)] px-3.5 py-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} />
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
                onClick={(e) => handleNavClick(e, link.href)}
                className="rounded-[var(--radius-sm)] px-3 py-2.5 text-sm text-muted hover:bg-surface hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2.5 border-t border-border pt-4">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2 py-2 hover:bg-surface"
                  >
                    <UserAvatar name={user.name} />
                    <span className="text-sm font-medium">{user.name}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex cursor-pointer items-center gap-2.5 rounded-[var(--radius-sm)] px-2 py-2 text-sm text-negative hover:bg-negative/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </>
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
