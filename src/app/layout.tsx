import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trenvora — A Modern Trading Technology",
  description:
    "Trenvora combines paper trading, market intelligence, AI-powered trade analysis, historical replay, and behavioural insights to help traders understand and improve their decision-making.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{var t=localStorage.getItem('trenvora-theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light')}}catch(e){}`}
        </Script>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
