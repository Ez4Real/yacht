import { EllipsisVertical } from "lucide-react"
import { useState } from "react"

import type { DestinationPublic } from "@/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteDestination from "./DeleteDestination"
import EditDestination from "./EditDestination"

interface DestinationActionsMenuProps {
  destination: DestinationPublic
}

export const DestinationActionsMenu = ({ destination }: DestinationActionsMenuProps) => {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <EditDestination destination={destination} onSuccess={() => setOpen(false)} />
        <DeleteDestination id={destination.id} onSuccess={() => setOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
