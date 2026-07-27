import Link from "next/link";
import type { ReactNode } from "react";

export type AdminSectionKey =
  | "applications"
  | "operator-outreach"
  | "listings"
  | "inquiries"
  | "referrals"
  | "bluepass-ledger";

const ADMIN_SECTIONS: {
  key: AdminSectionKey;
  href: string;
  label: string;
}[] = [
  { key: "applications", href: "/admin/applications", label: "Applications" },
  {
    key: "operator-outreach",
    href: "/admin/operator-outreach",
    label: "Operator outreach",
  },
  { key: "listings", href: "/admin/listings", label: "Listings" },
  { key: "inquiries", href: "/admin/inquiries", label: "Inquiry pipeline" },
  { key: "referrals", href: "/admin/referrals", label: "Referral ledger" },
  { key: "bluepass-ledger", href: "/admin/bluepass-ledger", label: "Commission payouts" },
];

/**
 * Shared admin top bar: the same section tabs on every admin page, with the
 * current page highlighted, plus a slot for page-specific actions (e.g. an
 * export button) and the signed-in identity.
 */
export function AdminNav({
  active,
  email,
  actions,
}: {
  active: AdminSectionKey;
  email: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center">
      <nav
        aria-label="Admin sections"
        className="flex flex-wrap gap-1.5 rounded-full border border-white/10 bg-white/[0.04] p-1"
      >
        {ADMIN_SECTIONS.map((section) => {
          const isActive = section.key === active;
          return (
            <Link
              key={section.key}
              href={section.href}
              aria-current={isActive ? "page" : undefined}
              className={`bp-focus-ring inline-flex h-9 items-center justify-center rounded-full px-4 text-xs font-bold transition-colors ${
                isActive
                  ? "bg-white text-[#071827]"
                  : "text-white/60 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {section.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col items-start gap-2 lg:items-end">
        {actions ? (
          <div className="flex flex-wrap gap-2">{actions}</div>
        ) : null}
        <p className="text-xs text-white/44">
          Signed in as <span className="text-white/76">{email}</span>
        </p>
      </div>
    </div>
  );
}
