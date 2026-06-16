import { createFileRoute } from "@tanstack/react-router";
import { destinations } from "@/lib/destinations";

export const Route = createFileRoute("/_main_layout/destinations/$slug")({
  component: DestinationPage,
});

function DestinationPage() {
  const { slug } = Route.useParams();

  const destination = destinations.find((item) => item.slug === slug);

  if (!destination) {
    return <div>Destination not found</div>;
  }

  return (
    <div className="flex justify-between">
      <div className="w-1/2">
        <img
          src={destination.imageBig ?? destination.image}
          alt={destination.title}
          className="aspect-[465/330] object-cover"
        />

        {destination.quote && (
          <p className="mt-[80px] font-cursive text-quote max-w-[607px]">
            {destination.quote}
          </p>
        )}
      </div>

      <div className="w-1/2">
        <p className="text-title">
          {destination.title} /{" "}
          <span>
            {destination.country}
            {destination.region ? ` / ${destination.region}` : ""}
          </span>
        </p>

        <p className="mt-[30px] max-w-[617px] text-main">
          {destination.description}{" "}
          <span className="text-role">
            {destination.highlightedDescription}
          </span>{" "}
          {destination.descriptionEnd}
        </p>

        <p className="mt-[30px] max-w-[617px] text-main">
          {destination.cardDescription}
        </p>

        {destination.descriptionSecond && (
          <p className="mt-[80px] max-w-[617px] text-main">
            {destination.descriptionSecond}
          </p>
        )}

        {destination.imageDetail && (
          <>
            <img
              src={destination.imageDetail}
              alt={destination.title}
              className="mt-[80px] max-w-[617px] aspect-[465/230] object-cover"
            />

            {destination.detailImageText && (
              <p className="mt-[80px] max-w-[617px] text-main">
                {destination.detailImageText}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}