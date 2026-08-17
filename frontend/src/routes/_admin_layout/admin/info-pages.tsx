import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { Suspense } from "react"

import { InfoPagesService } from "@/client"
import { DataTable } from "@/components/Common/DataTable"
import AddInfoPage from "@/components/InfoPages/AddInfoPage"
import { columns } from "@/components/InfoPages/columns"
import PendingInfoPages from "@/components/Pending/PendingInfoPages"

function getInfoPagesQueryOptions() {
  return {
    queryFn: () => InfoPagesService.readInfoPages({ skip: 0, limit: 100 }),
    queryKey: ["info-pages"],
  }
}

export const Route = createFileRoute("/_admin_layout/admin/info-pages")({
  component: InfoPages,
  head: () => ({
    meta: [
      {
        title: "Info Page Management",
      },
    ],
  }),
})

function InfoPagesTableContent() {
  const { data: infoPages } = useSuspenseQuery(getInfoPagesQueryOptions())

  if (infoPages.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">
          You don't have any info pages yet
        </h3>
        <p className="text-muted-foreground">
          Add a new info page to get started
        </p>
      </div>
    )
  }

  return <DataTable columns={columns} data={infoPages.data} />
}

function InfoPagesTable() {
  return (
    <Suspense fallback={<PendingInfoPages />}>
      <InfoPagesTableContent />
    </Suspense>
  )
}

function InfoPages() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Info Pages</h1>
          <p className="text-muted-foreground">
            Create and manage your info pages
          </p>
        </div>
        <AddInfoPage />
      </div>
      <InfoPagesTable />
    </div>
  )
}
