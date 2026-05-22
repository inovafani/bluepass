import { CinematicMarketingPage } from "@/app/components/CinematicMarketingPage";

export default function ForOperatorsPage() {
  return (
    <CinematicMarketingPage
      eyebrow="01 / Operators"
      title="Accept Bookings"
      body="Keep booking acceptance in WhatsApp Business while BluePass coordinates traveller intent, PMS holds, payment readiness, and audit-friendly booking events."
      primaryHref="/app"
      primaryLabel="Open workspace"
      secondaryHref="/conservation"
      secondaryLabel="View model"
      features={[
        {
          title: "WhatsApp action",
          body: "Accept, decline, or counter without moving the operator workflow into another inbox.",
        },
        {
          title: "Payment timing",
          body: "Traveller payment starts only after acceptance and the operational hold is ready.",
        },
        {
          title: "Clear commission",
          body: "The marketplace commission stays capped, readable, and separate from conservation.",
        },
      ]}
    />
  );
}
