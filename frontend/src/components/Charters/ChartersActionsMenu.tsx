// import { EllipsisVertical } from "lucide-react"
// import { useState } from "react"

// import type { CharterPublic } from "@/client"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import DeleteCharter from "./DeleteCharter"
// import EditCharter from "./EditCharter"

// interface CharterActionsMenuProps {
//   charter: CharterPublic
// }

// export const CharterActionsMenu = ({
//   charter,
// }: CharterActionsMenuProps) => {
//   const [open, setOpen] = useState(false)

//   return (
//     <DropdownMenu open={open} onOpenChange={setOpen}>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size="icon">
//           <EllipsisVertical />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <EditCharter
//           charter={charter}
//           onSuccess={() => setOpen(false)}
//         />
//         <DeleteCharter
//           id={charter.id}
//           onSuccess={() => setOpen(false)}
//         />
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }
