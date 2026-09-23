import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { SiteForSaleDialog } from "@/components/layout/SiteForSaleDialog";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mobilnahiska-next.vercel.app"),
  title: "mobilnahiska.si — Mobilne in modularne hiške naprodaj",
  description:
    "Slovenski marketplace za nakup in prodajo mobilnih hišk, modularnih hiš, novih in rabljenih ponudb.",
  robots: {
    index: false,
    follow: false,
  },
};

// Temporary "site for sale" messaging while the domain is on the market.
// Set NEXT_PUBLIC_SHOW_SALE_BANNER=false in the environment to turn it off
// for a normal production launch without touching this file again.
const SHOW_SALE_BANNER = process.env.NEXT_PUBLIC_SHOW_SALE_BANNER !== "false";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="sl"
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {SHOW_SALE_BANNER && <TopBar />}
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        {SHOW_SALE_BANNER && <SiteForSaleDialog />}
      </body>
    </html>
  );
}
