import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LuxeLens AI | Enterprise Competitive Intelligence",
  description: "Real-time AI-driven strategic advantage for premium luxury retail brands. Predictive pricing, SKU matching, and market sentiment analysis.",
  keywords: ["Luxury Retail", "AI Intelligence", "Pricing Strategy", "Competitive Benchmarking"],
  authors: [{ name: "LuxeLens Engineering" }],
  openGraph: {
    title: "LuxeLens AI | Strategic Retail Suite",
    description: "Enterprise-grade market intelligence for luxury brands.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "LuxeLens AI",
    description: "Real-time AI-driven strategic advantage for luxury retail.",
  },
};

import { Providers } from "./Providers";
import ThemeToggle from "@/components/ThemeToggle";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-foreground bg-background transition-colors duration-300">
        <Providers>
          <ThemeToggle />
          {children}
        </Providers>
      </body>
    </html>
  );
}
