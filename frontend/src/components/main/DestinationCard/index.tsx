import { Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

type Destination = {
  slug: string;
  title: string;
  country: string;
  region?: string;
  image: string;
  cardDescription?: string;
  description?: string;
};

type DestinationCardProps = {
  destination: Destination;
};

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <div>
      <Link
        to="/destinations/$slug"
        params={{ slug: destination.slug }}
        className="block"
      >
        <div className="group relative overflow-hidden">
          <img
            src={destination.image}
            alt={destination.title}
            className="w-full aspect-[465/230] object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          <div className="
            absolute 
            inset-0 
            flex 
            items-center 
            justify-center 
            bg-[#501500]/30 
            opacity-0 
            transition-opacity 
            duration-500 
            group-hover:opacity-100
            ">
            <span className="font-druk text-light-text text-[72px] leading-none">
              more
            </span>
          </div>
        </div>
      </Link>

      <Breadcrumb className="mt-[20px]">
        <BreadcrumbList className="text-h2">
          <BreadcrumbItem>
            <BreadcrumbPage className="text-h2">
              {destination.title}
            </BreadcrumbPage>
            <span className="text-h2">/</span>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink
              href="#"
              className="text-h2 text-role hover:text-foreground transition-colors"
            >
              {destination.country}
            </BreadcrumbLink>
          </BreadcrumbItem>

          {destination.region && (
            <BreadcrumbItem>
              <span className="text-h2 text-role">/</span>
              <BreadcrumbLink
                href="#"
                className="text-h2 text-role hover:text-foreground transition-colors"
              >
                {destination.region}
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <p className="text-main-style mt-[10px]">
        {destination.cardDescription ?? destination.description}
      </p>
    </div>
  );
}