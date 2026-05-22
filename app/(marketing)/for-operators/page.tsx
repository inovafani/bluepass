export default function ForOperatorsPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-bluepass-ocean">
        For operators
      </p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight">
        Booking acceptance stays in WhatsApp Business.
      </h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          "One-tap Accept, Decline, or Counter in v1.",
          "Traveller payment starts only after acceptance and PMS hold.",
          "20% marketplace commission, capped at $400 per booking.",
        ].map((item) => (
          <div key={item} className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm leading-6 text-slate-700">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
