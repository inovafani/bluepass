export default function OperatorConnectPage() {
  return (
    <main className="min-h-screen bg-[#04111d] px-5 py-24 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-3xl items-center">
        <div className="w-full border border-white/12 bg-[#03111d]/80 p-6 shadow-[0_28px_100px_rgba(0,0,0,0.36)] md:p-10">
          <p className="text-[11px] font-medium tracking-[0.22em] text-[#B89A5D]">
            Early operator setup
          </p>
          <h1 className="bp-page-title mt-4 text-[clamp(2.25rem,5vw,4rem)] leading-none">
            Connect your booking system
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-white/65">
            This screen prepares your BluePass operator setup. API credential
            connection is coming next; no Rezdy or FareHarbor calls happen here
            yet.
          </p>

          <form className="mt-8 grid gap-5">
            <label className="grid gap-2">
              <span className="text-xs font-medium tracking-[0.16em] text-white/70">
                Booking system
              </span>
              <select
                className="h-12 border border-white/16 bg-white px-4 text-sm font-medium text-[#071827] outline-none transition-colors focus:border-[#B89A5D] focus:ring-2 focus:ring-[#B89A5D]/30"
                defaultValue=""
              >
                <option value="" disabled>
                  Select PMS platform
                </option>
                <option value="REZDY">Rezdy</option>
                <option value="FAREHARBOR">FareHarbor</option>
                <option value="NATIVE">None / Native inventory</option>
              </select>
            </label>

            <button
              type="button"
              className="mt-2 inline-flex h-12 w-full items-center justify-center bg-white px-6 text-[11px] font-black text-[#071827] transition-colors hover:bg-white/90 md:w-auto"
            >
              Continue
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
