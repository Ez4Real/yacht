import { createFileRoute, Link } from "@tanstack/react-router";
import { destinations } from "@/lib/destinations";

export const Route = createFileRoute("/_main_layout/destinations/")({
    component: DestinationsPage,
});

function DestinationsPage() {
  return (
    <div className="grid grid-cols-2 gap-y-[50px] gap-x-[40px] mr-[27px]">
      {destinations.map((destination) => (
        <Link
          key={destination.slug}
          to="/destinations/$slug"
          params={{ slug: destination.slug }}
          className="block"
        >
          <div className="group relative overflow-hidden">
            <img
              src={destination.image}
              alt={destination.title}
              className="w-full aspect-[465/230] object-cover transition-all duration-500 group-hover:brightness-75"
            />

            <div className="absolute inset-0 bg-[#501500]/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex items-center justify-center">
              <span className="text-light-text text-[70px] font-bold font-druk">
                more
              </span>
            </div>
          </div>

          <p className="mt-[20px] text-main font-normal">
            {destination.title} /{" "}
            <span className="text-role">
              {destination.country}
              {destination.region ? ` / ${destination.region}` : ""}
            </span>
          </p>

          <p className="text-main leading-[120%] mt-[10px]">
            {destination.cardDescription ?? destination.description}
          </p>
        </Link>
      ))}
    </div>
  );
}