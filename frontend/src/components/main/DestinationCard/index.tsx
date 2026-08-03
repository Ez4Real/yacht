import { Link } from "@tanstack/react-router"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { DestinationPublic, OpenAPI } from "@/client"

type DestinationCardProps = {
  destination: DestinationPublic
}

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <div>
      <Link
        to="/destinations/$id"
        params={{ id: String(destination.id) }}
        className="block"
      >
        <div className="
              group 
              relative 
              overflow-hidden
              
              w-[100%]
              tablet:w-[727px]
              laptop:w-[560px]
              desktop:w-[881px]
              wide:w-[881px]

              h-[352px]
              tablet:h-[349px]
              desktop:h-[393px]
              wide:h-[437px]
            ">
          <img
            src={`${OpenAPI.BASE}/media${destination.banner_image.url}`}
            alt={destination.banner_image.alt_text ?? ""}
            className="
              w-full
              h-full
              object-cover
              transition-transform
              duration-700
              ease-out
              group-hover:scale-110
            "
          />

          <div
            className="
              absolute inset-0
              flex items-center justify-center
              bg-[#501500]/30
              opacity-0
              transition-opacity duration-500
              group-hover:opacity-100
            "
          >
            <span
              className="
                font-druk text-light-text leading-none
                text-[42px]
                tablet:text-[48px]
                laptop:text-[56px]
                desktop:text-[72px]
                wide:text-[96px]
              "
            >
              more
            </span>
          </div>
        </div>
      </Link>

      <Breadcrumb
        className="
          mt-[20px]
        "
      >
        <BreadcrumbList className="text-h2">
          <BreadcrumbItem>

            <BreadcrumbPage>
              {destination.destination}
            </BreadcrumbPage>

            <span>/</span>
            
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink
              href="#"
              className="text-role hover:text-foreground transition-colors"
            >
              {destination.country}
            </BreadcrumbLink>
          </BreadcrumbItem>

          {destination.region && (
            <BreadcrumbItem>

              <span className="text-role">/</span>

              <BreadcrumbLink
                href="#"
                className="text-role hover:text-foreground transition-colors"
              >
                {destination.region}
              </BreadcrumbLink>
              
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <p
        className="
          text-main-style
          mt-[10px]
        "
      >
        {destination.description ?? destination.description}
      </p>
    </div>
  )
}
