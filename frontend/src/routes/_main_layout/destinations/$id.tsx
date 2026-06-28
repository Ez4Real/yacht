import { createFileRoute } from "@tanstack/react-router"
import { DestinationDetail } from "@/components/main/DestinationDetail"
import { destinations } from "@/lib/destinations"

export const Route = createFileRoute("/_main_layout/destinations/$id")({
  component: DestinationPage,
})

function DestinationPage() {
  const { id } = Route.useParams();

  const destination = destinations.find(
    (item) => item.id === Number(id)
  );

  if (!destination) {
    return <div>Destination not found</div>
  }

  return <DestinationDetail destination={destination} />
}
