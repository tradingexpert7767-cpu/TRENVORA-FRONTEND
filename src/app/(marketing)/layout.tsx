import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">{children}</main>
      <Footer />
    </>
  );
}
