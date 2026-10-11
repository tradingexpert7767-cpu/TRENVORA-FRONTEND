import { Sidebar } from "@/components/app-shell/sidebar";
import { MobileTabs } from "@/components/app-shell/mobile-tabs";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTabs />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">{children}</main>
      </div>
    </div>
  );
}
