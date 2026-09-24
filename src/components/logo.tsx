import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-7 w-7", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
      <path
        d="M8 11h16M16 11v11"
        stroke="var(--color-primary-foreground)"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <path
        d="M20 17l3-4 2 2.5"
        stroke="var(--color-primary-foreground)"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </svg>
  );
}
