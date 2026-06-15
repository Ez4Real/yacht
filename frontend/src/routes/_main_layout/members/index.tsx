import { createFileRoute } from "@tanstack/react-router";
import { CrewMembers } from "@/components/main/CrewMembers";

export const Route = createFileRoute("/_main_layout/members/")({
  component: MembersPage,
});

function MembersPage() {
  return <CrewMembers />;
}