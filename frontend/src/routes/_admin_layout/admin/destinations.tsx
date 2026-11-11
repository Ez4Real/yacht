import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { Suspense, useState } from "react"

import { type DestinationPublic, DestinationsService } from "@/client"
import { DataTable } from "@/components/Common/DataTable"
import AddDestination from "@/components/Destinations/AddDestination"
import { getColumns } from "@/components/Destinations/columns"
import PendingDestinations from "@/components/Pending/PendingDestinations"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"

function getDestinationsQueryOptions() {
  return {
    queryFn: () =>
      DestinationsService.readDestinations({ skip: 0, limit: 100 }),
    queryKey: ["destinations"],
  }
}

export const Route = createFileRoute("/_admin_layout/admin/destinations")({
  component: Destinations,
  head: () => ({
    meta: [
      {
        title: "Destination Management",
      },
    ],
  }),
})

interface UpdateDestinationOrderProps {
  id: string
  order: number
}

function DestinationsTableContent() {
  const queryClient = useQueryClient()

  const { data: destinations } = useSuspenseQuery(getDestinationsQueryOptions())

  const [pendingDestinationId, setPendingDestinationId] = useState<
    string | null
  >(null)
  const { showSuccessToast, showErrorToast } = useCustomToast()

  const mutation = useMutation({
    mutationFn: ({ id, order }: UpdateDestinationOrderProps) =>
      DestinationsService.updateDestinationOrder({
        id,
        order,
      }),
    onMutate: ({ id }) => {
      setPendingDestinationId(id)
    },
    onSuccess: () => {
      showSuccessToast("Destination order updated successfully")
    },
    onError: handleError.bind(showErrorToast),
    onSettled: async () => {
      setPendingDestinationId(null)

      await queryClient.invalidateQueries({
        queryKey: ["destinations"],
      })
    },
  })

  const handleChangeOrder = (destination: DestinationPublic, order: number) => {
    mutation.mutate({
      id: destination.id,
      order,
    })
  }

  if (destinations.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">
          You don't have any destinations yet
        </h3>
        <p className="text-muted-foreground">
          Add a new destination to get started
        </p>
      </div>
    )
  }

  return (
    <DataTable
      columns={getColumns(
        handleChangeOrder,
        destinations.data.length,
        (destinationId) => destinationId === pendingDestinationId,
      )}
      data={destinations.data}
    />
  )
}

function DestinationsTable() {
  return (
    <Suspense fallback={<PendingDestinations />}>
      <DestinationsTableContent />
    </Suspense>
  )
}

function Destinations() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Destinations</h1>
          <p className="text-muted-foreground">
            Create and manage your destinations
          </p>
        </div>
        <AddDestination />
      </div>
      <DestinationsTable />
    </div>
  )
}
