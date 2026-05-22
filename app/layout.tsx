import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "BluePass",
  description: "WhatsApp-first booking infrastructure for travel operators.",
};

const navItems = [
  { href: "/", label: "Explore" },
  { href: "/for-operators", label: "Operators" },
  { href: "/conservation", label: "Conservation" },
  { href: "/creators", label: "Creators" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="site-header border-b border-slate-200 bg-white/90 backdrop-blur">
          <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <Link href="/" className="site-brand flex items-center gap-2.5 text-lg font-semibold tracking-tight">
              <span className="site-brand-mark">BP/</span>
              <span className="site-brand-name">BluePass</span>
            </Link>
            <div className="site-nav flex flex-wrap justify-end gap-4 text-sm text-slate-700">
              {navItems.map((item) => (
                <Link key={`${item.href}-${item.label}`} href={item.href} className="hover:text-bluepass-ocean">
                  {item.label}
                </Link>
              ))}
            </div>
            <Link href="/signup" className="site-operator hidden text-sm text-slate-700 hover:text-bluepass-ocean sm:inline-flex">
              Sign up BluePass
            </Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
