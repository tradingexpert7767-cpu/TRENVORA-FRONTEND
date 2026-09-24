import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-dvh flex-1 flex-col items-center justify-center px-5 py-16">
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <Logo />
        <span className="text-[15px] font-semibold tracking-tight">Trenvora</span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}
