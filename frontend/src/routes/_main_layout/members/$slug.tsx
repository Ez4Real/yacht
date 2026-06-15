import { createFileRoute } from "@tanstack/react-router";
import { team } from "@/lib/members";

export const Route = createFileRoute("/_main_layout/members/$slug")({
  component: CrewMemberPage,
});

function CrewMemberPage() {
  const { slug } = Route.useParams();

  const member = team.find((item) => item.slug === slug);

  if (!member) {
    return <div>Member not found!</div>;
  }

  return (
    <div className="flex justify-between pb-[148px]">
      <div className="w-1/2">
        {member.image && (
          <img
            src={member.image}
            alt={member.name}
          />
        )}
      </div>

      <div className="w-[50%]">
        <div className="flex gap-[10px] h=[44px]">
          <p className="font-inter text-title font-normal">
            {member.name}
          </p>
          <span className="text-[22px] text-role leading-[120%] mt-[10px]">
            / {member.role}
          </span>
        </div>

        <p className="mt-[30px] text-main">
          {member.description}
        </p>

        <p className="mt-[80px] text-main">
          {member.descriptionSecond}
        </p>

        <p className="mt-[80px] font-cursive text-quote">
          {member.quote}
        </p>
      </div>
    </div>
  );
}