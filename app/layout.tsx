import type { Metadata } from "next";
import { SiteHeader } from "@/app/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "BluePass",
  description: "WhatsApp-first booking infrastructure for travel operators.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
