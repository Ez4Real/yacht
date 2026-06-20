import { createFileRoute } from "@tanstack/react-router";
import { destinations } from "@/lib/destinations";
import { DestinationCard } from "@/components/main/DestinationCard";

export const Route = createFileRoute("/_main_layout/destinations/")({
  component: DestinationsPage,
});

function DestinationsPage() {
  return (
    <div className="grid grid-cols-2 gap-y-[50px] gap-x-[49px] mr-[27px]">
      {destinations.map((destination) => (
        <DestinationCard
          key={destination.slug}
          destination={destination}
        />
      ))}
    </div>
  );
}