import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "BluePass",
  description: "WhatsApp-first booking infrastructure for travel operators.",
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/for-operators", label: "Operators" },
  { href: "/conservation", label: "Conservation" },
  { href: "/creators", label: "Creators" },
  { href: "/about", label: "About" },
  { href: "/app", label: "App" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              BluePass
            </Link>
            <div className="flex flex-wrap justify-end gap-4 text-sm text-slate-700">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-bluepass-ocean">
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
