import type { ColumnDef } from "@tanstack/react-table"
import { Check, Copy } from "lucide-react"

import type { InfoPagePublic } from "@/client"
import { OpenAPI } from "@/client"
import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"
import { InfoPageActionsMenu } from "./InfoPagesActionsMenu"

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

export const columns: ColumnDef<InfoPagePublic>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <CopyId id={row.original.id} />,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
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
    accessorKey: "block_1_image.url",
    header: "Block 1 image",
    cell: ({ row }) => {
      if (!row.original.block_1_image)
        return <div className="flex justify-center">N/A</div>

      return (
        <img
          src={`${OpenAPI.BASE}/media${row.original.block_1_image.url}`}
          alt={row.original.block_1_image.alt_text || ""}
          className="h-24 w-24 object-cover rounded-md"
        />
      )
    },
  },
  {
    accessorKey: "block_2_image.url",
    header: "Block 2 image",
    cell: ({ row }) => {
      if (!row.original.block_2_image)
        return <div className="flex justify-center">N/A</div>

      return (
        <img
          src={`${OpenAPI.BASE}/media${row.original.block_2_image.url}`}
          alt={row.original.block_2_image.alt_text || ""}
          className="h-24 w-24 object-cover rounded-md"
        />
      )
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <InfoPageActionsMenu infoPage={row.original} />
      </div>
    ),
  },
]
