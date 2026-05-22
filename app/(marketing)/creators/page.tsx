import { CinematicMarketingPage } from "@/app/components/CinematicMarketingPage";

export default function CreatorsPage() {
  return (
    <CinematicMarketingPage
      eyebrow="03 / Creators"
      title="Share Ocean Stories"
      body="Creator attribution can share BluePass commission when stories lead to confirmed trips, while operators and travellers keep the booking path clear."
      primaryHref="https://wa.me/628213143342"
      primaryLabel="Partner with Kai"
      secondaryHref="/conservation"
      secondaryLabel="Conservation"
      features={[
        {
          title: "Attribution",
          body: "Creator-sourced bookings can carry a clear share of BluePass commission.",
        },
        {
          title: "Aligned incentives",
          body: "Stories, operators, and conservation can point toward the same confirmed trip.",
        },
        {
          title: "Simple terms",
          body: "Commission remains capped, with creator share calculated from BluePass commission.",
        },
      ]}
    />
  );
}
