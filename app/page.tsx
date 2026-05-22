import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-65px)] max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-bluepass-ocean">
          WhatsApp-first booking marketplace
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-bluepass-ink md:text-6xl">
          BluePass turns travel inquiries into accepted bookings inside WhatsApp.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
          Travellers chat with Kai, operators respond from WhatsApp Business, and
          BluePass coordinates holds, payment readiness, booking events, and the
          conservation pledge behind the scenes.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/for-operators"
            className="rounded-md bg-bluepass-ocean px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-bluepass-ink"
          >
            For operators
          </Link>
          <Link
            href="/conservation"
            className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:border-bluepass-ocean"
          >
            Conservation model
          </Link>
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="rounded-md bg-slate-100 p-4">
            <p className="text-sm font-medium text-slate-900">Kai</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              Finds fitting trips, drafts quotes, and keeps travellers in WhatsApp.
            </p>
          </div>
          <div className="rounded-md bg-bluepass-reef p-4">
            <p className="text-sm font-medium text-slate-900">Operator action</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              Accept, Decline, or Counter without leaving WhatsApp Business.
            </p>
          </div>
          <div className="rounded-md bg-slate-100 p-4">
            <p className="text-sm font-medium text-slate-900">Booking foundation</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              State transitions are logged, PMS holds come before payment, and
              conservation is queued after confirmation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
