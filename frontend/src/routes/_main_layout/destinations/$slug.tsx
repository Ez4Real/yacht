import { createFileRoute } from "@tanstack/react-router";
import { destinations } from "@/lib/destinations";
import { DestinationDetail } from "@/components/main/DestinationDetail";

export const Route = createFileRoute("/_main_layout/destinations/$slug")({
  component: DestinationPage,
});

function DestinationPage() {
  const { slug } = Route.useParams();

  const destination = destinations.find((item) => item.slug === slug);

  if (!destination) {
    return <div>Destination not found</div>;
  }

  return <DestinationDetail destination={destination} />;
}