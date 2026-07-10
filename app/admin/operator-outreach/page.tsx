import Link from "next/link";
import { redirect } from "next/navigation";
import { requireCurrentAdmin } from "@/lib/services/auth/admin";
import { AdminNav } from "@/app/admin/admin-nav";
import {
  buildOperatorOutreachPaginationItems,
  loadOperatorOutreachList,
  type OperatorOutreachFilter,
} from "@/lib/services/operators/operator-outreach-list";

export const metadata = {
  title: "Operator Outreach | BluePass Admin",
};

export default async function AdminOperatorOutreachPage({
  searchParams,
}: {
  searchParams?: Promise<{ filter?: string; q?: string; page?: string }>;
}) {
  const admin = await requireCurrentAdmin();

  if (!admin) {
    redirect("/login?next=/admin/operator-outreach");
  }

  const params = await searchParams;
  const filter = params?.filter ?? "all";
  const q = params?.q ?? "";
  const page = params?.page ?? "1";
  const outreach = await loadOperatorOutreachList({ filter, q, page });
  const paginationItems = buildOperatorOutreachPaginationItems(
    outreach.page,
    outreach.totalPages,
  );
  const exportHref = `/admin/operator-outreach/export?filter=${encodeURIComponent(
    outreach.activeFilter,
  )}&q=${encodeURIComponent(outreach.search)}`;

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
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.78),rgba(0,15,21,0.44)_45%,rgba(0,8,14,0.66)),linear-gradient(180deg,rgba(0,0,0,0.36),rgba(0,0,0,0.1)_38%,rgba(0,0,0,0.72))]" />
      <div className="absolute inset-0 bg-[#0c3b3a]/10 mix-blend-color" />
      <div className="bp-film-grain absolute inset-0" />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-7xl flex-col justify-center px-[var(--cinematic-screen-x)] pb-14 pt-32">
        <div className="overflow-hidden rounded-2xl border border-white/16 bg-white/[0.10] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[34px] backdrop-saturate-150 sm:p-6 md:p-8">
          <AdminNav
            active="operator-outreach"
            email={admin.email}
            actions={
              <a
                href={exportHref}
                className="bp-focus-ring inline-flex h-9 items-center justify-center rounded-full bg-white px-4 text-xs font-black text-[#071827] transition-colors hover:bg-white/88"
              >
                Export CSV
              </a>
            }
          />
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9fe8df]">
              BluePass admin
            </p>
            <h1 className="bp-page-title mt-3 text-4xl leading-none text-white md:text-5xl">
              Operator outreach
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/66">
              Track imported operator leads, claim links, approval state, and
              which operators are ready to follow up.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <OutreachStat label="All leads" value={outreach.totals.all} />
            <OutreachStat
              label="Needs outreach"
              value={outreach.totals.needsOutreach}
            />
            <OutreachStat
              label="Pending claim"
              value={outreach.totals.pendingClaim}
            />
            <OutreachStat
              label="Approved / live"
              value={outreach.totals.approved}
            />
            <OutreachStat label="Declined" value={outreach.totals.declined} />
          </div>

          <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <form className="bp-bare-form grid gap-2 lg:w-[360px]">
              <input
                type="hidden"
                name="filter"
                value={outreach.activeFilter}
              />
              <input type="hidden" name="page" value="1" />
              <label
                htmlFor="operator-search"
                className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/48"
              >
                Search operator
              </label>
              <div className="flex gap-2">
                <input
                  id="operator-search"
                  name="q"
                  defaultValue={outreach.search}
                  placeholder="Name, slug, email, region..."
                  className="h-12 min-w-0 flex-1 rounded-xl border border-white/18 bg-white px-4 text-sm font-semibold text-[#071827] caret-[#007a78] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition-colors placeholder:text-[#64727c] focus:border-[#9fe8df]/80 focus:bg-white"
                />
                <button
                  type="submit"
                  className="bp-focus-ring inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-white px-5 text-xs font-black text-[#071827] transition-colors hover:bg-white/88"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="grid gap-2 lg:items-end">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/48 lg:text-right">
                Outreach status
              </p>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                {outreach.filterOptions.map((option) => (
                  <FilterPill
                    key={option.key}
                    option={option.key}
                    label={option.label}
                    active={option.key === outreach.activeFilter}
                    q={outreach.search}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col justify-between gap-3 text-sm text-white/58 sm:flex-row sm:items-center">
            <p>
              Showing{" "}
              <span className="font-bold text-white">
                {outreach.leads.length
                  ? (outreach.page - 1) * outreach.pageSize + 1
                  : 0}
                -
                {Math.min(
                  outreach.page * outreach.pageSize,
                  outreach.filteredTotal,
                )}
              </span>{" "}
              of{" "}
              <span className="font-bold text-white">
                {outreach.filteredTotal}
              </span>{" "}
              matching operators
            </p>
            <p className="font-bold text-white/62">
              Page {outreach.page} of {outreach.totalPages}
            </p>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#03131c]/88">
            <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_1.4fr_1.4fr] gap-3 border-b border-white/10 px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-white/38 max-xl:hidden">
              <span>Operator</span>
              <span>Status</span>
              <span>Region</span>
              <span>Claim link</span>
              <span>Contact</span>
            </div>
            <div className="divide-y divide-white/8">
              {outreach.leads.length ? (
                outreach.leads.map((lead) => (
                  <article
                    key={lead.id}
                    className="grid gap-4 px-4 py-4 xl:grid-cols-[1.2fr_0.8fr_0.8fr_1.4fr_1.4fr] xl:items-center"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-white">
                        {lead.name}
                      </p>
                      <p className="mt-1 truncate font-mono text-[11px] text-white/38">
                        {lead.slug}
                      </p>
                    </div>
                    <StatusBadge status={lead.status} />
                    <p className="text-sm font-semibold text-white/64">
                      {lead.region ?? "Unknown"}
                    </p>
                    <a
                      href={lead.claimUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all rounded-xl border border-[#9fe8df]/16 bg-[#9fe8df]/8 p-3 font-mono text-[11px] font-semibold text-[#9fe8df] transition-colors hover:border-[#9fe8df]/42 hover:text-white"
                    >
                      {lead.claimUrl}
                    </a>
                    <div className="min-w-0 text-sm text-white/58">
                      <p className="truncate">{lead.email ?? "No email"}</p>
                      <p className="mt-1 truncate">
                        {lead.phone ?? "No phone"}
                      </p>
                      <a
                        href={lead.publicUrl}
                        className="mt-2 inline-flex text-xs font-bold text-white/44 transition-colors hover:text-white"
                      >
                        Public page
                      </a>
                    </div>
                  </article>
                ))
              ) : (
                <p className="px-4 py-10 text-center text-sm text-white/48">
                  No outreach leads match this filter.
                </p>
              )}
            </div>
          </div>

          <PaginationBar
            currentPage={outreach.page}
            totalPages={outreach.totalPages}
            items={paginationItems}
            filter={outreach.activeFilter}
            q={outreach.search}
          />
        </div>
      </div>
    </section>
  );
}

function OutreachStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/16 p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function FilterPill({
  option,
  label,
  active,
  q,
}: {
  option: OperatorOutreachFilter;
  label: string;
  active: boolean;
  q: string;
}) {
  const href = `/admin/operator-outreach?filter=${encodeURIComponent(
    option,
  )}&q=${encodeURIComponent(q)}&page=1`;

  return (
    <Link
      href={href}
      className={`bp-focus-ring inline-flex h-11 items-center justify-center rounded-xl border px-4 text-xs font-bold transition-colors ${
        active
          ? "border-white bg-white text-[#071827]"
          : "border-white/18 bg-transparent text-white/70 hover:bg-white/10"
      }`}
    >
      {label}
    </Link>
  );
}

function PaginationBar({
  currentPage,
  totalPages,
  items,
  filter,
  q,
}: {
  currentPage: number;
  totalPages: number;
  items: Array<number | "ellipsis">;
  filter: OperatorOutreachFilter;
  q: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="mt-6 flex flex-wrap items-center justify-center gap-2 border-t border-white/10 pt-5"
      aria-label="Operator outreach pages"
    >
      <PageButton
        label="Previous"
        disabled={currentPage <= 1}
        page={currentPage - 1}
        filter={filter}
        q={q}
      />
      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="inline-flex h-11 items-center justify-center px-1 text-sm font-bold text-white/36"
          >
            ...
          </span>
        ) : (
          <Link
            key={item}
            href={`/admin/operator-outreach?filter=${encodeURIComponent(
              filter,
            )}&q=${encodeURIComponent(q)}&page=${item}`}
            aria-current={item === currentPage ? "page" : undefined}
            className={`bp-focus-ring inline-flex h-11 min-w-[1.75rem] items-center justify-center px-1 text-sm font-bold transition-colors ${
              item === currentPage
                ? "text-white underline decoration-2 underline-offset-[6px]"
                : "text-white/52 hover:text-white"
            }`}
          >
            {item}
          </Link>
        ),
      )}
      <PageButton
        label="Next"
        disabled={currentPage >= totalPages}
        page={currentPage + 1}
        filter={filter}
        q={q}
      />
    </nav>
  );
}

function PageButton({
  label,
  disabled,
  page,
  filter,
  q,
  active = false,
}: {
  label: string;
  disabled?: boolean;
  page: number;
  filter: OperatorOutreachFilter;
  q: string;
  active?: boolean;
}) {
  if (disabled) {
    return (
      <span className="inline-flex h-11 w-24 items-center justify-center rounded-xl border border-white/10 bg-transparent text-xs font-bold text-white/28">
        {label}
      </span>
    );
  }

  return (
    <Link
      href={`/admin/operator-outreach?filter=${encodeURIComponent(
        filter,
      )}&q=${encodeURIComponent(q)}&page=${page}`}
      className={`bp-focus-ring inline-flex h-11 w-24 items-center justify-center rounded-xl border text-xs font-bold transition-colors ${
        active
          ? "border-white bg-white text-[#071827]"
          : "border-white/18 bg-transparent text-white hover:bg-white hover:text-[#071827]"
      }`}
    >
      {label}
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isApproved = status === "APPROVED" || status === "LIVE";
  const isPending =
    status === "CLAIM_LINK_REQUESTED" ||
    status === "CLAIM_SUBMITTED" ||
    status === "MANUAL_REVIEW";

  return (
    <span
      className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${
        isApproved
          ? "border-[#9fe8df]/28 bg-[#9fe8df]/12 text-[#9fe8df]"
          : isPending
            ? "border-[#f1d58a]/28 bg-[#f1d58a]/12 text-[#f1d58a]"
            : "border-white/14 bg-white/[0.06] text-white/62"
      }`}
    >
      {status.replaceAll("_", " ").toLowerCase()}
    </span>
  );
}
