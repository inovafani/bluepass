import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  return (
    <section className="cinematic-page relative min-h-svh overflow-hidden bg-[#020b11] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://assets.mixkit.co/videos/9774/9774-thumb-720-0.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.8),rgba(0,15,21,0.38)_48%,rgba(0,8,14,0.72)),linear-gradient(180deg,rgba(0,0,0,0.48),rgba(0,0,0,0.1)_38%,rgba(0,0,0,0.74))]" />
      <div className="absolute inset-0 bg-[#0c3b3a]/18 mix-blend-color" />
      <div className="bp-film-grain absolute inset-0" />

      <div className="relative z-10 flex min-h-svh items-center justify-center px-[var(--cinematic-screen-x)] pb-14 pt-28 sm:pb-16 sm:pt-32">
        <SignupForm />
      </div>
    </section>
  );
}
