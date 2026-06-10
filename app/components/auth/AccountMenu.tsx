"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type Traveller = {
  name?: string;
  email?: string;
  roles?: string[];
  creatorProfile?: {
    status: string;
    handle?: string | null;
  } | null;
  operatorProfile?: {
    status: string;
    companyName?: string | null;
  } | null;
};

export function AccountMenu({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const [traveller, setTraveller] = useState<Traveller | null | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const loadTraveller = useCallback(() => {
    let cancelled = false;

    fetch("/api/auth/me", {
      cache: "no-store",
      credentials: "same-origin",
    })
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

  useEffect(() => {
    return loadTraveller();
  }, [loadTraveller, pathname]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    setTraveller(null);
    setOpen(false);
    onNavigate?.();
    router.refresh();
  }

  if (mobile) {
    return (
      <div className="mt-2 border-t border-slate-200 pt-2">
        {traveller ? (
          <>
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              {traveller.name ?? traveller.email}
            </p>
            <div className="px-3 pb-2">
              <RoleBadges traveller={traveller} />
            </div>
            <Link href="/dashboard" onClick={onNavigate} className="mobile-menu-link">
              Dashboard
            </Link>
            <button type="button" onClick={logout} className="mobile-menu-link w-full text-left">
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" onClick={onNavigate} className="mobile-menu-link">
              Sign in
            </Link>
            <Link href="/register" onClick={onNavigate} className="mobile-menu-link">
              Create account
            </Link>
          </>
        )}
      </div>
    );
  }

  const initials = buildInitials(traveller);

  return (
    <div ref={menuRef} className="site-account">
      <button
        type="button"
        className="site-account-button bp-focus-ring"
        aria-label={traveller ? "Open account menu" : "Sign in or create account"}
        aria-expanded={open}
        onClick={() => {
          if (!open) {
            loadTraveller();
          }
          setOpen((value) => !value);
        }}
      >
        {traveller ? (
          <span aria-hidden="true">{initials}</span>
        ) : (
          <UserIcon />
        )}
      </button>

      {open && (
        <div className="site-account-menu">
          {traveller ? (
            <>
              <div className="site-account-summary">
                <span className="site-account-kicker">Signed in</span>
                <span className="site-account-name">{traveller.name ?? "BluePass traveller"}</span>
                {traveller.email && <span className="site-account-email">{traveller.email}</span>}
                <RoleBadges traveller={traveller} />
              </div>
              <Link href="/dashboard" className="site-account-item" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
              <Link href="/signup#join" className="site-account-item" onClick={() => setOpen(false)}>
                Apply as creator/operator
              </Link>
              <button type="button" onClick={logout} className="site-account-item">
                Log out
              </button>
            </>
          ) : (
            <>
              <div className="site-account-summary">
                <span className="site-account-kicker">BluePass account</span>
                <span className="site-account-name">Sign in once for traveller, creator, and operator access.</span>
              </div>
              <Link href="/login" className="site-account-item" onClick={() => setOpen(false)}>
                Sign in
              </Link>
              <Link href="/register" className="site-account-item" onClick={() => setOpen(false)}>
                Create account
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function RoleBadges({ traveller }: { traveller: Traveller }) {
  const roles = traveller.roles?.length ? traveller.roles : ["TRAVELLER"];

  return (
    <div className="site-account-roles">
      {roles.map((role) => (
        <span key={role} className="site-account-role">
          {formatRole(role)}
          {role === "CREATOR" && traveller.creatorProfile?.status
            ? ` ${formatStatus(traveller.creatorProfile.status)}`
            : ""}
          {role === "OPERATOR" && traveller.operatorProfile?.status
            ? ` ${formatStatus(traveller.operatorProfile.status)}`
            : ""}
        </span>
      ))}
    </div>
  );
}

function formatRole(role: string) {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

function formatStatus(status: string) {
  if (status === "PENDING_REVIEW") return "pending";
  return status.toLowerCase();
}

function buildInitials(traveller?: Traveller | null) {
  const source = traveller?.name ?? traveller?.email ?? "";
  const parts = source
    .replace(/@.*$/, "")
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "BP";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
