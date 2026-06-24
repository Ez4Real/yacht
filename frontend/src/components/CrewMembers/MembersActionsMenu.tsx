import { EllipsisVertical } from "lucide-react"
import { useState } from "react"

import type { CrewMemberPublic } from "@/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EditMember from "./EditMember"
import DeleteMember from "./DeleteMember"

interface RoleActionsMenuProps {
  member: CrewMemberPublic
}

export const MemberActionsMenu = ({ member }: RoleActionsMenuProps) => {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <EditMember member={member} onSuccess={() => setOpen(false)} />
        <DeleteMember id={member.id} onSuccess={() => setOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
