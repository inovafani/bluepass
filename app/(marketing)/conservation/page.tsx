export default function ConservationPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-bluepass-ocean">
        Conservation
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">
        5% of every confirmed booking is pledged to conservation.
      </h1>
      <p className="mt-6 text-lg leading-8 text-slate-700">
        BluePass queues conservation transfers after booking confirmation. The
        foundation tracks those transfers separately from booking state so the
        pledge remains auditable as integrations mature.
      </p>
    </section>
  );
}
