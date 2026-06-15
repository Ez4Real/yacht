import { Link } from "@tanstack/react-router";
import { team } from "@/lib/members";

export function CrewMembers() {
  return (
    <div className="grid grid-cols-6 gap-4">
      {team.map((member, index) => (
        <div key={`${member.slug}-${index}`}>
          {member.image ? (
            <Link
              to="/members/$slug"
              params={{ slug: member.slug }}
              className="block"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full aspect-[310/468] object-cover"
              />
            </Link>
          ) : (
            <div className="w-full aspect-[310/468] bg-[#F1E7CD] dark:bg-[#FFF3DB]" />
          )}

          <p className="mt-5 text-[24px] font-normal text-foreground">
            {member.name}, {member.role}
          </p>
        </div>
      ))}
    </div>
  );
}