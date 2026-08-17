import { EllipsisVertical } from "lucide-react"
import { useState } from "react"

import type { InfoPagePublic } from "@/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteInfoPage from "./DeleteInfoPage"
import EditInfoPage from "./EditInfoPage"

interface InfoPageActionsMenuProps {
  infoPage: InfoPagePublic
}

export const InfoPageActionsMenu = ({ infoPage }: InfoPageActionsMenuProps) => {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <EditInfoPage infoPage={infoPage} onSuccess={() => setOpen(false)} />
        <DeleteInfoPage id={infoPage.id} onSuccess={() => setOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
