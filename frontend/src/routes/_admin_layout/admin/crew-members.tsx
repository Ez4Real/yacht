import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { Suspense, useState } from "react"

import { CrewMemberPublic, CrewMembersService } from "@/client"
import { DataTable } from "@/components/Common/DataTable"
import AddMember from "@/components/CrewMembers/AddMember"
import { getColumns } from "@/components/CrewMembers/columns"
import PendingCrewMembers from "@/components/Pending/PendingCrewMembers"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"

function getCrewMembersQueryOptions() {
  return {
    queryFn: () => CrewMembersService.readCrewMembers({ skip: 0, limit: 100 }),
    queryKey: ["crew_members"],
  }
}

export const Route = createFileRoute("/_admin_layout/admin/crew-members")({
  component: CrewMembers,
  head: () => ({
    meta: [
      {
        title: "Crew Member Management",
      },
    ],
  }),
})


interface UpdateCrewMemberOrderProps {
  id: string
  order: number
}

function CrewMembersTableContent() {
  const queryClient = useQueryClient()

  const { data: members } = useSuspenseQuery(getCrewMembersQueryOptions())

  const [pendingMemberId, setPendingMemberId] = useState<string | null>(
    null,
  )
  const { showSuccessToast, showErrorToast } = useCustomToast()

  const mutation = useMutation({
    mutationFn: ({id, order}: UpdateCrewMemberOrderProps) =>
      CrewMembersService.updateCrewMemberOrder({
        id,
        order
      }),
    onMutate: ({ id }) => {
      setPendingMemberId(id)
    },
    onSuccess: () => {
      showSuccessToast("Member order updated successfully")
    },
    onError: handleError.bind(showErrorToast),
    onSettled: async () => {
      setPendingMemberId(null)

      await queryClient.invalidateQueries({
        queryKey: ["crew_members"],
      })
    },
  })

  const handleChangeOrder = (
    member: CrewMemberPublic,
    order: number,
  ) => {
    mutation.mutate({
      id: member.id,
      order,
    })
  }

  if (members.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">
          You don't have any crew members yet
        </h3>
        <p className="text-muted-foreground">
          Add a new crew member to get started
        </p>
      </div>
    )
  }

  return (
    <DataTable
      columns={getColumns(
        handleChangeOrder,
        members.data.length,
        (memberId) => memberId === pendingMemberId,
      )}
      data={members.data}
    />
  )
}

function CrewMembersTable() {
  return (
    <Suspense fallback={<PendingCrewMembers />}>
      <CrewMembersTableContent />
    </Suspense>
  )
}

function CrewMembers() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Crew Members</h1>
          <p className="text-muted-foreground">
            Create and manage your crew members
          </p>
        </div>
        <AddMember />
      </div>
      <CrewMembersTable />
    </div>
  )
}
