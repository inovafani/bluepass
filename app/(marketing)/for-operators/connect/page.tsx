import { ConnectPmsForm } from "./ConnectPmsForm";

export default function OperatorConnectPage() {
  return (
    <main className="min-h-screen bg-[#04111d] px-5 py-24 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-3xl items-center">
        <div className="w-full rounded-2xl border border-white/12 bg-[#03111d]/80 p-6 shadow-[0_28px_100px_rgba(0,0,0,0.36)] md:p-10">
          <p className="text-[11px] font-medium tracking-[0.22em] text-[#B89A5D]">
            Early operator setup
          </p>
          <h1 className="bp-page-title mt-4 text-[clamp(2.25rem,5vw,4rem)] leading-none">
            Connect your booking system
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-white/65">
            Connect inventory once. Operator review, acceptance, counter-offers,
            payment, and confirmations still run through WhatsApp.
          </p>

          <ConnectPmsForm />
        </div>
      </section>
    </main>
  );
}
