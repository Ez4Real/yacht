import { createFileRoute } from "@tanstack/react-router";
import { team } from "@/lib/members";
import { MemberDetail } from "@/components/main/MemberDetail";

export const Route = createFileRoute("/_main_layout/members/$id")({
  component: MemberPage,
});

function MemberPage() {
  const { id } = Route.useParams();

  const currentIndex = team.findIndex((item) => item.id === Number(id));
  const member = team[currentIndex];

  if (!member) {
    return <div>Member not found</div>;
  }

  const prevMember = team[currentIndex - 1];
  const nextMember = team[currentIndex + 1];

  return (
    <MemberDetail
      member={member}
      prevMember={prevMember}
      nextMember={nextMember}
      currentIndex={currentIndex}
      total={team.length}
    />
  );
}