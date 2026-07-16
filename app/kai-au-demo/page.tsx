import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kai x Rezdy - Australia instant-booking pilot",
  robots: { index: false, follow: false },
};

const experiences = [
  { id: "gold-coast-whale-escape", name: "Gold Coast Whale Escape", detail: "Luxury whale watching", price: "From AUD 99" },
  { id: "twilight-drift", name: "Twilight Drift", detail: "Sunset Broadwater cruise", price: "From AUD 79" },
  { id: "broadwater-twilight-dining", name: "Broadwater Twilight Dining", detail: "Evening dining cruise", price: "From AUD 149" },
  { id: "coastal-lunch-escape", name: "Coastal Lunch Escape", detail: "Gold Coast daytime dining cruise", price: "From AUD 89" },
];

export default function KaiAustraliaDemoPage() {
  const kaiCoreBaseUrl = process.env.KAI_CORE_BASE_URL ?? "http://127.0.0.1:3107";
  const widgetSrc = `${kaiCoreBaseUrl}/embed/kai?key=pk_test_bluepass_au`;

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12">
      <p className="text-xs font-medium uppercase tracking-wide text-amber-600">
        Internal pilot - not linked from the public site
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-900">
        BluePass x Rezdy: Australia instant-booking pilot
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
        This page proves Kai can take an instant, pay-now booking through BluePass&apos;s own brand
        voice, the same way it already does for the Boattime tenant. The inventory below is real
        Gold Coast charter availability from Boattime&apos;s own Rezdy account - this pilot does not
        yet cover other Australian regions (Great Barrier Reef, Whitsundays, Ningaloo Coast).
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {experiences.map((experience) => (
          <article
            key={experience.id}
            id={experience.id}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h2 className="text-base font-semibold text-slate-900">{experience.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{experience.detail}</p>
            <p className="mt-3 text-sm font-semibold text-slate-700">{experience.price}</p>
          </article>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-slate-700">Talk to Kai</h2>
        <iframe
          title="Kai booking assistant - BluePass Australia pilot"
          src={widgetSrc}
          allow="clipboard-write"
          className="mt-3 h-[680px] w-full max-w-[420px] rounded-lg border border-slate-200 shadow-lg"
        />
      </section>
    </main>
  );
}
