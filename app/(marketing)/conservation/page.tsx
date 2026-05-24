import { CinematicMarketingPage } from "@/app/components/CinematicMarketingPage";

export default function ConservationPage() {
  return (
    <CinematicMarketingPage
      title="Fund The Water"
      body="Five percent of every confirmed booking is pledged to conservation, queued after confirmation, and tracked separately from booking state."
      primaryHref="https://wa.me/628213143342"
      primaryLabel="Ask Kai"
      secondaryHref="/for-operators"
      secondaryLabel="For operators"
      backgroundImage="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1800&q=80"
      titleClassName="text-[clamp(2.25rem,5vw,4rem)]"
      features={[
        {
          title: "After confirmation",
          body: "Transfers are queued only once the trip has crossed the confirmed booking state.",
        },
        {
          title: "Separate ledger",
          body: "Conservation records stay distinct from booking transitions for cleaner auditing.",
        },
        {
          title: "Built to mature",
          body: "The model can grow with integrations while keeping the pledge legible.",
        },
      ]}
    />
  );
}
