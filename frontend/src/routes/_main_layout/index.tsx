import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/components/main/HomePage";
import { CrewMembers } from "@/components/main/CrewMembers";

export const Route = createFileRoute("/_main_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Home />
      <CrewMembers />
    </>
  );
}