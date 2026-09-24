import Link from "next/link";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui/container";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/practice", label: "Practice" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/resources", label: "Resources" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/disclosures", label: "Disclosures" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <Container className="py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo />
              <span className="text-[15px] font-semibold tracking-tight">
                Trenvora
              </span>
            </Link>
            <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-2">
              A Modern Trading Technology
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-2">
              Practice the market before you risk your money.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-2">
                {col.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-2">
            &copy; {new Date().getFullYear()} Trenvora. All simulated trading
            data is for educational purposes only and does not constitute
            financial advice.
          </p>
        </div>
      </Container>
    </footer>
  );
}
