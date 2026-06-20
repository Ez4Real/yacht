import { createFileRoute } from "@tanstack/react-router";
import { team } from "@/lib/members";
import { MemberDetail } from "@/components/main/MemberDetail";

export const Route = createFileRoute("/_main_layout/members/$slug")({
  component: MemberPage,
});

function MemberPage() {
  const { slug } = Route.useParams();

  const member = team.find((item) => item.slug === slug);

  if (!member) {
    return <div>Member not found</div>;
  }

  return <MemberDetail member={member} />;
}