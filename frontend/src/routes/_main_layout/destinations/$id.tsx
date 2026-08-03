import { createFileRoute } from "@tanstack/react-router"
import { DestinationsService, OpenAPI } from "@/client"
import { useSuspenseQuery } from "@tanstack/react-query"


function getDestinationByIdQueryOptions(id: string) {
  return {
    queryFn: () => DestinationsService.readDestination({ id: id }),
    queryKey: ["destination"],
  }
}

export const Route = createFileRoute("/_main_layout/destinations/$id")({
  component: DestinationPage,
})

function DestinationPage() {
  const { id } = Route.useParams()

  const { data: destination } = useSuspenseQuery(getDestinationByIdQueryOptions(id))

  return (
    <div className="
          flex 
          flex-col 
          tablet:flex-row 
          justify-between 
        ">
      <div
        className="
          mt-[24px]
          tablet:mt-[0px]
        "
      >
        <img
          src={`${OpenAPI.BASE}/media${destination.banner_image.url}`}
          alt={destination.banner_image.alt_text ?? ""}
          className="
            object-cover 
            w-[100%]
            tablet:w-[220px]
            laptop:w-[424px]
            desktop:w-[530px]
            wide:w-[737px]
          "
        />

        {destination.description && (
          <p
            className="
              font-cursive
              text-quote
              mt-[40px]
              tablet:w-[160px]
              laptop:w-[424px]
              desktop:w-[530px]
              wide:w-[737px]
              hidden 
              laptop:block
              text-main-style
            "
          >
            {destination.description}
          </p>
        )}
      </div>

      <div className="tablet:w-[66%] laptop:w-[49.1%]">

        
          <p className="text-h2 mt-[40px] tablet:mt-[0px]">
            {destination.destination} /{" "}

            <span>
              {destination.country}
              {destination.region ? ` / ${destination.region}` : ""}
            </span>

          </p>

          <p className="
          mt-[40px]
          text-main-style
          whitespace-pre-line
          wide:w-[617px]
          desktop:w-[617px]
        "
          >
            {destination.content1}{" "}
            {/* <span className="text-role text-main-style whitespace-pre-line wide:w-[617px] desktop:w-[617px]">
            {destination.highlightedDescription}
          </span>{" "}
          {destination.descriptionEnd} */}
          </p>

          <p className="mt-[40px] text-main-style whitespace-pre-line wide:w-[617px] desktop:w-[617px]">
            {destination.description}
          </p>

          {destination.content2 && (
            <p className="mt-[40px] text-main-style whitespace-pre-line wide:w-[617px] desktop:w-[617px]">
              {destination.content2}
            </p>
          )}

          {destination.side_image && (
            <>
              <img
                src={`${OpenAPI.BASE}/media${destination.side_image.url}`}
                alt={destination.side_image.alt_text ?? ""}
                className="mt-[40px] object-cover wide:w-[617px] desktop:w-[617px]"
              />

              {destination.content2 && (
                <p className="mt-[40px] text-main-style whitespace-pre-line wide:w-[617px] desktop:w-[617px]">
                  {destination.content2}
                </p>
              )}
            </>
          )}
      </div>
    </div>
  )
}
