import { createFileRoute } from "@tanstack/react-router"
import { DestinationCard } from "@/components/main/DestinationCard"
import { destinations } from "@/lib/destinations"

export const Route = createFileRoute("/_main_layout/destinations/")({
  component: DestinationsPage,
})

function DestinationsPage() {
  return (
    <div
      className="
        grid
        grid-cols-1
        laptop:grid-cols-2

        gap-y-[40px]
        tablet:gap-y-[50px]

        gap-x-[20px]
        desktop:gap-x-[49px]
      "
    >
      {destinations.map((destination) => (
        <DestinationCard
          key={destination.id}
          destination={destination}
        />
      ))}
    </div>
  )
}
