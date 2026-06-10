"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Traveller = {
  name?: string;
  email?: string;
};

export function AuthStatus({ mobile = false, onClick }: { mobile?: boolean; onClick?: () => void }) {
  const router = useRouter();
  const [traveller, setTraveller] = useState<Traveller | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/me")
      .then((response) => response.json() as Promise<{ traveller: Traveller | null }>)
      .then((data) => {
        if (!cancelled) setTraveller(data.traveller);
      })
      .catch(() => {
        if (!cancelled) setTraveller(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    setTraveller(null);
    onClick?.();
    router.refresh();
  }

  if (traveller === undefined) {
    return <div className={mobile ? "h-10" : "h-9 w-28"} />;
  }

  if (traveller) {
    return (
      <div className={mobile ? "grid gap-2" : "flex items-center gap-2"}>
        <span className={mobile ? "px-3 text-sm font-medium text-slate-700" : "max-w-32 truncate text-xs font-semibold text-slate-600"}>
          Hi, {traveller.name ?? traveller.email}
        </span>
        <button
          type="button"
          onClick={logout}
          className={
            mobile
              ? "mobile-menu-link text-left"
              : "bp-focus-ring inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-bluepass-ocean hover:text-bluepass-ocean"
          }
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className={mobile ? "grid gap-2" : "flex items-center gap-2"}>
      <Link
        href="/login"
        onClick={onClick}
        className={
          mobile
            ? "mobile-menu-link"
            : "site-nav-link text-xs font-semibold text-slate-700"
        }
      >
        Log in
      </Link>
    </div>
  );
}
