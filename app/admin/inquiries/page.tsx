import { redirect } from "next/navigation";
import { AdminNav } from "@/app/admin/admin-nav";
import {
  formatInquiryEventDetail,
  formatInquiryEventSummary,
  formatInquiryPipelineState,
  type InquiryPipelineState,
} from "./event-format";
import { loadKaiCoreAdminInquiries } from "./kai-core-admin";
import { prisma } from "@/lib/db/prisma";
import { requireCurrentAdmin } from "@/lib/services/auth/admin";

export const metadata = {
  title: "Inquiries | BluePass Admin",
};

export default async function AdminInquiriesPage() {
  const admin = await requireCurrentAdmin();

  if (!admin) {
    redirect("/login?next=/admin/inquiries");
  }

  const [inquiries, kaiCorePipeline] = await Promise.all([
    prisma.bookingInquiry.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        referralPartner: {
          select: { role: true, handle: true, name: true },
        },
        outboundMessages: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            recipientPhone: true,
            templateName: true,
            status: true,
            sentAt: true,
          },
          take: 1,
        },
        events: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            fromStatus: true,
            toStatus: true,
            actorType: true,
            payload: true,
            createdAt: true,
          },
          take: 3,
        },
      },
      take: 40,
    }),
    loadKaiCoreAdminInquiries(),
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
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.78),rgba(0,15,21,0.45)_45%,rgba(0,8,14,0.68)),linear-gradient(180deg,rgba(0,0,0,0.34),rgba(0,0,0,0.12)_38%,rgba(0,0,0,0.72))]" />
      <div className="absolute inset-0 bg-[#0c3b3a]/10 mix-blend-color" />
      <div className="bp-film-grain absolute inset-0" />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-center px-[var(--cinematic-screen-x)] pb-14 pt-32">
        <div className="overflow-hidden rounded-2xl border border-white/16 bg-white/[0.10] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[34px] backdrop-saturate-150 sm:p-6 md:p-8">
          <AdminNav active="inquiries" email={admin.email} />
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9fe8df]">
              BluePass admin
            </p>
            <h1 className="bp-page-title mt-3 text-4xl leading-none text-white md:text-5xl">
              Inquiry pipeline
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/66">
              Watch Kai inquiries move from operator dispatch to accepted,
              declined, or counter-offered.
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            {kaiCorePipeline.error ? (
              <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
                {kaiCorePipeline.error} Local BluePass inquiries are still shown below.
              </div>
            ) : null}

            {kaiCorePipeline.inquiries.length ? (
              <div className="grid gap-3">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9fe8df]">
                      Kai Core
                    </p>
                    <h2 className="mt-1 text-xl font-black text-white">
                      Live operator pipeline
                    </h2>
                  </div>
                  <p className="text-xs text-white/44">
                    {kaiCorePipeline.inquiries.length} latest core inquiries
                  </p>
                </div>
                {kaiCorePipeline.inquiries.map((inquiry) => {
                  const pipelineState = formatInquiryPipelineState({
                    status: inquiry.status,
                    events: inquiry.events,
                  });

                  return (
                    <article
                      key={`kai-core-${inquiry.id}`}
                      className="rounded-2xl border border-[#9fe8df]/18 bg-[#022a2b]/55 p-4 backdrop-blur-md"
                    >
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-bold text-white">
                            {inquiry.selectedYachtName ??
                              inquiry.destination ??
                              "BluePass inquiry"}
                          </h2>
                          <span className="rounded-full border border-[#9fe8df]/20 bg-[#9fe8df]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#d9fffa]">
                            {inquiry.status.toLowerCase()}
                          </span>
                          <span className="rounded-full border border-white/14 bg-white/[0.08] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/68">
                            core
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-white/52">
                          {inquiry.travellerName ?? "Traveller"} -{" "}
                          {inquiry.dateWindow ?? "Dates pending"} -{" "}
                          {inquiry.guests ?? "?"} guests -{" "}
                          {inquiry.budget ?? "No budget"}
                        </p>
                        <p className="mt-1 text-xs text-white/42">
                          {[inquiry.travellerEmail, inquiry.travellerPhone]
                            .filter(Boolean)
                            .join(" - ") || "No traveller contact"}
                        </p>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-3">
                        <AdminMetric
                          label="Outbound"
                          value={inquiry.latestDispatchStatus?.toLowerCase() ?? "not sent"}
                        />
                        <AdminMetric
                          label="Operator"
                          value={inquiry.latestOperatorPhone ?? inquiry.operatorName ?? "not set"}
                        />
                        <AdminMetric
                          label="Created"
                          value={formatDate(inquiry.createdAt)}
                        />
                      </div>
                    </div>

                    <PipelineStatePanel state={pipelineState} />

                    <div className="mt-4 rounded-xl border border-white/10 bg-black/15 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">
                        Latest core events
                      </p>
                      <div className="mt-3 grid gap-2">
                        {inquiry.events.length ? (
                          inquiry.events.slice(0, 3).map((event) => {
                            const detail = formatInquiryEventDetail(event);

                            return (
                              <div key={event.id} className="grid gap-1">
                                <p className="text-xs text-white/58">
                                  {formatInquiryEventSummary(event)}
                                </p>
                                {detail ? (
                                  <p className="text-xs leading-relaxed text-white/42">
                                    {detail}
                                  </p>
                                ) : null}
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-xs text-white/44">
                            No operator action yet.
                          </p>
                        )}
                      </div>
                    </div>
                    </article>
                  );
                })}
              </div>
            ) : null}

            {inquiries.length ? (
              inquiries.map((inquiry) => {
                const outbound = inquiry.outboundMessages[0];
                const pipelineState = formatInquiryPipelineState({
                  status: inquiry.status,
                  events: inquiry.events,
                });

                return (
                  <article
                    key={inquiry.id}
                    className="rounded-2xl border border-white/14 bg-white/[0.08] p-4 backdrop-blur-md"
                  >
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-bold text-white">
                            {inquiry.selectedYachtName ??
                              inquiry.destination ??
                              "BluePass inquiry"}
                          </h2>
                          <span className="rounded-full border border-[#9fe8df]/20 bg-[#9fe8df]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#d9fffa]">
                            {inquiry.status.toLowerCase()}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-white/52">
                          {inquiry.travellerName ?? "Traveller"} -{" "}
                          {inquiry.dateWindow ?? "Dates pending"} -{" "}
                          {inquiry.guests ?? "?"} guests -{" "}
                          {inquiry.budget ?? "No budget"}
                        </p>
                        <p className="mt-1 text-xs text-white/42">
                          Referral: {formatReferral(inquiry)}
                        </p>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-3">
                        <AdminMetric
                          label="Outbound"
                          value={outbound?.status.toLowerCase() ?? "not sent"}
                        />
                        <AdminMetric
                          label="Operator"
                          value={outbound?.recipientPhone ?? "not set"}
                        />
                        <AdminMetric
                          label="Created"
                          value={formatDate(inquiry.createdAt)}
                        />
                      </div>
                    </div>

                    <PipelineStatePanel state={pipelineState} />

                    <div className="mt-4 rounded-xl border border-white/10 bg-black/15 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">
                        Latest events
                      </p>
                      <div className="mt-3 grid gap-2">
                        {inquiry.events.length ? (
                          inquiry.events.map((event) => {
                            const detail = formatInquiryEventDetail(event);

                            return (
                              <div key={event.id} className="grid gap-1">
                                <p className="text-xs text-white/58">
                                  {formatInquiryEventSummary(event)}
                                </p>
                                {detail ? (
                                  <p className="text-xs leading-relaxed text-white/42">
                                    {detail}
                                  </p>
                                ) : null}
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-xs text-white/44">
                            No operator action yet.
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-sm text-white/48">
                No booking inquiries yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function AdminMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/15 p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">
        {label}
      </p>
      <p className="mt-2 truncate text-sm font-black text-white">{value}</p>
    </div>
  );
}

function PipelineStatePanel({ state }: { state: InquiryPipelineState }) {
  const toneClass = getPipelineToneClass(state.tone);

  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">
            Current step
          </p>
          <p className="mt-1 text-sm font-black text-white">{state.label}</p>
        </div>
        <span
          className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${toneClass}`}
        >
          {state.tone}
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-white/58">{state.nextAction}</p>
    </div>
  );
}

function getPipelineToneClass(tone: InquiryPipelineState["tone"]) {
  switch (tone) {
    case "done":
      return "border-emerald-200/30 bg-emerald-300/12 text-emerald-100";
    case "ready":
      return "border-sky-200/30 bg-sky-300/12 text-sky-100";
    case "action":
      return "border-amber-200/30 bg-amber-300/12 text-amber-100";
    case "blocked":
      return "border-rose-200/30 bg-rose-300/12 text-rose-100";
    case "waiting":
    default:
      return "border-white/16 bg-white/[0.08] text-white/62";
  }
}

function formatReferral(inquiry: {
  referralCode: string | null;
  referralRole: string | null;
  referralPartner: { role: string; handle: string | null; name: string } | null;
}) {
  if (inquiry.referralCode) {
    return inquiry.referralRole
      ? `${inquiry.referralRole.toLowerCase()} / ${inquiry.referralCode}`
      : inquiry.referralCode;
  }

  if (inquiry.referralPartner) {
    return `${inquiry.referralPartner.role.toLowerCase()} / ${
      inquiry.referralPartner.handle ?? inquiry.referralPartner.name
    }`;
  }

  return "direct";
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
