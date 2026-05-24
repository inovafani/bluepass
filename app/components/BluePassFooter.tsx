import Link from "next/link";

export function BluePassFooter() {
  return (
    <footer className="bg-[#04111d] font-sans text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 text-sm text-white/60 md:grid-cols-[1.4fr_1fr_1fr_1fr] [&_a]:font-normal [&_a]:transition-colors [&_a:hover]:text-white">
        <div>
          <p className="site-brand-name text-2xl text-white">
            BluePass
          </p>
          <p className="mt-3 max-w-md leading-6">
            Your pass to Indonesia&apos;s best ocean trips. Conversational
            matching, vetted operators, and 5% of every booking back to the
            reef.
          </p>
          <p className="mt-4 text-[11px] font-normal tracking-[0.18em] text-white/40">
            Indonesia-first - Founding cohort 2026
          </p>
        </div>
        <div className="grid gap-2">
          <p className="text-xs font-normal tracking-[0.18em] text-[#B89A5D]">
            Marketplace
          </p>
          <Link href="/explore-indonesia">Trips</Link>
          <Link href="/for-operators">Operators</Link>
          <Link href="/explore-indonesia">Destinations</Link>
        </div>
        <div className="grid gap-2">
          <p className="text-xs font-normal tracking-[0.18em] text-[#B89A5D]">
            Company
          </p>
          <Link href="/about">About</Link>
          <Link href="/conservation">Conservation</Link>
          <Link href="/creators">Creators</Link>
        </div>
        <div className="grid gap-2">
          <p className="text-xs font-normal tracking-[0.18em] text-[#B89A5D]">
            Operators
          </p>
          <Link href="/for-operators">BluePass for Operators</Link>
          <Link href="/signup">Claim your business</Link>
          <a href="mailto:jeff@bluepass.travel">Founding cohort</a>
        </div>
      </div>
      <div className="border-t border-white/10 px-5">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 py-5 text-[11px] font-normal tracking-[0.18em] text-white/35 md:flex-row md:items-center">
          <span>Copyright 2026 BluePass - Marine Tourism Operator OS</span>
          <span className="text-white/30">
            Built in Indonesia - for Indonesia&apos;s ocean
          </span>
        </div>
      </div>
    </footer>
  );
}
