import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { Suspense } from "react"

import { CrewMemberRolesService } from "@/client"
import { DataTable } from "@/components/Common/DataTable"
import AddRole from "@/components/CrewMemberRoles/AddRole"
import { columns } from "@/components/CrewMemberRoles/columns"
import PendingCrewMemberRoles from "@/components/Pending/PendingCrewMemberRoles"

function getCrewMemberRolesQueryOptions() {
  return {
    queryFn: () => CrewMemberRolesService.readCrewMemberRoles({ skip: 0, limit: 100 }),
    queryKey: ["crew_member_roles"],
  }
}

export const Route = createFileRoute("/_layout/crew-member-role")({
  component: CrewMemberRoles,
  head: () => ({
    meta: [
      {
        title: "Crew Member Role Management",
      },
    ],
  }),
})

function RolesTableContent() {
  const { data: roles } = useSuspenseQuery(getCrewMemberRolesQueryOptions())

  if (roles.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">You don't have any roles yet</h3>
        <p className="text-muted-foreground">Add a new role to get started</p>
      </div>
    )
  }

  return <DataTable columns={columns} data={roles.data} />
}

function CrewMemberRolesTable() {
  return (
    <Suspense fallback={<PendingCrewMemberRoles />}>
      <RolesTableContent />
    </Suspense>
  )
}

function CrewMemberRoles() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Crew Member Roles</h1>
          <p className="text-muted-foreground">Create and manage your crew member roles</p>
        </div>
        <AddRole />
      </div>
      <CrewMemberRolesTable />
    </div>
  )
}
