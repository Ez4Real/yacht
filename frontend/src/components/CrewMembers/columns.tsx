import type { ColumnDef } from "@tanstack/react-table"
import { Check, Copy } from "lucide-react"

import type { CrewMemberPublic } from "@/client"
import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"
import { MemberActionsMenu } from "./MembersActionsMenu"
import { OpenAPI } from "@/client"


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

export const columns: ColumnDef<CrewMemberPublic>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <CopyId id={row.original.id} />,
  },
  {
    accessorKey: "first_name",
    header: "First name",
    cell: ({ row }) => <span className="font-medium">{row.original.first_name}</span>,
  },
  {
    accessorKey: "last_name",
    header: "Last name",
    cell: ({ row }) => <span className="font-medium">{row.original.last_name}</span>,
  },
  {
    accessorKey: "role.name",
    header: "Role",
    cell: ({ row }) => <span className="font-medium">{row.original.role.name}</span>,
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => <span className="font-medium">{new Date(row.original.created_at).toLocaleString()}</span>,
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => <span className="font-medium">{row.original.color}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="font-medium">{row.original.email}</span>,
  },
  {
    accessorKey: "instagram",
    header: "Instagram",
    cell: ({ row }) => <span className="font-medium">{row.original.instagram}</span>,
  },
  // {
  //   accessorKey: "background",
  //   header: "Background",
  //   cell: ({ row }) => <span className="font-medium">{row.original.background}</span>,
  // },
  // {
  //   accessorKey: "motto",
  //   header: "Motto",
  //   cell: ({ row }) => <span className="font-medium">{row.original.motto}</span>,
  // },
  {
    accessorKey: "image.url",
    header: "Image",
    cell: ({ row }) => (
      <img
        src={`${OpenAPI.BASE}/media${row.original.image.url}`} 
        alt={row.original.image.alt_text || ""}
        className="h-16 w-16 object-cover rounded-md"
      />
    ) // <span className="font-medium">{row.original.image.url}</span>,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <MemberActionsMenu member={row.original} />
      </div>
    ),
  },
]
