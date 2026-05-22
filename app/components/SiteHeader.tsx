"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/explore-indonesia", label: "Explore", aliases: ["/trips"] },
  { href: "/for-operators", label: "Operators" },
  { href: "/conservation", label: "Conservation" },
  { href: "/creators", label: "Creators" },
];

function isActivePath(
  pathname: string,
  item: { href: string; aliases?: string[] },
) {
  if (item.href === "/") {
    return pathname === "/";
  }

  return (
    pathname === item.href ||
    pathname.startsWith(`${item.href}/`) ||
    item.aliases?.some(
      (alias) => pathname === alias || pathname.startsWith(`${alias}/`),
    ) === true
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const signupActive = pathname === "/signup";

  return (
    <header className="site-header border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="site-brand flex items-center gap-2.5 text-lg font-semibold tracking-tight"
        >
          <span className="site-brand-mark">BP/</span>
          <span className="site-brand-name">BluePass</span>
        </Link>
        <div className="site-nav flex flex-wrap justify-end gap-4 text-sm text-slate-700">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item);

            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="site-nav-link"
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <Link
          href="/signup"
          aria-current={signupActive ? "page" : undefined}
          className="site-operator hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.02em] text-slate-800 shadow-sm transition-colors hover:border-bluepass-ocean hover:text-bluepass-ocean sm:inline-flex"
        >
          <span>Sign up BluePass</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </Link>
      </nav>
    </header>
  );
}
