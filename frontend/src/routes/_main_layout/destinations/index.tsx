import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { type DestinationPublic, DestinationsService } from "@/client"
import { DestinationCard } from "@/components/main/DestinationCard"

function getDestinationsQueryOptions() {
  return {
    queryFn: () =>
      DestinationsService.readDestinations({ skip: 0, limit: 100 }),
    queryKey: ["destinations"],
  }
}

export const Route = createFileRoute("/_main_layout/destinations/")({
  component: DestinationsPage,
})

function DestinationsPage() {
  const { data: destinations } = useSuspenseQuery(getDestinationsQueryOptions())

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
      {destinations.data.map((destination: DestinationPublic) => (
        <DestinationCard key={destination.id} destination={destination} />
      ))}
    </div>
  )
}
