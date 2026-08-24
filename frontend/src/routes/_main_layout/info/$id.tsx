import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { InfoPagesService, OpenAPI } from "@/client"

function getInfoPageByIdQueryOptions(id: string) {
  return {
    queryFn: () => InfoPagesService.readInfoPage({ id: id }),
    queryKey: ["info-pages", id],
  }
}

export const Route = createFileRoute("/_main_layout/info/$id")({
  component: InfoPage,
})

function InfoPage() {
  const { id } = Route.useParams()

  const { data: infoPage } = useSuspenseQuery(getInfoPageByIdQueryOptions(id))

  return (
    <div
      className="
        flex 
        flex-col 
        tablet:flex-row 
        justify-between
        mt-[24px]
        tablet:mt-[0px]
      "
    >
      <div>
        {infoPage.banner_image && ( 
          <img
            src={`${OpenAPI.BASE}/media${infoPage.banner_image.url}`}
            alt={infoPage.banner_image.alt_text ?? ""}
            className="
              object-cover
              w-[408px]
              tablet:w-[210px]
              laptop:w-[424px]
              desktop:w-[530px]
              wide:w-[737px]
            "
          />
        )}
          
        <p className="mt-[40px] font-cursive text-quote mobile:hidden laptop:block w-[460px]">
          {infoPage.description}
        </p>
      </div>

      <div className="w-full tablet:w-[66%] laptop:w-[49.1%]">
        <p
          className="
            mt-[55px]
            tablet:mt-0
            capitalize
            leading-[44px]
            text-[36px]
          "
        >
          {infoPage.title}
        </p>

        <p
          className="
            mt-[40px] laptop:mt-[50px] wide:mt-[55px]
            text-main-style
            w-[100%] wide:w-[617px]
            whitespace-pre-line
          "
        >
          {infoPage.content1}
        </p>

        {infoPage.block_1_image && (
          <div
            className="
              mt-[40px]
              laptop:mt-[50px]
              wide:mt-[55px]
            "
          >
            <img
              src={`${OpenAPI.BASE}/media${infoPage.block_1_image.url}`}
              alt={infoPage.block_1_image.alt_text ?? ""}
              className="object-cover w-[408px]"
            />
          </div>
        )}

        {infoPage.content2 && (
          <p
            className="
              text-main-style
              mt-[40px] laptop:mt-[50px] wide:mt-[55px]
              w-[100%] wide:w-[617px]
              whitespace-pre-line
            "
          >
            {infoPage.content2}
          </p>
        )}

        {infoPage.block_2_image && (
          <div
            className="
              mt-[40px]
              laptop:mt-[50px]
              wide:mt-[55px]
            "
          >
            <img
              src={`${OpenAPI.BASE}/media${infoPage.block_2_image.url}`}
              alt={infoPage.block_2_image.alt_text ?? ""}
              className="object-cover w-[408px]"
            />
          </div>
        )}

        {infoPage.content3 && (
          <p
            className="
              text-main-style
              mt-[40px] laptop:mt-[50px] wide:mt-[55px]
              w-[100%] wide:w-[617px]
              whitespace-pre-line
            "
          >
            {infoPage.content3}
          </p>
        )}


        {infoPage.services && (
          <div
            className="
              mt-[100px]
              w-[100%] wide:w-[617px]
            "
          >
            <p
              className="
                text-[36px]
                leading-[44px]
              "
            >
              {infoPage.services.title}
            </p>

            <p
              className="
                mt-[55px]
                text-[26px]
                leading-[31px]
                whitespace-pre-line
              "
            >
              {infoPage.services.content}
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
