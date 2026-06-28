import { createFileRoute, Link } from "@tanstack/react-router"
import { team } from "@/lib/members"

export const Route = createFileRoute("/_main_layout/members/")({
  component: MembersPage,
})

function MembersPage() {
  return (
    <div className="
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
      ">
      {team.map((member, index) => (
        <div key={`${member.id}-${index}`}>
          {member.image ? (
            <Link
              to="/members/$id"
              params={{ id: String(member.id) }}
              className="block"
            >
              <img
                src={member.image}
                alt={member.name}
                className="
                w-full 
                object-cover
                aspect-[180/250]
                tablet:aspect-[229/329]
                laptop:aspect-[213/303]
                wide:aspect-[293/411]
                "/>
            </Link>
          ) : (
            <div className="
            w-full 
            aspect-[180/250]
            tablet:aspect-[229/329]
            laptop:aspect-[213/303]
            wide:aspect-[293/411]
            bg-[#FFF3DB]
            "/>
          )}

          <p className="mt-[15px] tablet:mt-20px text-small">
            {member.name}, {member.role}
          </p>
        </div>
      ))}
    </div>
  )
}
