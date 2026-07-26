import type { ColumnDef } from "@tanstack/react-table"
import { Check, Copy } from "lucide-react"

import type { DestinationPublic } from "@/client"
import { OpenAPI } from "@/client"
import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"
import { DestinationActionsMenu } from "./DestinationsActionsMenu"

function CopyId({ id }: { id: string }) {
  const [copiedText, copy] = useCopyToClipboard()
  const isCopied = copiedText === id

  return (
    <div className="flex items-center gap-1.5 group">
      <span className="font-mono text-xs text-muted-foreground">{id}</span>
      <Button
        variant="ghost"
        size="icon"
        className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => copy(id)}
      >
        {isCopied ? (
          <Check className="size-3 text-green-500" />
        ) : (
          <Copy className="size-3" />
        )}
        <span className="sr-only">Copy ID</span>
      </Button>
    </div>
  )
}

export const columns: ColumnDef<DestinationPublic>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <CopyId id={row.original.id} />,
  },
  {
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.region}</span>
    ),
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.country}</span>
    ),
  },
  {
    accessorKey: "destination",
    header: "Destination",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.destination}</span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => (
      <span className="font-medium">
        {new Date(row.original.created_at).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="block max-w-[180px] text-sm truncate">
        {row.original.description}
      </span>
    ),
  },
  {
    accessorKey: "banner_image.url",
    header: "Banner image",
    cell: ({ row }) => (
      <img
        src={`${OpenAPI.BASE}/media${row.original.banner_image.url}`}
        alt={row.original.banner_image.alt_text || ""}
        className="h-24 w-24 object-cover rounded-md"
      />
    ),
  },
  {
    accessorKey: "side_image.url",
    header: "Side image",
    cell: ({ row }) => (
      <img
        src={`${OpenAPI.BASE}/media${row.original.side_image.url}`}
        alt={row.original.side_image.alt_text || ""}
        className="h-24 w-24 object-cover rounded-md"
      />
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DestinationActionsMenu destination={row.original} />
      </div>
    ),
  },
]
