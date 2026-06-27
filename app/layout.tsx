import type { Metadata } from "next";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RouteProgressBar from "@/components/ui/loading/RouteProgressBar";
import { OrganizationSchema } from "@/components/seo/JsonLd";
import SearchModal from "@/components/search/SearchModal";
import SearchShortcutHandler from "@/components/search/SearchShortcutHandler";
import Toaster from "@/components/ui/Toaster";
import CookieConsentBanner from "@/components/analytics/CookieConsentBanner";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "MLBuilder — Cut the AI Noise, Build for Real",
  description: "AI automation breakdowns, research digests in plain English, and free tools — all in one place. Built for people who actually want to ship things.",
  metadataBase: new URL("https://mlbuilder.in"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <div className="min-h-screen flex flex-col bg-cream">
            <OrganizationSchema />
            <Suspense fallback={null}>
              <RouteProgressBar />
            </Suspense>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Suspense fallback={null}>
            <SearchModal />
          </Suspense>
          <SearchShortcutHandler />
          <Toaster />
          <CookieConsentBanner />
        </Providers>
      </body>
    </html>
  );
}
