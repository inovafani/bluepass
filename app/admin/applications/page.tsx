import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { requireCurrentAdmin } from "@/lib/services/auth/admin";
import {
  approveReferralApplication,
  buildReferralShareUrl,
  declineReferralApplication,
} from "@/lib/services/referrals/application-approval";

export const metadata = {
  title: "Applications | BluePass Admin",
};

export default async function AdminApplicationsPage() {
  const admin = await requireCurrentAdmin();

  if (!admin) {
    redirect("/login?next=/admin/applications");
  }

  const [creatorProfiles, operatorProfiles] = await Promise.all([
    prisma.creatorProfile.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: {
        account: true,
        referralPartner: { include: { links: true } },
      },
    }),
    prisma.operatorProfile.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: {
        account: true,
        referralPartner: { include: { links: true } },
      },
    }),
  ]);

  return (
    <section className="cinematic-page home-hero relative min-h-svh overflow-hidden bg-[#020b11] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://assets.mixkit.co/videos/36621/36621-thumb-720-0.jpg')",
        }}
      />
      <video
        className="absolute inset-0 h-full w-full object-cover"
        poster="https://assets.mixkit.co/videos/36621/36621-thumb-720-0.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source
          src="https://assets.mixkit.co/videos/36621/36621-1080.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.76),rgba(0,15,21,0.42)_45%,rgba(0,8,14,0.62)),linear-gradient(180deg,rgba(0,0,0,0.32),rgba(0,0,0,0.1)_38%,rgba(0,0,0,0.68))]" />
      <div className="absolute inset-0 bg-[#0c3b3a]/10 mix-blend-color" />
      <div className="bp-film-grain absolute inset-0" />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-center px-[var(--cinematic-screen-x)] pb-14 pt-32">
        <div className="overflow-hidden rounded-2xl border border-white/16 bg-white/[0.10] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[34px] backdrop-saturate-150 sm:p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9fe8df]">
                BluePass admin
              </p>
              <h1 className="bp-page-title mt-3 text-4xl leading-none text-white md:text-5xl">
                Applications
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/66">
                Approve creator and operator applications. Approved profiles get
                a referral partner and share link automatically.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 md:items-end">
              <div className="flex flex-wrap gap-2">
                <a
                  href="/admin/inquiries"
                  className="bp-focus-ring inline-flex h-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.08] px-4 text-xs font-bold text-white transition-colors hover:bg-white hover:text-[#071827]"
                >
                  Inquiry pipeline
                </a>
                <a
                  href="/admin/referrals"
                  className="bp-focus-ring inline-flex h-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.08] px-4 text-xs font-bold text-white transition-colors hover:bg-white hover:text-[#071827]"
                >
                  Referral ledger
                </a>
              </div>
              <p className="text-xs text-white/44">
                Signed in as <span className="text-white/76">{admin.email}</span>
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <ApplicationColumn title="Creators">
              {creatorProfiles.length ? (
                creatorProfiles.map((profile) => (
                  <ApplicationCard
                    key={profile.id}
                    id={profile.id}
                    kind="creator"
                    title={profile.account.displayName ?? profile.handle ?? "Creator"}
                    subtitle={profile.account.email}
                    phone={profile.account.phone}
                    status={profile.status}
                    reviewLinks={[
                      { label: "Instagram", href: profile.instagramUrl, icon: "instagram" },
                      { label: "YouTube", href: profile.youtubeUrl, icon: "youtube" },
                    ]}
                    referralCode={profile.referralPartner?.links[0]?.code}
                    referralUrl={buildReferralShareUrl(
                      profile.referralPartner?.links[0]?.code,
                      profile.referralPartner?.links[0]?.targetPath,
                    )}
                  />
                ))
              ) : (
                <EmptyState label="No creator applications yet." />
              )}
            </ApplicationColumn>

            <ApplicationColumn title="Operators">
              {operatorProfiles.length ? (
                operatorProfiles.map((profile) => (
                  <ApplicationCard
                    key={profile.id}
                    id={profile.id}
                    kind="operator"
                    title={profile.companyName ?? profile.account.displayName ?? "Operator"}
                    subtitle={profile.account.email}
                    phone={profile.whatsappE164 ?? profile.account.phone}
                    status={profile.status}
                    reviewLinks={[{ label: "Website", href: profile.websiteUrl, icon: "website" }]}
                    referralCode={profile.referralPartner?.links[0]?.code}
                    referralUrl={buildReferralShareUrl(
                      profile.referralPartner?.links[0]?.code,
                      profile.referralPartner?.links[0]?.targetPath,
                    )}
                  />
                ))
              ) : (
                <EmptyState label="No operator applications yet." />
              )}
            </ApplicationColumn>
          </div>
        </div>
      </div>
    </section>
  );
}

function ApplicationColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white/72">
        {title}
      </h2>
      <div className="mt-4 grid gap-3">{children}</div>
    </section>
  );
}

function ApplicationCard({
  id,
  kind,
  title,
  subtitle,
  phone,
  status,
  reviewLinks,
  referralCode,
  referralUrl,
}: {
  id: string;
  kind: "creator" | "operator";
  title: string;
  subtitle: string;
  phone?: string | null;
  status: string;
  reviewLinks?: Array<{
    label: string;
    href?: string | null;
    icon: "instagram" | "youtube" | "website";
  }>;
  referralCode?: string;
  referralUrl?: string;
}) {
  const approved = status === "APPROVED" || status === "LIVE";
  const visibleReviewLinks = reviewLinks?.filter((link) => link.href) ?? [];
  const whatsappUrl = buildWhatsAppUrl(phone);

  return (
    <article className="rounded-2xl border border-white/14 bg-white/[0.08] p-4 backdrop-blur-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-white">{title}</p>
          <p className="mt-1 truncate text-xs text-white/54">{subtitle}</p>
          {phone &&
            (whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block truncate text-xs text-[#9fe8df] hover:text-white"
              >
                {phone}
              </a>
            ) : (
              <p className="mt-1 truncate text-xs text-white/44">{phone}</p>
            ))}
        </div>
        <span className="rounded-full border border-[#9fe8df]/20 bg-[#9fe8df]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#d9fffa]">
          {formatStatus(status)}
        </span>
      </div>

      {visibleReviewLinks.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {visibleReviewLinks.map((link) => (
            <a
              key={link.label}
              href={link.href ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              title={link.label}
              className="bp-review-icon-link bp-focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/16 bg-white/[0.06] text-white transition-colors hover:bg-white hover:text-[#071827]"
            >
              <ReviewIcon icon={link.icon} />
            </a>
          ))}
        </div>
      )}

      {referralCode && (
        <div className="mt-4 rounded-xl border border-white/10 bg-black/15 p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">
            Referral link
          </p>
          <p className="mt-1 font-mono text-xs text-white/82">{referralCode}</p>
          {referralUrl && (
            <p className="mt-1 break-all text-xs text-[#9fe8df]">{referralUrl}</p>
          )}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <form action={approveApplication}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="kind" value={kind} />
          <button
            type="submit"
            disabled={approved}
            className="bp-focus-ring inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-xs font-black text-[#071827] transition-colors hover:bg-white/88 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {approved ? "Approved" : "Approve"}
          </button>
        </form>
        <form action={declineApplication}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="kind" value={kind} />
          <button
            type="submit"
            disabled={approved || status === "DECLINED"}
            className="bp-focus-ring inline-flex h-10 items-center justify-center rounded-full border border-white/16 bg-white/[0.06] px-4 text-xs font-bold text-white transition-colors hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Decline
          </button>
        </form>
      </div>
    </article>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-sm text-white/48">
      {label}
    </div>
  );
}

async function approveApplication(formData: FormData) {
  "use server";

  const admin = await requireCurrentAdmin();
  if (!admin) redirect("/login?next=/admin/applications");

  await approveReferralApplication({
    id: String(formData.get("id") ?? ""),
    kind: String(formData.get("kind")) === "operator" ? "operator" : "creator",
  });

  revalidatePath("/admin/applications");
  revalidatePath("/dashboard");
}

async function declineApplication(formData: FormData) {
  "use server";

  const admin = await requireCurrentAdmin();
  if (!admin) redirect("/login?next=/admin/applications");

  await declineReferralApplication({
    id: String(formData.get("id") ?? ""),
    kind: String(formData.get("kind")) === "operator" ? "operator" : "creator",
  });

  revalidatePath("/admin/applications");
  revalidatePath("/dashboard");
}

function formatStatus(status: string) {
  if (status === "PENDING_REVIEW") return "pending";
  return status.toLowerCase();
}

function buildWhatsAppUrl(phone?: string | null) {
  if (!phone) {
    return undefined;
  }

  let digits = phone.replace(/[^\d+]/g, "");

  if (digits.startsWith("+")) {
    digits = digits.slice(1);
  }

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("0")) {
    digits = `62${digits.slice(1)}`;
  }

  if (!digits.startsWith("62") && digits.length >= 9 && digits.length <= 13) {
    digits = `62${digits}`;
  }

  return /^62\d{8,13}$/.test(digits) ? `https://wa.me/${digits}` : undefined;
}

function ReviewIcon({ icon }: { icon: "instagram" | "youtube" | "website" }) {
  if (icon === "instagram") {
    return (
      <svg
        className="bp-review-icon"
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (icon === "youtube") {
    return (
      <svg
        className="bp-review-icon"
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 12s0-3.2-.4-4.6a2.8 2.8 0 0 0-2-2C17.9 5 12 5 12 5s-5.9 0-7.6.4a2.8 2.8 0 0 0-2 2C2 8.8 2 12 2 12s0 3.2.4 4.6a2.8 2.8 0 0 0 2 2C6.1 19 12 19 12 19s5.9 0 7.6-.4a2.8 2.8 0 0 0 2-2c.4-1.4.4-4.6.4-4.6Z" />
        <path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg
      className="bp-review-icon"
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 0 20" />
      <path d="M12 2a15.3 15.3 0 0 0 0 20" />
    </svg>
  );
}
