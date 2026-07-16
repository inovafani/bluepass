import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ScrollRevealInit } from "@/app/components/ScrollRevealInit";
import { KaiWebChat } from "@/app/components/kai/KaiWebChat";
import { ReferralCapture } from "@/app/components/referrals/ReferralCapture";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-loaded",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-loaded",
});

export const metadata: Metadata = {
  title: "BluePass",
  description: "WhatsApp-first booking infrastructure for travel operators.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen antialiased">
        <SiteHeader />
        <ScrollRevealInit />
        <ReferralCapture />
        <main>{children}</main>
        <KaiWebChat />
      </body>
    </html>
  );
}
