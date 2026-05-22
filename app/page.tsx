import Link from "next/link";

export default function HomePage() {
  return (
    <section className="cinematic-page home-hero relative h-svh min-h-[680px] overflow-hidden bg-[#020b11] text-white">
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
          src="https://assets.mixkit.co/videos/36621/36621-360.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.68),rgba(0,15,21,0.28)_45%,rgba(0,8,14,0.44)),linear-gradient(180deg,rgba(0,0,0,0.22),rgba(0,0,0,0.02)_38%,rgba(0,0,0,0.54))]" />
      <div className="absolute inset-0 bg-[#0c3b3a]/10 mix-blend-color" />
      <div className="bp-film-grain absolute inset-0" />

      <div className="cinematic-hero-stage">
        <section className="w-full max-w-[560px] border border-white/16 bg-[#03111d]/50 p-6 shadow-[0_28px_100px_rgba(0,0,0,0.44)] backdrop-blur-2xl md:w-[min(44vw,560px)] md:p-8 xl:p-9">
          <p className="mb-6 text-[10px] font-black text-white/60">
            WhatsApp booking
          </p>
          <h1 className="bp-page-title text-[clamp(2.25rem,5vw,4rem)] leading-[0.96] text-white">
            Plan With Kai
          </h1>
          <div className="mt-7 grid grid-cols-[2px_1fr] gap-5">
            <span className="mt-1 h-20 w-px bg-white/70" aria-hidden="true" />
            <p className="max-w-[27rem] text-sm leading-[1.75] text-white/78 md:text-[15px]">
              Tell Kai where you want to go. BluePass matches the route, crew,
              date, and booking path inside WhatsApp.
            </p>
          </div>
          <div className="mt-9 flex flex-wrap gap-3 md:gap-5">
            <Link
              href="https://wa.me/628213143342"
              className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center bg-white px-6 text-[11px] font-black text-[#071827] transition-colors hover:bg-white/88 active:scale-[0.98]"
            >
              Start with Kai
            </Link>
            <Link
              href="/explore-indonesia"
              className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center border border-white/54 bg-transparent px-6 text-[11px] font-black text-white transition-colors hover:bg-white/10 active:scale-[0.98]"
            >
              Explore Indonesia
            </Link>
          </div>
        </section>

        <div className="absolute bottom-[calc(2.2rem+env(safe-area-inset-bottom))] left-[var(--cinematic-screen-x)] z-30 flex items-center gap-4">
          <button
            type="button"
            className="bp-focus-ring flex h-9 w-9 items-center justify-center border border-white/24 bg-black/26 text-white backdrop-blur-xl transition-colors hover:bg-white/10"
            aria-label="Play BluePass preview"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-[1px] h-3.5 w-3.5 fill-current"
              aria-hidden="true"
            >
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          </button>
          <span className="h-px w-20 overflow-hidden bg-white/25 sm:w-28 xl:w-56">
            <span className="block h-full w-1/3 bg-white/86" />
          </span>
        </div>

        <div className="absolute bottom-[calc(2.2rem+env(safe-area-inset-bottom))] right-[var(--cinematic-screen-x)] z-30 flex items-center gap-1.5">
          <span className="flex p-2">
            <span className="h-1.5 w-8 bg-white" />
          </span>
          <span className="flex p-2">
            <span className="h-1.5 w-1.5 bg-white/42" />
          </span>
          <span className="flex p-2">
            <span className="h-1.5 w-1.5 bg-white/42" />
          </span>
        </div>

        <div className="fixed bottom-4 right-4 z-[80] md:bottom-6 md:right-6">
          <Link
            href="https://wa.me/628213143342"
            className="bp-focus-ring ml-auto flex h-16 min-w-[196px] items-center gap-3 rounded-full border border-white/15 bg-[#075e54] px-4 text-white shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition-transform hover:scale-[1.02] hover:bg-[#0b6f63]"
            aria-label="Open Kai chat"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d9fdd3] text-sm font-semibold text-[#075e54]">
              K
            </span>
            <span className="block text-left">
              <span className="block text-sm font-semibold leading-none">
                Ask Kai
              </span>
              <span className="mt-1 block text-[11px] text-white/70">
                In-app or WhatsApp
              </span>
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-4 w-4"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
