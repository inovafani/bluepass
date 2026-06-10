import type { ReactNode } from "react";

export function AuthCinematicShell({ children }: { children: ReactNode }) {
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
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.68),rgba(0,15,21,0.28)_45%,rgba(0,8,14,0.44)),linear-gradient(180deg,rgba(0,0,0,0.22),rgba(0,0,0,0.02)_38%,rgba(0,0,0,0.54))]" />
      <div className="absolute inset-0 bg-[#0c3b3a]/10 mix-blend-color" />
      <div className="bp-film-grain absolute inset-0" />

      <div className="relative z-10 flex min-h-svh items-center justify-center px-[var(--cinematic-screen-x)] pb-14 pt-28 sm:pt-32">
        <section className="relative w-full max-w-[520px] overflow-hidden rounded-2xl border border-white/16 bg-white/[0.10] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[34px] backdrop-saturate-150 sm:p-6 md:p-8">
          {children}
        </section>
      </div>
    </section>
  );
}
