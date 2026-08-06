import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { CrewMembersService, OpenAPI } from "@/client"

function getCrewMembersQueryOptions() {
  return {
    queryFn: () => CrewMembersService.readCrewMembers({ skip: 0, limit: 100 }),
    queryKey: ["crew_members"],
  }
}

export const Route = createFileRoute("/_main_layout/crew-members/")({
  component: CrewMembers,
})

function CrewMembers() {
  const { data: members } = useSuspenseQuery(getCrewMembersQueryOptions())

  return (
    <div
      className="
      grid 
      mobile:pt-[24px]
      tablet:pt-[0]

      gap-x-[10px]
      tablet:gap-x-[20px]

      gap-y-[30px]
      tablet:gap-y-[32px]

      grid-cols-2 
      tablet:grid-cols-3 
      laptop:grid-cols-5 
      desktop:grid-cols-6
      "
    >
      {members.data?.map((member, index) => (
        <div key={`${member.id}-${index}`}>
          {member.image ? (
            <Link
              to="/crew-members/$id"
              params={{ id: String(member.id) }}
              className="block"
            >
              <img
                src={`${OpenAPI.BASE}/media${member.image.url}`}
                alt={member.first_name}
                className="
                w-full 
                object-cover
                aspect-[180/250]
                tablet:aspect-[229/329]
                laptop:aspect-[213/303]
                wide:aspect-[293/411]
                "
              />
            </Link>
          ) : (
            <div
              className="
            w-full 
            aspect-[180/250]
            tablet:aspect-[229/329]
            laptop:aspect-[213/303]
            wide:aspect-[293/411]
            bg-[#FFF3DB]
            "
            />
          )}

          <p className="mt-[15px] tablet:mt-20px text-small">
            {member.first_name}, {member.role.name}
          </p>
        </div>
      ))}
    </div>
  )
}
