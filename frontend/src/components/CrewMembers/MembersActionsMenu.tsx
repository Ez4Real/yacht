import { EllipsisVertical, Pencil } from "lucide-react"
import { useState } from "react"

import type { CrewMemberPublic } from "@/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteMember from "./DeleteMember"
import EditMember from "./EditMember"

interface RoleActionsMenuProps {
  member: CrewMemberPublic
}

export const MemberActionsMenu = ({ member }: RoleActionsMenuProps) => {
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Pencil />
            Edit Member
          </DropdownMenuItem>

          <DeleteMember id={member.id} onSuccess={() => setOpen(false)} />
        </DropdownMenuContent>
      </DropdownMenu>

      <EditMember member={member} open={editOpen} onOpenChange={setEditOpen} />
    </>
  )
}
