import { createFileRoute, Link } from "@tanstack/react-router"
import { CrewMembersService, OpenAPI } from "@/client"

export const Route = createFileRoute("/_main_layout/crew-members/$id")({
  loader: async ({ params }) => {
    return CrewMembersService.readCrewMember({ id: params.id })
  },
  component: MemberPage,
})

function MemberPage() {
  const member = Route.useLoaderData()

  const crewMember = member.member
  const navigation = member.navigation

  return (
    <div
      key={crewMember.id}
      className="
        flex
        flex-col
        tablet:flex-row
        justify-between
        pt-[24px]
        tablet:pt-0
      "
    >
      <div className="flex flex-col items-center gap-[30px]">
        {crewMember.image && (
          <div
            className="animate-member-block"
            style={{ animationDelay: "0ms" }}
          >
            <img
              src={`${OpenAPI.BASE}/media${crewMember.image.url}`}
              alt={crewMember.first_name}
              className="
                object-cover

                w-[370px]
                tablet:w-[160px]
                laptop:w-[320px]
                desktop:w-[360px]
                wide:w-[470px]

                h-[440px]
                tablet:h-[225px]
                laptop:h-[450px]
                desktop:h-[506px]
                wide:h-[660px]
              "
            />
          </div>
        )}

        {/* Desktop navigation */}
        <div
          className="
            hidden
            laptop:flex
            justify-between
            text-main-nav
            w-full
            animate-member-block
          "
          style={{ animationDelay: "450ms" }}
        >
          <Link
            to="/crew-members/$id"
            params={{ id: navigation.previous }}
            className="transition-opacity hover:opacity-60"
          >
            <img
              src="/assets/icons/arrow-left.svg"
              alt="Previous member"
            />
          </Link>

          <div className="flex items-center w-[35px]">
            <span className="text-foreground nav-btn-detail">
              {navigation.position}
            </span>

            <span className="text-role nav-btn-detail">
              /{navigation.total}
            </span>
          </div>

          <Link
            to="/crew-members/$id"
            params={{ id: navigation.next }}
            className="transition-opacity hover:opacity-60"
          >
            <img
              src="/assets/icons/arrow-right.svg"
              alt="Next member"
            />
          </Link>
        </div>
      </div>

      <div className="w-full tablet:w-[66%] laptop:w-[49.1%]">
        <div
          className="
            flex
            items-end
            mt-[20px]
            tablet:mt-0
            animate-member-block
          "
          style={{ animationDelay: "100ms" }}
        >
          <span className="text-h2 mr-[10px]">
            {crewMember.first_name}
          </span>

          <span
            className="
              text-role
              font-light
              text-[18px]
              desktop:text-[22px]
              leading-[25px]
              tracking-[2%]
            "
          >
            / {crewMember.role.name}
          </span>
        </div>

        <div
          className="
            max-w-[370px]
            tablet:max-w-[478px]
            laptop:max-w-[570px]
            desktop:max-w-[650px]
            wide:max-w-[730px]
          "
        >
          <p
            className="
              text-main-style
              mt-[30px]
              tablet:mt-[20px]
              laptop:mt-[30px]
              animate-member-block
            "
            style={{ animationDelay: "200ms" }}
          >
            {crewMember.background}
          </p>

          {/* {member.descriptionSecond && (
            <p className="mt-[40px] laptop:mt-[50px] wide:mt-[55px] text-main-style">
              {member.descriptionSecond}
            </p>
          )} */}

          {crewMember.motto && (
            <p
              className="
                mt-[40px]
                laptop:mt-[50px]
                wide:mt-[55px]
                font-cursive
                text-quote
                animate-member-block
              "
              style={{ animationDelay: "320ms" }}
            >
              {crewMember.motto}
            </p>
          )}
        </div>

        {/* Mobile navigation */}
        <div
          className="
            flex
            laptop:hidden
            mt-[40px]
            justify-between
            items-center
            animate-member-block
          "
          style={{ animationDelay: "450ms" }}
        >
          <Link
            to="/crew-members/$id"
            params={{ id: navigation.previous }}
            className="transition-opacity hover:opacity-60"
          >
            <img
              src="/assets/icons/arrow-left.svg"
              alt="Previous member"
            />
          </Link>

          <div className="flex items-center w-[35px]">
            <span className="text-foreground nav-btn-detail">
              {navigation.position}
            </span>

            <span className="text-role nav-btn-detail">
              /{navigation.total}
            </span>
          </div>

          <Link
            to="/crew-members/$id"
            params={{ id: navigation.next }}
            className="transition-opacity hover:opacity-60"
          >
            <img
              src="/assets/icons/arrow-right.svg"
              alt="Next member"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}